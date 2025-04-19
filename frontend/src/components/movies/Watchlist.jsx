import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * watchlist component to display the user's watchlist
 * allows users to remove movies from the watchlist
 * @returns {JSX.Element}
 */
const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  /**
   * Fetches the current user's ID from the API
   */
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setUserId(data.id);
        } else {
          console.error("Benutzer nicht gefunden.");
        }
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen des Benutzers:", err);
      });
  }, []); // empty dependency array to run only once on mount

  /**
   * Fetches the user's watchlist from the API
   * and updates the state with the fetched data
   */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist`, {})
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
  }, [userId]); // userId as dependency to fetch watchlist when userId is available

  /**
   * removes a movie from the user's watchlist
   * @param {*} movieId 
   */
  const removeFromWatchlist = (movieId) => {
    if (window.confirm("Möchtest du diesen Film wirklich entfernen?")) {
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
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-4 text-white">Watchlist wird geladen...</p>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center mt-5 p-5 bg-dark bg-opacity-25 rounded">
        <i className="bi bi-film" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
        <p className="mt-3 text-white fs-5">Noch keine Filme in der Watchlist.</p>
        <Link to="/movies" className="btn btn-outline-light mt-3">
          Filme entdecken
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center text-indigo-700 text-white">
        ⭐ Deine Watchlist
      </h2>
      <div className="row">
        {watchlist.map((movie) => (
          <div className="col-md-4 mb-3" key={movie.id}>
            <div className="card h-100">
              {/* movie poster */}
              <img
                src={movie.posterUrl}
                className="card-img-top"
                alt={movie.title}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x450?text=No+Image";
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.genre}</p>
                <Link
                  to={`/movies/${movie.id}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  Details
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => removeFromWatchlist(movie.id)}
                >
                  Entfernen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
