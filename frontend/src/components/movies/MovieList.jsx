import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * MovieList component to display a list of movies
 * and allows users to view details of each movie
 * @returns {JSX.Element}
 */
const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches the list of movies from the API
   * and updates the state with the fetched data
   */
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Filme:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Lade...</span>
        </div>
        <p className="mt-2">Filme werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 text-primary">🎬 Unsere Filmsammlung</h1>

      {movies.length === 0 ? (
        <div className="text-center text-muted">Keine Filme gefunden.</div>
      ) : (
        <div className="row">
          {movies.map((movie) => (
            <div className="col-md-6 mb-4" key={movie.id}>
              <div className="card h-100 shadow-sm">
                <div className="row g-0">
                  {/* movie poster */}
                  <div className="col-auto">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      width="100"
                      height="150"
                      className="img-fluid rounded-start"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100x150?text=No+Image";
                      }}
                    />
                  </div>

                  {/* movie data */}
                  <div className="col">
                    <div className="card-body d-flex flex-column justify-content-between h-100">
                      <div>
                        <h5 className="card-title mb-1">{movie.title}</h5>
                        <p className="card-text mb-1">
                          <small className="text-muted">{movie.genre}</small>
                        </p>
                        <p className="card-text mb-1">
                          ⭐ <strong>{movie.rating}</strong>
                        </p>
                      </div>

                      <Link
                        to={`/movies/${movie.id}`}
                        className="btn btn-primary btn-sm mt-2 align-self-start"
                      >
                        Details ansehen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
