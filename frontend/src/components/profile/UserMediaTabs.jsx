import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../toasts";
import MediaCard from "./MediaCard";

const UserMediaTabs = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [favorites, setFavorites] = useState({ movies: [], series: [] });
  const [watched, setWatched] = useState({ movies: [], series: [] });
  const [reviews, setReviews] = useState([]);
  const [customLists, setCustomLists] = useState([]);
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState({
    favorites: false,
    watched: false,
    reviews: false,
    lists: false
  });

  /**
   * Fetches media data for a review
   * @param {string} reviewId - The ID of the review
   * @returns {Promise<Object|null>} Media data or null if not found
   */
  const fetchMediaForReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}/media`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error(`Fehler beim Laden der Mediendaten für Review ${reviewId}:`, error);
      return null;
    }
  };

  /**
   * fetches the reviews of the user from the API and enriches them with media data
   * @returns {void}
   */
  useEffect(() => {
    if (!userId) return;

    setLoading(prev => ({ ...prev, reviews: true }));
    fetch(`http://localhost:8080/api/reviews/user/${userId}`)
      .then(res => res.ok ? res.json() : [])
      .then(async (data) => {
        const validReviews = Array.isArray(data) ? data.filter(review => review && review.id) : [];

        const enrichedReviews = await Promise.all(
          validReviews.map(async (review) => {
            const mediaData = await fetchMediaForReview(review.id);
            return {
              ...review,
              mediaData: mediaData 
            };
          })
        );

        setReviews(enrichedReviews);
      })
      .catch(err => console.error("Fehler beim Laden der Reviews:", err))
      .finally(() => setLoading(prev => ({ ...prev, reviews: false })));
  }, [userId]);

  /**
   * fetches the user's favorites (movies and series) from the API
   * @returns {void}
   */
  useEffect(() => {
    if (activeTab !== "favorites" || !userId) return;

    setLoading(prev => ({ ...prev, favorites: true }));
    Promise.all([
      fetch(`http://localhost:8080/api/users/${userId}/favorites/movies`).then(res => res.ok ? res.json() : []),
      fetch(`http://localhost:8080/api/users/${userId}/favorites/series`).then(res => res.ok ? res.json() : [])
    ])
      .then(([movies, series]) => {
        const validMovies = Array.isArray(movies) ? movies.filter(movie => movie && movie.id) : [];
        const validSeries = Array.isArray(series) ? series.filter(serie => serie && serie.id) : [];
        setFavorites({ movies: validMovies, series: validSeries });
      })
      .catch(err => console.error("Fehler beim Laden der Favoriten:", err))
      .finally(() => setLoading(prev => ({ ...prev, favorites: false })));
  }, [userId, activeTab]);

  /**
   * fetches the user's watched movies and series from the API
   * @returns {void} 
   */
  useEffect(() => {
    if (activeTab !== "watched" || !userId) return;

    setLoading(prev => ({ ...prev, watched: true }));
    Promise.all([
      fetch(`http://localhost:8080/api/users/${userId}/watched/movies`).then(res => res.ok ? res.json() : []),
      fetch(`http://localhost:8080/api/users/${userId}/watched/series`).then(res => res.ok ? res.json() : [])
    ])
      .then(([movies, series]) => {
        const validMovies = Array.isArray(movies) ? movies.filter(movie => movie && movie.id) : [];
        const validSeries = Array.isArray(series) ? series.filter(serie => serie && serie.id) : [];
        setWatched({ movies: validMovies, series: validSeries });
      })
      .catch(err => console.error("Fehler beim Laden der gesehenen Medien:", err))
      .finally(() => setLoading(prev => ({ ...prev, watched: false })));
  }, [userId, activeTab]);

  /**
   * fetches the user's custom lists from the API
   * @returns {void}
   */
  useEffect(() => {
    if (activeTab !== "lists" || !userId) return;

    setLoading(prev => ({ ...prev, lists: true }));
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    fetch(`http://localhost:8080/api/lists/user/${userId}`, { headers })
      .then(res => res.ok ? res.json() : [])
      .then((data) => {
        const validLists = Array.isArray(data) ? data.filter(list => list && list.id) : [];
        setCustomLists(validLists);
      })
      .catch(err => console.error("Fehler beim Laden der Listen:", err))
      .finally(() => setLoading(prev => ({ ...prev, lists: false })));
  }, [userId, activeTab]);

  /**
   * Removes a movie/series from favorites
   * @param {string} mediaId - The ID of the media to remove
   * @param {string} mediaType - "movie" or "series"
   * @returns {Promise<void>}
   */
  const removeFromFavorites = async (mediaId, mediaType) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/favorites/${mediaType}s/${mediaId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFavorites(prev => ({
          ...prev,
          [mediaType + 's']: prev[mediaType + 's'].filter(item => item.id !== mediaId)
        }));
        success(`${mediaType === 'movie' ? 'Film' : 'Serie'} aus Favoriten entfernt!`);
      } else {
        console.error(`Fehler beim Entfernen aus Favoriten: ${response.status}`);
        showError('Fehler beim Entfernen aus Favoriten');
      }
    } catch (error) {
      console.error('Fehler beim Entfernen aus Favoriten:', error);
      showError('Fehler beim Entfernen aus Favoriten');
    }
  };

  /**
   * Removes a movie/series from watched list
   * @param {string} mediaId - The ID of the media to remove
   * @param {string} mediaType - "movie" or "series"
   * @returns {Promise<void>}
   */
  const removeFromWatched = async (mediaId, mediaType) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/watched/${mediaType}s/${mediaId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWatched(prev => ({
          ...prev,
          [mediaType + 's']: prev[mediaType + 's'].filter(item => item.id !== mediaId)
        }));
        success(`${mediaType === 'movie' ? 'Film' : 'Serie'} aus gesehenen Medien entfernt!`);
      } else {
        console.error(`Fehler beim Entfernen aus gesehenen Medien: ${response.status}`);
        showError('Fehler beim Entfernen aus gesehenen Medien');
      }
    } catch (error) {
      console.error('Fehler beim Entfernen aus gesehenen Medien:', error);
      showError('Fehler beim Entfernen aus gesehenen Medien');
    }
  };

  /**
 * Determines the correct navigation route for a media item based on the review data
 * @param {Object} review - The review object
 * @returns {string|null} The route path or null if no route can be determined
 */
  const getMediaRoute = (review) => {
    if (review.mediaData) {
      const { type, data } = review.mediaData;
      if (data && data.id) {
        return `/${type === "movie" ? "movies" : "series"}/${data.id}`;
      }
    }

    if (review.movie && review.movie.id) {
      return `/movies/${review.movie.id}`;
    }

    if (review.series && review.series.id) {
      return `/series/${review.series.id}`;
    }

    if (review.movieId) {
      return `/movies/${review.movieId}`;
    }

    if (review.seriesId) {
      return `/series/${review.seriesId}`;
    }

    return null;
  };

  /**
   * renders the media title with appropriate link based on media data
   * @param {Object} review - The review object with mediaData
   * @param {boolean} withLink - Whether to render with link or just text
   * @returns {JSX.Element} The rendered media title
   */
  const renderMediaTitle = (review, withLink = true) => {
    if (review.movie) {
      const content = (
        <>
          🎬 {review.movie.title}
        </>
      );
      return withLink ? (
        <Link to={`/movies/${review.movie.id}`} className="text-decoration-none">
          {content}
        </Link>
      ) : content;
    }

    if (review.series) {
      const content = (
        <>
          📺 {review.series.title}
        </>
      );
      return withLink ? (
        <Link to={`/series/${review.series.id}`} className="text-decoration-none">
          {content}
        </Link>
      ) : content;
    }
    
    if (review.mediaData) {
      const { type, data } = review.mediaData;
      const isMovie = type === "movie";
      const route = isMovie ? `/movies/${data.id}` : `/series/${data.id}`;
      const icon = isMovie ? "🎬" : "📺";
      const content = (
        <>
          {icon} {data.title}
        </>
      );

      return withLink ? (
        <Link to={route} className="text-decoration-none">
          {content}
        </Link>
      ) : content;
    }

    return <span>Unbekannter Inhalt</span>;
  };

  return (
    <div className="mt-4">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reviews' ? 'active bg-primary text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('reviews')}
          >
            <i className="bi bi-star-fill me-1"></i>
            Bewertungen
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'favorites' ? 'active bg-primary text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('favorites')}
          >
            <i className="bi bi-heart-fill me-1"></i>
            Favoriten
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'watched' ? 'active bg-primary text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('watched')}
          >
            <i className="bi bi-eye-fill me-1"></i>
            Gesehen
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'lists' ? 'active bg-primary text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('lists')}
          >
            <i className="bi bi-list-ul me-1"></i>
            Listen
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Reviews Tab Content */}
        {activeTab === 'reviews' && (
          <div className="tab-pane fade show active">
            {loading.reviews ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="list-group">
                {reviews.map(review => {
                  const mediaRoute = getMediaRoute(review);
                  return (
                    <Link
                      key={review.id}
                      to={mediaRoute || '#'}
                      className="list-group-item list-group-item-action text-decoration-none"
                      style={{ cursor: mediaRoute ? 'pointer' : 'default' }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-1">
                          {renderMediaTitle(review, false)}
                        </h6>
                        <span className="badge bg-warning text-dark">
                          {"⭐".repeat(review.rating)}
                        </span>
                      </div>
                      <p className="mb-1">{review.comment || "Kein Kommentar"}</p>
                      <small className="text-muted">
                        Bewertet am: {new Date(review.date).toLocaleDateString()}
                      </small>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="alert alert-light text-center">
                Noch keine Bewertungen vorhanden.
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab Content */}
        {activeTab === 'favorites' && (
          <div className="tab-pane fade show active">
            {loading.favorites ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <h5 className="my-3">
                  <i className="bi bi-film me-2"></i>
                  Filme
                </h5>
                {favorites.movies.length > 0 ? (
                  <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 mb-4">
                    {favorites.movies.map(movie => (
                      <div className="col" key={movie.id}>
                        <div className="position-relative">
                          <MediaCard media={movie} type="movie" />
                          <button
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => removeFromFavorites(movie.id, 'movie')}
                            title="Aus Favoriten entfernen"
                            style={{ zIndex: 10 }}
                          >
                            <i className="bi bi-heart-fill"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light text-center mb-4">
                    Keine Lieblingsfilme vorhanden.
                  </div>
                )}

                <h5 className="my-3">
                  <i className="bi bi-tv me-2"></i>
                  Serien
                </h5>
                {favorites.series.length > 0 ? (
                  <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                    {favorites.series.map(series => (
                      <div className="col" key={series.id}>
                        <div className="position-relative">
                          <MediaCard media={series} type="series" />
                          <button
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => removeFromFavorites(series.id, 'series')}
                            title="Aus Favoriten entfernen"
                            style={{ zIndex: 10 }}
                          >
                            <i className="bi bi-heart-fill"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light text-center">
                    Keine Lieblingsserien vorhanden.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Watched Tab Content */}
        {activeTab === 'watched' && (
          <div className="tab-pane fade show active">
            {loading.watched ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <h5 className="my-3">
                  <i className="bi bi-film me-2"></i>
                  Filme
                </h5>
                {watched.movies.length > 0 ? (
                  <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 mb-4">
                    {watched.movies.map(movie => (
                      <div className="col" key={movie.id}>
                        <div className="position-relative">
                          <MediaCard media={movie} type="movie" />
                          <button
                            className="btn btn-secondary btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => removeFromWatched(movie.id, 'movie')}
                            title="Aus gesehenen Filmen entfernen"
                            style={{ zIndex: 10 }}
                          >
                            <i className="bi bi-eye-slash-fill"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light text-center mb-4">
                    Keine gesehenen Filme vorhanden.
                  </div>
                )}

                <h5 className="my-3">
                  <i className="bi bi-tv me-2"></i>
                  Serien
                </h5>
                {watched.series.length > 0 ? (
                  <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                    {watched.series.map(series => (
                      <div className="col" key={series.id}>
                        <div className="position-relative">
                          <MediaCard media={series} type="series" />
                          <button
                            className="btn btn-secondary btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => removeFromWatched(series.id, 'series')}
                            title="Aus gesehenen Serien entfernen"
                            style={{ zIndex: 10 }}
                          >
                            <i className="bi bi-eye-slash-fill"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light text-center">
                    Keine gesehenen Serien vorhanden.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Lists Tab Content */}
        {activeTab === 'lists' && (
          <div className="tab-pane fade show active">
            {loading.lists ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : customLists.length > 0 ? (
              <div className="row">
                {customLists.map(list => (
                  <div className="col-md-6 col-lg-4 mb-4" key={list.id}>
                    <div className="card h-100">
                      <div className="position-relative">
                        <Link to={`/lists/${list.id}`}>
                          <img
                            src={list.coverImageUrl || (list.movies?.[0]?.posterUrl || list.series?.[0]?.posterUrl || 'https://via.placeholder.com/300x400?text=Liste')}
                            alt={list.title}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x400?text=Liste';
                            }}
                          />
                        </Link>
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className={`badge ${list.public ? 'bg-success' : 'bg-secondary'}`}>
                            <i className={`bi bi-${list.public ? 'globe' : 'lock'} me-1`}></i>
                            {list.public ? 'Öffentlich' : 'Privat'}
                          </span>
                        </div>
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-dark bg-opacity-75">
                            {list.totalItemsCount} {list.totalItemsCount === 1 ? 'Element' : 'Elemente'}
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link to={`/lists/${list.id}`} className="text-decoration-none">
                            {list.title}
                          </Link>
                        </h5>
                        {list.description && (
                          <p className="card-text text-muted small">
                            {list.description.length > 100 
                              ? `${list.description.substring(0, 100)}...` 
                              : list.description
                            }
                          </p>
                        )}
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {new Date(list.updatedAt).toLocaleDateString('de-DE')}
                          </small>
                          <div>
                            <span className="text-muted me-2">
                              <i className="bi bi-heart"></i> {list.likesCount}
                            </span>
                            <Link to={`/lists/${list.id}`} className="btn btn-outline-primary btn-sm">
                              <i className="bi bi-eye"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-light text-center">
                <i className="bi bi-list-ul mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                <h5>Keine Listen vorhanden</h5>
                <p className="text-muted">Du hast noch keine Listen erstellt.</p>
                <Link to="/lists" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Erste Liste erstellen
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMediaTabs;