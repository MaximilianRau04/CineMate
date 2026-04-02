import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaFilm, FaInfoCircle } from "react-icons/fa";
import api from "../../utils/api";

const Watchlist = () => {
  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [seriesWatchlist, setSeriesWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("movies");

  /**
   * fetches the currently logged in user from the API
   * @returns {void}
   */
  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        const data = res.data;
        if (data?.id) setUserId(data.id);
      })
      .catch((err) => console.error("Fehler beim Abrufen des Benutzers:", err));
  }, []);

  /**
   * fetches the watchlist of the user from the API
   * @param {string} userId - ID of the user whose watchlist is to be fetched
   * @returns {void}
   */
  useEffect(() => {
    if (!userId) return;
    Promise.all([
      api.get(`/users/${userId}/watchlist/movies`).then((res) => res.data),
      api.get(`/users/${userId}/watchlist/series`).then((res) => res.data),
    ])
      .then(([movies, series]) => {
        setMovieWatchlist(movies);
        setSeriesWatchlist(series);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Watchlists:", err);
        setLoading(false);
      });
  }, [userId]);

  /**
   * removes a movie from the watchlist of the user
   * @param {*} movieId - ID of the movie to remove
   * @returns {void}
   */
  const removeMovieFromWatchlist = (movieId) => {
    if (!window.confirm("Möchtest du diesen Film wirklich entfernen?")) return;
    api
      .delete(`/users/${userId}/watchlist/movies/${movieId}`)
      .then(() =>
        setMovieWatchlist((prev) => prev.filter((m) => m.id !== movieId)),
      )
      .catch((err) => console.error("Fehler beim Entfernen des Films:", err));
  };

  /**
   * removes a series from the watchlist of the user
   * @param {*} seriesId - the ID of the series to remove
   * @returns {void}
   */
  const removeSeriesFromWatchlist = (seriesId) => {
    if (!window.confirm("Möchtest du diese Serie wirklich entfernen?")) return;
    api
      .delete(`/users/${userId}/watchlist/series/${seriesId}`)
      .then(() =>
        setSeriesWatchlist((prev) => prev.filter((s) => s.id !== seriesId)),
      )
      .catch((err) => console.error("Fehler beim Entfernen der Serie:", err));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Watchlist wird geladen...</p>
      </div>
    );
  }

  if (movieWatchlist.length === 0 && seriesWatchlist.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <FaFilm size={48} className="text-muted mb-3" />
          <h5 className="text-muted">Deine Watchlist ist noch leer.</h5>
          <Link to="/explore" className="btn btn-primary mt-3">
            Filme &amp; Serien entdecken
          </Link>
        </div>
      </div>
    );
  }

  const MediaCard = ({ item, onRemove, linkPrefix }) => (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div style={{ position: "relative", paddingTop: "100%" }}>
          <img
            src={item.posterUrl}
            alt={item.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x450?text=No+Image";
            }}
          />
        </div>
        <div className="card-body d-flex flex-column p-2">
          <h6
            className="card-title mb-1 fw-semibold"
            style={{
              fontSize: "0.85rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.title}
          </h6>
          {item.genre && (
            <p
              className="text-muted mb-2"
              style={{ fontSize: "0.75rem" }}
            >
              {item.genre}
            </p>
          )}
          <div className="mt-auto d-flex gap-1">
            <Link
              to={`/${linkPrefix}/${item.id}`}
              className="btn btn-outline-primary btn-sm flex-fill"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.4rem" }}
            >
              <FaInfoCircle className="me-1" />
              Details
            </Link>
            <button
              className="btn btn-outline-danger btn-sm"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
              onClick={onRemove}
              title="Entfernen"
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center fw-bold">⭐ Deine Watchlist</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "movies" ? "active" : ""}`}
            onClick={() => setActiveTab("movies")}
          >
            🎬 Filme
            <span className="badge bg-secondary ms-2">{movieWatchlist.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "series" ? "active" : ""}`}
            onClick={() => setActiveTab("series")}
          >
            📺 Serien
            <span className="badge bg-secondary ms-2">{seriesWatchlist.length}</span>
          </button>
        </li>
      </ul>

      {/* Movies */}
      {activeTab === "movies" && (
        movieWatchlist.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaFilm size={36} className="mb-3 opacity-50" />
            <p>Noch keine Filme in deiner Watchlist.</p>
          </div>
        ) : (
          <div className="row">
            {movieWatchlist.map((movie) => (
              <MediaCard
                key={movie.id}
                item={movie}
                linkPrefix="movies"
                onRemove={() => removeMovieFromWatchlist(movie.id)}
              />
            ))}
          </div>
        )
      )}

      {/* Series */}
      {activeTab === "series" && (
        seriesWatchlist.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaFilm size={36} className="mb-3 opacity-50" />
            <p>Noch keine Serien in deiner Watchlist.</p>
          </div>
        ) : (
          <div className="row">
            {seriesWatchlist.map((serie) => (
              <MediaCard
                key={serie.id}
                item={serie}
                linkPrefix="series"
                onRemove={() => removeSeriesFromWatchlist(serie.id)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Watchlist;
