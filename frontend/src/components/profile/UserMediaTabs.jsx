import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../toasts";
import MediaCard from "./MediaCard";
import ListCard from "../lists/ListCard";
import api from "../../utils/api";
import { useTranslation } from "../../i18n/I18nContext";

const UserMediaTabs = ({ userId, readOnly = false }) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [favorites, setFavorites] = useState({ movies: [], series: [] });
  const [watched, setWatched] = useState({ movies: [], series: [] });
  const [reviews, setReviews] = useState([]);
  const [customLists, setCustomLists] = useState([]);
  const { success, error: showError } = useToast();
  const { t, formatDate } = useTranslation();
  const [loading, setLoading] = useState({
    favorites: false,
    watched: false,
    reviews: false,
    lists: false,
  });

  /**
   * Fetches media data for a review
   * @param {string} reviewId - The ID of the review
   * @returns {Promise<Object|null>} Media data or null if not found
   */
  const fetchMediaForReview = async (reviewId) => {
    try {
      const { data } = await api.get(`/reviews/${reviewId}/media`);
      return data;
    } catch (error) {
      console.error(
        `Fehler beim Laden der Mediendaten für Review ${reviewId}:`,
        error,
      );
      return null;
    }
  };

  /**
   * fetches the reviews of the user from the API and enriches them with media data
   * @returns {void}
   */
  useEffect(() => {
    if (!userId) return;

    setLoading((prev) => ({ ...prev, reviews: true }));
    api
      .get(`/reviews/user/${userId}`)
      .then((res) => (Array.isArray(res.data) ? res.data : []))
      .then(async (data) => {
        const validReviews = data.filter((review) => review && review.id);

        const enrichedReviews = await Promise.all(
          validReviews.map(async (review) => {
            const mediaData = await fetchMediaForReview(review.id);
            return {
              ...review,
              mediaData: mediaData,
            };
          }),
        );

        setReviews(enrichedReviews);
      })
      .catch((err) => console.error("Fehler beim Laden der Reviews:", err))
      .finally(() => setLoading((prev) => ({ ...prev, reviews: false })));
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * fetches the user's favorites (movies and series) from the API
   * @returns {void}
   */
  useEffect(() => {
    if (activeTab !== "favorites" || !userId) return;

    setLoading((prev) => ({ ...prev, favorites: true }));
    Promise.all([
      api
        .get(`/users/${userId}/favorites/movies`)
        .then((res) => res.data)
        .catch(() => []),
      api
        .get(`/users/${userId}/favorites/series`)
        .then((res) => res.data)
        .catch(() => []),
    ])
      .then(([movies, series]) => {
        const validMovies = Array.isArray(movies)
          ? movies.filter((movie) => movie && movie.id)
          : [];
        const validSeries = Array.isArray(series)
          ? series.filter((serie) => serie && serie.id)
          : [];
        setFavorites({ movies: validMovies, series: validSeries });
      })
      .catch((err) => console.error("Fehler beim Laden der Favoriten:", err))
      .finally(() => setLoading((prev) => ({ ...prev, favorites: false })));
  }, [userId, activeTab]);

  /**
   * fetches the user's watched movies and series from the API
   * @returns {void}
   */
  useEffect(() => {
    if (activeTab !== "watched" || !userId) return;

    setLoading((prev) => ({ ...prev, watched: true }));
    Promise.all([
      api
        .get(`/users/${userId}/watched/movies`)
        .then((res) => res.data)
        .catch(() => []),
      api
        .get(`/users/${userId}/watched/series`)
        .then((res) => res.data)
        .catch(() => []),
    ])
      .then(([movies, series]) => {
        const validMovies = Array.isArray(movies)
          ? movies.filter((movie) => movie && movie.id)
          : [];
        const validSeries = Array.isArray(series)
          ? series.filter((serie) => serie && serie.id)
          : [];
        setWatched({ movies: validMovies, series: validSeries });
      })
      .catch((err) =>
        console.error("Fehler beim Laden der gesehenen Medien:", err),
      )
      .finally(() => setLoading((prev) => ({ ...prev, watched: false })));
  }, [userId, activeTab]);

  /**
   * fetches the user's custom lists from the API
   * @returns {void}
   */
  useEffect(() => {
    if (activeTab !== "lists" || !userId) return;

    setLoading((prev) => ({ ...prev, lists: true }));
    api
      .get(`/lists/user/${userId}`)
      .then((res) => res.data)
      .then((data) => {
        const validLists = Array.isArray(data)
          ? data.filter((list) => list && list.id)
          : [];
        setCustomLists(validLists);
      })
      .catch((err) => console.error("Fehler beim Laden der Listen:", err))
      .finally(() => setLoading((prev) => ({ ...prev, lists: false })));
  }, [userId, activeTab]);

  /**
   * Removes a movie/series from favorites
   * @param {string} mediaId - The ID of the media to remove
   * @param {string} mediaType - "movie" or "series"
   * @returns {Promise<void>}
   */
  const removeFromFavorites = async (mediaId, mediaType) => {
    try {
      const plural = mediaType === "movie" ? "movies" : "series";
      await api.delete(`/users/${userId}/favorites/${plural}/${mediaId}`);
      setFavorites((prev) => ({
        ...prev,
        [plural]: prev[plural].filter((item) => item.id !== mediaId),
      }));
      success(t("profile.removedFromFavorites"));
    } catch (error) {
      console.error("Fehler beim Entfernen aus Favoriten:", error);
      showError(t("profile.removeFromFavoritesError"));
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
      const plural = mediaType === "movie" ? "movies" : "series";
      await api.delete(`/users/${userId}/watched/${plural}/${mediaId}`);
      setWatched((prev) => ({
        ...prev,
        [plural]: prev[plural].filter((item) => item.id !== mediaId),
      }));
      success(t("profile.removedFromWatched"));
    } catch (error) {
      console.error("Fehler beim Entfernen aus gesehenen Medien:", error);
      showError(t("profile.removeFromWatchedError"));
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
      const content = <>{review.movie.title}</>;
      return withLink ? (
        <Link
          to={`/movies/${review.movie.id}`}
          className="text-decoration-none"
        >
          {content}
        </Link>
      ) : (
        content
      );
    }

    if (review.series) {
      const content = <>{review.series.title}</>;
      return withLink ? (
        <Link
          to={`/series/${review.series.id}`}
          className="text-decoration-none"
        >
          {content}
        </Link>
      ) : (
        content
      );
    }

    if (review.mediaData) {
      const { type, data } = review.mediaData;
      const isMovie = type === "movie";
      const route = isMovie ? `/movies/${data.id}` : `/series/${data.id}`;
      const content = <>{data.title}</>;

      return withLink ? (
        <Link to={route} className="text-decoration-none">
          {content}
        </Link>
      ) : (
        content
      );
    }

    return <span>{t("profile.unknownContent")}</span>;
  };

  const tabs = [
    { key: "reviews", label: t("profile.tabs.reviews"), icon: "bi-star" },
    { key: "favorites", label: t("profile.tabs.favorites"), icon: "bi-heart" },
    { key: "watched", label: t("profile.tabs.watched"), icon: "bi-eye" },
    { key: "lists", label: t("profile.tabs.lists"), icon: "bi-collection" },
  ];

  const spinner = (
    <div className="text-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{t("common.loading")}</span>
      </div>
    </div>
  );

  /**
   * Renders a poster grid with a remove button on every card.
   */
  const renderMediaGroup = (items, type, emptyText, onRemove, removeLabel) => (
    <>
      <h3 className="cm-subhead">
        {type === "movie" ? t("common.movies") : t("common.seriesPlural")}
        <span className="cm-count ms-2">{items.length}</span>
      </h3>
      {items.length > 0 ? (
        <div className="cm-poster-grid cm-poster-grid-sm mb-4">
          {items.map((item) => (
            <div className="position-relative" key={item.id}>
              <MediaCard media={item} type={type} />
              {!readOnly && (
                <button
                  type="button"
                  className="cm-card-remove"
                  onClick={() => onRemove(item.id, type)}
                  title={removeLabel}
                  aria-label={removeLabel}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mb-4">{emptyText}</p>
      )}
    </>
  );

  return (
    <div>
      <ul className="nav nav-tabs mb-4">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`bi ${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {activeTab === "reviews" &&
        (loading.reviews ? (
          spinner
        ) : reviews.length > 0 ? (
          <div className="cm-review-list">
            {reviews.map((review) => {
              const mediaRoute = getMediaRoute(review);
              return (
                <Link
                  key={review.id}
                  to={mediaRoute || "#"}
                  className="cm-review-row"
                >
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <h4 className="cm-review-row-title">
                      {renderMediaTitle(review, false)}
                    </h4>
                    <span className="cm-rating cm-mono">
                      <i className="bi bi-star-fill me-1" />
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="mb-1">
                    {review.comment || (
                      <span className="text-muted fst-italic">
                        {t("profile.noComment")}
                      </span>
                    )}
                  </p>
                  <small className="text-muted cm-mono">
                    {formatDate(review.date)}
                  </small>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-muted">{t("profile.noReviews")}</p>
        ))}

      {activeTab === "favorites" &&
        (loading.favorites ? (
          spinner
        ) : (
          <>
            {renderMediaGroup(
              favorites.movies,
              "movie",
              t("profile.noFavoriteMovies"),
              removeFromFavorites,
              t("profile.removeFromFavorites"),
            )}
            {renderMediaGroup(
              favorites.series,
              "series",
              t("profile.noFavoriteSeries"),
              removeFromFavorites,
              t("profile.removeFromFavorites"),
            )}
          </>
        ))}

      {activeTab === "watched" &&
        (loading.watched ? (
          spinner
        ) : (
          <>
            {renderMediaGroup(
              watched.movies,
              "movie",
              t("profile.noWatchedMovies"),
              removeFromWatched,
              t("profile.removeFromWatched"),
            )}
            {renderMediaGroup(
              watched.series,
              "series",
              t("profile.noWatchedSeries"),
              removeFromWatched,
              t("profile.removeFromWatched"),
            )}
          </>
        ))}

      {activeTab === "lists" &&
        (loading.lists ? (
          spinner
        ) : customLists.length > 0 ? (
          <div className="row">
            {customLists.map((list) => (
              <div className="col-md-6 col-lg-4 mb-4" key={list.id}>
                <ListCard list={list} />
              </div>
            ))}
          </div>
        ) : (
          <div className="cm-empty py-4">
            <h3>{t("lists.noOwnLists")}</h3>
            <p>{t("lists.noOwnListsHint")}</p>
            <Link to="/lists" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              {t("lists.createFirst")}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default UserMediaTabs;
