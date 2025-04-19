import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * MovieDetail component to display detailed information about a movie
 * contains a button to add the movie to the user's watchlist
 * @returns {JSX.Element}
 */
const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  /**
   * Fetches the current user's ID from the API
   */
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setUserId(data.id);
        }
      })
      .catch((err) => console.error("Fehler beim Laden des Users:", err));
  }, []);

  /**
   * Fetches movie details from the API based on the movie ID from the URL
   */
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/movies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Film konnte nicht geladen werden");
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden des Films:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  /**
   * Checks if the movie is already in the user's watchlist
   * and updates the state accordingly
   */
  useEffect(() => {
    if (!userId || !id) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const alreadyInWatchlist = data.some((m) => m.id.toString() === id);
        setAdded(alreadyInWatchlist);
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));
  }, [userId, id]);

  /**
   * adds the movie to the user's watchlist if not already added
   * @returns {void}
   */
  const handleAddToWatchlist = () => {
    if (!userId || added) return; 

    setAdding(true);
    fetch(`http://localhost:8080/api/users/${userId}/watchlist/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Hinzufügen zur Watchlist");
        return res.json();
      })
      .then(() => {
        setAdded(true);
        setAdding(false);

      })
      .catch((err) => {
        console.error(err);
        setAdding(false);
      });
  };

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Lade...</span>
        </div>
        <p className="mt-2">Film wird geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline-secondary mt-3">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="row g-0">
          <div className="col-md-4 text-center p-3">
            {/* movie poster */}
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "350px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
          </div>

          <div className="col-md-8 p-4">
            <h2 className="mb-3">{movie.title}</h2>

            {/* movie data */}
            <div className="mb-2">
              <span className="badge bg-primary me-2">{movie.genre}</span>
              {movie.duration && (
                <span className="badge bg-secondary me-2">
                  {movie.duration}
                </span>
              )}
              {movie.releaseYear && (
                <span className="badge bg-info">{movie.releaseYear}</span>
              )}
            </div>

            <p className="text-muted mt-3">
              <strong>Bewertung:</strong> ⭐ {movie.rating}/10
            </p>

            {movie.description && (
              <div className="mt-3">
                <h5>Beschreibung</h5>
                <p>{movie.description}</p>
              </div>
            )}

            {/* add to watchlist button */}
            {userId && !added && (
              <button
                className="btn btn-success me-2 mt-3"
                onClick={handleAddToWatchlist}
                disabled={adding}
              >
                {adding ? "Wird hinzugefügt..." : "Zur Watchlist hinzufügen"}
              </button>
            )}

            {added && (
              <div className="alert alert-success mt-3 py-2 px-3" role="alert">
                ✅{" "}
                {adding
                  ? "Wird hinzugefügt..."
                  : "Film ist in deiner Watchlist!"}
              </div>
            )}

            <Link to="/movies" className="btn btn-outline-primary mt-4">
              ← Zurück zur Übersicht
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
