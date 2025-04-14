import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/movies/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Film konnte nicht geladen werden');
        }
        return res.json();
      })
      .then(data => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fehler beim Laden des Films:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

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
          {/* Poster */}
          <div className="col-md-4 text-center p-3">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          </div>

          {/* Details */}
          <div className="col-md-8 p-4">
            <h2 className="mb-3">{movie.title}</h2>

            <div className="mb-2">
              <span className="badge bg-primary me-2">{movie.genre}</span>
              {movie.duration && <span className="badge bg-secondary me-2">{movie.duration}</span>}
              {movie.releaseYear && <span className="badge bg-info">{movie.releaseYear}</span>}
            </div>

            <p className="text-muted mt-3"><strong>Bewertung:</strong> ⭐ {movie.rating}/10</p>

            {movie.description && (
              <div className="mt-3">
                <h5>Beschreibung</h5>
                <p>{movie.description}</p>
              </div>
            )}

            {movie.director && (
              <div className="mt-3">
                <h6>Regie</h6>
                <p>{movie.director}</p>
              </div>
            )}

            {movie.cast && (
              <div className="mt-3">
                <h6>Besetzung</h6>
                <p>{movie.cast}</p>
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
