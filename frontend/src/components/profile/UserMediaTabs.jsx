import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MediaCard from "./MediaCard";

const UserMediaTabs = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [favorites, setFavorites] = useState({ movies: [], series: [] });
  const [watched, setWatched] = useState({ movies: [], series: [] });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState({
    favorites: false,
    watched: false,
    reviews: false
  });

  // Laden der Bewertungen
  useEffect(() => {
    if (!userId) return;
    
    setLoading(prev => ({ ...prev, reviews: true }));
    fetch(`http://localhost:8080/api/reviews/user/${userId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        // Filtern ungültiger Daten
        const validReviews = Array.isArray(data) ? data.filter(review => review && review.id) : [];
        setReviews(validReviews);
      })
      .catch(err => console.error("Fehler beim Laden der Reviews:", err))
      .finally(() => setLoading(prev => ({ ...prev, reviews: false })));
  }, [userId]);

  // Laden der Favoriten
  useEffect(() => {
    if (activeTab !== "favorites" || !userId) return;
    
    setLoading(prev => ({ ...prev, favorites: true }));
    Promise.all([
      fetch(`http://localhost:8080/api/users/${userId}/favorites/movies`).then(res => res.ok ? res.json() : []),
      fetch(`http://localhost:8080/api/users/${userId}/favorites/series`).then(res => res.ok ? res.json() : [])
    ])
      .then(([movies, series]) => {
        // Filtern ungültiger Daten
        const validMovies = Array.isArray(movies) ? movies.filter(movie => movie && movie.id) : [];
        const validSeries = Array.isArray(series) ? series.filter(serie => serie && serie.id) : [];
        setFavorites({ movies: validMovies, series: validSeries });
      })
      .catch(err => console.error("Fehler beim Laden der Favoriten:", err))
      .finally(() => setLoading(prev => ({ ...prev, favorites: false })));
  }, [userId, activeTab]);

  // Laden der gesehenen Medien
  useEffect(() => {
    if (activeTab !== "watched" || !userId) return;
    
    setLoading(prev => ({ ...prev, watched: true }));
    Promise.all([
      fetch(`http://localhost:8080/api/users/${userId}/watched/movies`).then(res => res.ok ? res.json() : []),
      fetch(`http://localhost:8080/api/users/${userId}/watched/series`).then(res => res.ok ? res.json() : [])
    ])
      .then(([movies, series]) => {
        // Filtern ungültiger Daten
        const validMovies = Array.isArray(movies) ? movies.filter(movie => movie && movie.id) : [];
        const validSeries = Array.isArray(series) ? series.filter(serie => serie && serie.id) : [];
        setWatched({ movies: validMovies, series: validSeries });
      })
      .catch(err => console.error("Fehler beim Laden der gesehenen Medien:", err))
      .finally(() => setLoading(prev => ({ ...prev, watched: false })));
  }, [userId, activeTab]);

  return (
    <div className="mt-4">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <i className="bi bi-star-fill me-1"></i>
            Bewertungen
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <i className="bi bi-heart-fill me-1"></i>
            Favoriten
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'watched' ? 'active' : ''}`}
            onClick={() => setActiveTab('watched')}
          >
            <i className="bi bi-eye-fill me-1"></i>
            Gesehen
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
                {reviews.map(review => (
                  <div key={review.id} className="list-group-item list-group-item-action">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-1">
                        {review.movie ? (
                          <Link to={`/movies/${review.movie.id}`} className="text-decoration-none">
                            🎬 {review.movie.title}
                          </Link>
                        ) : review.series ? (
                          <Link to={`/series/${review.series.id}`} className="text-decoration-none">
                            📺 {review.series.title}
                          </Link>
                        ) : (
                          <span>Unbekannter Inhalt</span>
                        )}
                      </h6>
                      <span className="badge bg-warning text-dark">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="mb-1">{review.comment || "Kein Kommentar"}</p>
                    <small className="text-muted">
                      Bewertet am: {new Date(review.date).toLocaleDateString()}
                    </small>
                  </div>
                ))}
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
                        <MediaCard media={movie} type="movie" />
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
                        <MediaCard media={series} type="series" />
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
                        <MediaCard media={movie} type="movie" />
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
                        <MediaCard media={series} type="series" />
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
      </div>
    </div>
  );
};

export default UserMediaTabs;