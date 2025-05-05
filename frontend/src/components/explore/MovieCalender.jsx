import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight, FaSpinner } from "react-icons/fa";

const MovieCalendar = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch movies from the API and filter them to show only those with release dates today or in the future.
   * The movies are then sorted by release date (nearest first) and grouped by month.
   */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/api/movies");
        
        if (!response.ok) {
          throw new Error("Filme konnten nicht geladen werden");
        }
        
        const data = await response.json();
        
        // Filter movies with release dates today or in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        const upcomingMovies = data.filter(movie => {
          if (!movie.releaseDate) return false;
          const releaseDate = new Date(movie.releaseDate);
          return releaseDate >= today;
        });
        
        // Sort by release date (nearest first)
        upcomingMovies.sort((a, b) => {
          return new Date(a.releaseDate) - new Date(b.releaseDate);
        });
        
        setMovies(upcomingMovies);
        setIsLoading(false);
      } catch (err) {
        console.error("Fehler beim Laden der Filme:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  /**
   * formates a date string to a more readable format (DD.MM.YYYY).
   * If the date string is empty or invalid, it returns "Datum unbekannt".
   * @param {*} dateString 
   * @returns {string} 
   */
  const formatDate = (dateString) => {
    if (!dateString) return "Datum unbekannt";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  /**
   * groups movies by month and year based on their release date.
   * @param {*} movies 
   * @returns {Object} 
   */
  const groupMoviesByMonth = (movies) => {
    const grouped = {};
    
    movies.forEach(movie => {
      if (!movie.releaseDate) return;
      
      const date = new Date(movie.releaseDate);
      const month = date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
      
      if (!grouped[month]) {
        grouped[month] = [];
      }
      
      grouped[month].push(movie);
    });
    
    return grouped;
  };

  const groupedMovies = groupMoviesByMonth(movies);

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <FaSpinner className="fa-spin mb-3" size={30} />
        <p>Filme werden geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FaCalendarAlt className="me-2" />
          <h3 className="mb-0">Kommende Releases</h3>
        </div>
        
        <div className="card-body">
          {Object.keys(groupedMovies).length === 0 ? (
            <div className="text-center py-5">
              <p className="lead text-muted">Keine kommenden Filme gefunden.</p>
            </div>
          ) : (
            Object.entries(groupedMovies).map(([month, monthMovies]) => (
              <div key={month} className="mb-4">
                <h4 className="border-bottom pb-2 mb-3">{month}</h4>
                <div className="list-group">
                  {monthMovies.map(movie => (
                    <Link 
                      key={movie.id} 
                      to={`/movies/${movie.id}`} 
                      className="list-group-item list-group-item-action d-flex align-items-center p-3"
                    >
                      <div className="d-flex align-items-center" style={{width: "100%"}}>
                        <div className="me-3" style={{minWidth: "90px"}}>
                          <span className="badge bg-info text-dark">
                            {formatDate(movie.releaseDate)}
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center" style={{flex: 1}}>
                          {movie.posterUrl && (
                            <img 
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="me-3 rounded shadow-sm"
                              style={{width: "50px", height: "75px", objectFit: "cover"}}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/50x75?text=No+Image";
                              }}
                            />
                          )}
                          
                          <div>
                            <h5 className="mb-1">{movie.title}</h5>
                            <div>
                              {movie.genre && (
                                <span className="badge bg-secondary me-2">{movie.genre}</span>
                              )}
                              {movie.duration && (
                                <span className="badge bg-light text-dark border me-2">
                                  {movie.duration}
                                </span>
                              )}
                              {movie.releaseYear && (
                                <span className="badge bg-light text-dark border">
                                  {movie.releaseYear}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ms-auto">
                          <FaArrowRight className="text-muted" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCalendar;