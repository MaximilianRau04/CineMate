import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaFilm, FaInfoCircle } from "react-icons/fa";

const Watchlist = () => {
  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [seriesWatchlist, setSeriesWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  /**
   * fetches the currently logged in user from the API
   * @returns {void}
   */
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) setUserId(data.id);
      })
      .catch((err) => console.error("Fehler beim Abrufen des Benutzers:", err));
  }, []);

  /**
   * fetches the watchlist of the user from the API
   * @param {string} userId 
   * @returns {void}
   */
  useEffect(() => {
    if (!userId) return;

    Promise.all([
      fetch(`http://localhost:8080/api/users/${userId}/watchlist/movies`).then((res) => res.json()),
      fetch(`http://localhost:8080/api/users/${userId}/watchlist/series`).then((res) => res.json())
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
   * @param {*} movieId 
   * @returns {void}
   */
  const removeMovieFromWatchlist = (movieId) => {
    if (!window.confirm("Möchtest du diesen Film wirklich entfernen?")) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/movies/${movieId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Entfernen des Films");
        setMovieWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
      })
      .catch((err) => {
        console.error("Fehler beim Entfernen des Films:", err);
      });
  };

  /**
   * removes a series from the watchlist of the user
   * @param {*} seriesId 
   * @returns {void}
   */
  const removeSeriesFromWatchlist = (seriesId) => {
    if (!window.confirm("Möchtest du diese Serie wirklich entfernen?")) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/series/${seriesId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Entfernen der Serie");
        setSeriesWatchlist((prev) => prev.filter((serie) => serie.id !== seriesId));
      })
      .catch((err) => {
        console.error("Fehler beim Entfernen der Serie:", err);
      });
  };

  if (loading) {
    return (
      <div className="text-center py-5 text-light">
        <div className="spinner-border text-info" role="status" />
        <p className="mt-3">Watchlist wird geladen...</p>
      </div>
    );
  }

  if (movieWatchlist.length === 0 && seriesWatchlist.length === 0) {
    return (
      <div className="text-center mt-5 p-5 bg-dark bg-opacity-50 rounded shadow">
        <FaFilm size={48} className="text-muted" />
        <p className="mt-3 text-white fs-5">
          Deine Watchlist ist noch leer.
        </p>
        <Link to="/movies" className="btn btn-outline-info mt-3">
          Filme und Serien entdecken
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center text-light">⭐ Deine Watchlist</h2>

      {/* movies */}
      {movieWatchlist.length > 0 && (
        <>
          <h3 className="text-light mb-3">🎬 Filme</h3>
          <div className="row">
            {movieWatchlist.map((movie) => (
              <div className="col-md-6 col-lg-4 mb-4" key={movie.id}>
                <div className="card h-100 d-flex flex-column">
                  <div
                    className="d-flex align-items-center justify-content-center bg-white"
                    style={{ height: "400px" }}
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="img-fluid"
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="card-text text-secondary mb-3">{movie.genre}</p>
                    </div>
                    <div>
                      <Link to={`/movies/${movie.id}`} className="btn btn-outline-info btn-sm me-2">
                        <FaInfoCircle className="me-1" /> Details
                      </Link>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => removeMovieFromWatchlist(movie.id)}>
                        <FaTrashAlt className="me-1" /> Entfernen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* series */}
      {seriesWatchlist.length > 0 && (
        <>
          <h3 className="text-light mt-5 mb-3">📺 Serien</h3>
          <div className="row">
            {seriesWatchlist.map((serie) => (
              <div className="col-md-6 col-lg-4 mb-4" key={serie.id}>
                <div className="card h-100 d-flex flex-column">
                  <div
                    className="d-flex align-items-center justify-content-center bg-white"
                    style={{ height: "400px" }}
                  >
                    <img
                      src={serie.posterUrl}
                      alt={serie.title}
                      className="img-fluid"
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{serie.title}</h5>
                      <p className="card-text text-secondary mb-3">{serie.genre}</p>
                    </div>
                    <div>
                      <Link to={`/series/${serie.id}`} className="btn btn-outline-info btn-sm me-2">
                        <FaInfoCircle className="me-1" /> Details
                      </Link>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => removeSeriesFromWatchlist(serie.id)}>
                        <FaTrashAlt className="me-1" /> Entfernen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Watchlist;
