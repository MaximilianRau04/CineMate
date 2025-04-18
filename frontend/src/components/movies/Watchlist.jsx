import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]); // Initialisierung als leeres Array
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}` // Wenn du ein Token verwendest
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setUserId(data.id); // Benutzer-ID setzen
        } else {
          console.error("Benutzer nicht gefunden.");
        }
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen des Benutzers:", err);
      });
  }, []); // Leeres Array als Abhängigkeit, um nur einmal zu laden

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${userId}/watchlist`)
      .then((res) => res.json())
      .then((data) => {
        setWatchlist(data); // Setze die erhaltenen Daten in den State
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Watchlist:", err);
        setLoading(false);
      });
  }, [userId]); // Abhängigkeit: user.id, um die Watchlist bei Änderungen zu aktualisieren

  if (loading) {
    return <p className="text-center mt-4">Watchlist wird geladen...</p>;
  }

  if (watchlist.length === 0) {
    return <p className="text-center mt-4">Noch keine Filme in der Watchlist.</p>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center text-indigo-700">⭐ Deine Watchlist</h2>
      <div className="row">
        {watchlist.map((movie) => (
          <div className="col-md-4 mb-3" key={movie.id}>
            <div className="card h-100">
              <img
                src={movie.posterUrl}
                className="card-img-top"
                alt={movie.title}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
