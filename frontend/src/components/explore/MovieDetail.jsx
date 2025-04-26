import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPlus, FaCheck, FaArrowLeft } from "react-icons/fa";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  /**
   * fetches the currently logged in user from the API
   */
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) setUserId(data.id);
      })
      .catch((err) => console.error("Fehler beim Laden des Users:", err));
  }, []);

  /**
   * fetches the movie details from the API
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
   * checks if the movie is already in the user's watchlist
   */
  useEffect(() => {
    if (!userId || !id) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/movies`, {   
    })
      .then((res) => res.json())
      .then((data) => {
        const alreadyInWatchlist = data.some((m) => m.id.toString() === id);
        setAdded(alreadyInWatchlist);
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));
  }, [userId, id]);

  /**
   * adds the movie to the user's watchlist
   */
  const handleAddToWatchlist = () => {
    if (!userId || added) return;

    setAdding(true);
    fetch(`http://localhost:8080/api/users/${userId}/watchlist/movies/${id}`, {
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
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Film wird geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <Link to="/explore" className="btn btn-outline-secondary mt-3">
            <FaArrowLeft className="me-2" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-4 text-center bg-dark text-white p-4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded shadow-sm mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
            <div className="small text-muted">Filmposter</div>
          </div>

          <div className="col-md-8 p-4">
            <h2 className="mb-3">{movie.title}</h2>

            <div className="mb-3">
              {movie.genre && (
                <span className="badge bg-primary me-2">{movie.genre}</span>
              )}
              {movie.duration && (
                <span className="badge bg-secondary me-2">{movie.duration}</span>
              )}
              {movie.releaseYear && (
                <span className="badge bg-info text-dark">
                  {movie.releaseYear}
                </span>
              )}
            </div>

            <p className="text-muted mb-2">
              <strong>Bewertung:</strong> ⭐ {movie.rating}/10
            </p>

            {movie.description && (
              <div className="mb-4">
                <h5>📝 Beschreibung</h5>
                <p className="text-secondary">{movie.description}</p>
              </div>
            )}

            {/* Watchlist Actions */}
            {userId && !added && (
              <button
                className="btn btn-success me-2"
                onClick={handleAddToWatchlist}
                disabled={adding}
              >
                {adding ? (
                  "Wird hinzugefügt..."
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Zur Watchlist hinzufügen
                  </>
                )}
              </button>
            )}

            {added && (
              <div className="alert alert-success d-inline-flex align-items-center px-3 py-2 mt-2" role="alert">
                <FaCheck className="me-2" />
                In deiner Watchlist!
              </div>
            )}

            <div className="mt-4">
              <Link to="/explore" className="btn btn-outline-primary">
                <FaArrowLeft className="me-2" />
                Zurück zur Übersicht
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
