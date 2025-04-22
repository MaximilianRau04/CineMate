import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaFilm, FaInfoCircle } from "react-icons/fa";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  /**
   * fetches the currently logged in user from the API  
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
   */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist`)
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Watchlist");
        return res.json();
      })
      .then((data) => {
        setWatchlist(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Watchlist:", err);
        setLoading(false);
      });
  }, [userId]);

  /**
   * removes a movie from the watchlist
   * @param {*} movieId 
   * @returns 
   */
  const removeFromWatchlist = (movieId) => {
    if (!window.confirm("Möchtest du diesen Film wirklich entfernen?")) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/${movieId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Entfernen des Films");
        setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
      })
      .catch((err) => {
        console.error("Fehler beim Entfernen des Films:", err);
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

  if (watchlist.length === 0) {
    return (
      <div className="text-center mt-5 p-5 bg-dark bg-opacity-50 rounded shadow">
        <FaFilm size={48} className="text-muted" />
        <p className="mt-3 text-white fs-5">
          Noch keine Filme in der Watchlist.
        </p>
        <Link to="/movies" className="btn btn-outline-info mt-3">
          Filme entdecken
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center text-light">⭐ Deine Watchlist</h2>
      <div className="row">
        {watchlist.map((movie) => (
          <div className="col-md-6 col-lg-4 mb-4" key={movie.id}>
            <div className="card h-100 d-flex flex-column">
              {/* Poster-Wrapper */}
              <div
                className="d-flex align-items-center justify-content-center bg-white"
                style={{ height: "400px" }}
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  className="img-fluid"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x450?text=No+Image";
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text text-secondary mb-3">{movie.genre}</p>
                </div>
                <div>
                  <Link
                    to={`/movies/${movie.id}`}
                    className="btn btn-outline-info btn-sm me-2"
                  >
                    <FaInfoCircle className="me-1" />
                    Details
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromWatchlist(movie.id)}
                  >
                    <FaTrashAlt className="me-1" />
                    Entfernen
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
