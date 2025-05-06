import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight, FaSpinner, FaFilter, FaTimes } from "react-icons/fa";

const MovieCalendar = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [contentType, setContentType] = useState("all"); // "all", "movies", "series"
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [availableGenres, setAvailableGenres] = useState([]);

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

        const upcomingMovies = data.filter((movie) => {
          if (!movie.releaseDate) return false;
          const releaseDate = new Date(movie.releaseDate);
          return releaseDate >= today;
        });

        // Sort by release date (nearest first)
        upcomingMovies.sort((a, b) => {
          return new Date(a.releaseDate) - new Date(b.releaseDate);
        });

        setMovies(upcomingMovies);
        setFilteredMovies(upcomingMovies);
        
        // Extract unique genres from movies
        const genres = [...new Set(upcomingMovies.map(movie => movie.genre).filter(Boolean))];
        setAvailableGenres(prev => [...new Set([...prev, ...genres])]);
        
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
   * Fetches series from the API and filter them to show only those with release dates today or in the future.
   */
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/api/series");

        if (!response.ok) {
          throw new Error("Serien konnten nicht geladen werden");
        }

        const data = await response.json();

        // Filter series with release dates today or in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingSeries = data
          .filter((series) => {
            if (!series.seasons || series.seasons.length === 0) return false;

            const hasFutureEpisode = series.seasons.some((season) =>
              season.episodes?.some((episode) => {
                const episodeDate = new Date(episode.releaseDate);
                return episodeDate >= today;
              })
            );

            if (hasFutureEpisode) {
              series.nextEpisodeDate = findNextEpisodeDate(series.seasons); 
            }

            return hasFutureEpisode;
          })
          .sort((a, b) => {
            return new Date(a.nextEpisodeDate) - new Date(b.nextEpisodeDate); 
          });

        setSeries(upcomingSeries);
        setFilteredSeries(upcomingSeries);
        
        // Extract unique genres from series
        const genres = [...new Set(upcomingSeries.map(series => series.genre).filter(Boolean))];
        setAvailableGenres(prev => [...new Set([...prev, ...genres])]);
        
        setIsLoading(false);
      } catch (err) {
        console.error("Fehler beim Laden der Serien:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, []);

  /**
   * Apply filters whenever filter criteria change
   */
  useEffect(() => {
    applyFilters();
  }, );

  /**
   * Apply all active filters to the movies and series
   */
  const applyFilters = () => {
    // Filter movies
    let tempMovies = [...movies];
    let tempSeries = [...series];
    
    // Filter by genre if any genres are selected
    if (selectedGenres.length > 0) {
      tempMovies = tempMovies.filter(movie => 
        movie.genre && selectedGenres.includes(movie.genre)
      );
      
      tempSeries = tempSeries.filter(series => 
        series.genre && selectedGenres.includes(series.genre)
      );
    }
    
    // Filter by date range
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      tempMovies = tempMovies.filter(movie => 
        movie.releaseDate && new Date(movie.releaseDate) >= startDate
      );
      
      tempSeries = tempSeries.filter(series => 
        series.nextEpisodeDate && new Date(series.nextEpisodeDate) >= startDate
      );
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of the selected day
      
      tempMovies = tempMovies.filter(movie => 
        movie.releaseDate && new Date(movie.releaseDate) <= endDate
      );
      
      tempSeries = tempSeries.filter(series => 
        series.nextEpisodeDate && new Date(series.nextEpisodeDate) <= endDate
      );
    }
    
    // Apply content type filter
    if (contentType === "movies") {
      setFilteredSeries([]);
      setFilteredMovies(tempMovies);
    } else if (contentType === "series") {
      setFilteredMovies([]);
      setFilteredSeries(tempSeries);
    } else {
      // Show both
      setFilteredMovies(tempMovies);
      setFilteredSeries(tempSeries);
    }
  };

  /**
   * Reset all filters to default values
   */
  const resetFilters = () => {
    setContentType("all");
    setSelectedGenres([]);
    setDateRange({ start: "", end: "" });
    setFilteredMovies(movies);
    setFilteredSeries(series);
  };

  /**
   * Toggle a genre selection
   */
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

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
      year: "numeric",
    });
  };

  /**
   * groups movies by month and year based on their release date.
   * @param {*} movies
   * @returns {Object}
   */
  const groupMoviesByMonth = (movies) => {
    const grouped = {};

    movies.forEach((movie) => {
      if (!movie.releaseDate) return;

      const date = new Date(movie.releaseDate);
      const month = date.toLocaleDateString("de-DE", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[month]) {
        grouped[month] = [];
      }

      grouped[month].push(movie);
    });

    return grouped;
  };

  /**
   * groups series by month and year based on their release date.
   * @param {*} series
   * @returns {Object}
   */
  const groupSeriesByMonth = (series) => {
    const grouped = {};

    series.forEach((series) => {
      if (!series.nextEpisodeDate) return;

      const date = new Date(series.nextEpisodeDate);
      const month = date.toLocaleDateString("de-DE", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[month]) {
        grouped[month] = [];
      }

      grouped[month].push(series);
    });

    return grouped;
  };

  /**
   * finds the next episode date for a series based on its seasons and episodes.
   * @param {*} seasons
   * @returns {string|null}
   */
  const findNextEpisodeDate = (seasons) => {
    const now = new Date();

    const allEpisodes = seasons.flatMap((season) => season.episodes || []);

    const upcoming = allEpisodes.filter((ep) => new Date(ep.releaseDate) > now);

    upcoming.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

    return upcoming.length > 0 ? upcoming[0].releaseDate : null;
  };

  const groupedMovies = groupMoviesByMonth(filteredMovies);
  const groupedSeries = groupSeriesByMonth(filteredSeries);

  const today = new Date().toISOString().split('T')[0];

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <FaSpinner className="fa-spin mb-3" size={30} />
        <p>Inhalte werden geladen...</p>
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
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaCalendarAlt className="me-2" />
            <h3 className="mb-0">Kommende Releases</h3>
          </div>
          <button 
            className="btn btn-light btn-sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="me-1" />
            {showFilters ? "Filter ausblenden" : "Filter anzeigen"}
          </button>
        </div>

        {showFilters && (
          <div className="card-body bg-light border-bottom">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Inhaltstyp</label>
                <div className="btn-group w-100">
                  <button 
                    className={`btn ${contentType === "all" ? "btn-primary" : "btn-outline-primary"}`} 
                    onClick={() => setContentType("all")}
                  >
                    Alle
                  </button>
                  <button 
                    className={`btn ${contentType === "movies" ? "btn-primary" : "btn-outline-primary"}`} 
                    onClick={() => setContentType("movies")}
                  >
                    Filme
                  </button>
                  <button 
                    className={`btn ${contentType === "series" ? "btn-primary" : "btn-outline-primary"}`} 
                    onClick={() => setContentType("series")}
                  >
                    Serien
                  </button>
                </div>
              </div>
              
              <div className="col-md-4">
                <label className="form-label fw-bold">Zeitraum</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input 
                      type="date" 
                      className="form-control" 
                      placeholder="Von" 
                      min={today}
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                  </div>
                  <div className="col-6">
                    <input 
                      type="date" 
                      className="form-control" 
                      placeholder="Bis" 
                      min={dateRange.start || today}
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 d-flex flex-column">
                <label className="form-label fw-bold">Genres</label>
                <div className="d-flex flex-wrap gap-2" style={{ maxHeight: "100px", overflowY: "auto" }}>
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      className={`btn btn-sm ${selectedGenres.includes(genre) ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-secondary" onClick={resetFilters}>
                <FaTimes className="me-1" />
                Filter zurücksetzen
              </button>
            </div>
          </div>
        )}

        <div className="card-body">
          {Object.keys(groupedMovies).length === 0 && Object.keys(groupedSeries).length === 0 ? (
            <div className="text-center py-5">
              <p className="lead text-muted">Keine passenden Inhalte gefunden.</p>
              {(contentType !== "all" || selectedGenres.length > 0 || dateRange.start || dateRange.end) && (
                <button className="btn btn-outline-primary mt-2" onClick={resetFilters}>
                  Filter zurücksetzen
                </button>
              )}
            </div>
          ) : (
            <>
              {contentType !== "series" && Object.entries(groupedMovies).map(([month, monthMovies]) => (
                <div key={month} className="mb-4">
                  <h4 className="border-bottom pb-2 mb-3">
                    {month}
                  </h4>
                  <div className="list-group">
                    {monthMovies.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movies/${movie.id}`}
                        className="list-group-item list-group-item-action d-flex align-items-center p-3"
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{ width: "100%" }}
                        >
                          <div className="me-3" style={{ minWidth: "90px" }}>
                            <span className="badge bg-info text-dark">
                              {formatDate(movie.releaseDate)}
                            </span>
                          </div>

                          <div
                            className="d-flex align-items-center"
                            style={{ flex: 1 }}
                          >
                            {movie.posterUrl && (
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="me-3 rounded shadow-sm"
                                style={{
                                  width: "50px",
                                  height: "75px",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/50x75?text=No+Image";
                                }}
                              />
                            )}

                            <div>
                              <h5 className="mb-1">{movie.title}</h5>
                              <div>
                                {movie.genre && (
                                  <span className="badge bg-secondary me-2">
                                    {movie.genre}
                                  </span>
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
              ))}
              
              {contentType !== "movies" && Object.keys(groupedSeries).length > 0 && (
                <>
                  {contentType !== "series" && Object.keys(groupedMovies).length > 0 && (
                    <hr className="my-4" />
                  )}
                  
                  {Object.entries(groupedSeries).map(([month, monthSeries]) => (
                    <div key={month} className="mb-4">
                      <h4 className="border-bottom pb-2 mb-3">
                        {month}
                      </h4>
                      <div className="list-group">
                        {monthSeries.map((series) => (
                          <Link
                            key={series.id}
                            to={`/series/${series.id}`}
                            className="list-group-item list-group-item-action d-flex align-items-center p-3"
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{ width: "100%" }}
                            >
                              <div className="me-3" style={{ minWidth: "90px" }}>
                                <span className="badge bg-info text-dark">
                                  {formatDate(series.nextEpisodeDate)}
                                </span>
                              </div>

                              <div
                                className="d-flex align-items-center"
                                style={{ flex: 1 }}
                              >
                                {series.posterUrl && (
                                  <img
                                    src={series.posterUrl}
                                    alt={series.title}
                                    className="me-3 rounded shadow-sm"
                                    style={{
                                      width: "50px",
                                      height: "75px",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/50x75?text=No+Image";
                                    }}
                                  />
                                )}

                                <div>
                                  <h5 className="mb-1">{series.title}</h5>
                                  <div>
                                    {series.genre && (
                                      <span className="badge bg-secondary me-2">
                                        {series.genre}
                                      </span>
                                    )}
                                    {series.episodes && (
                                      <span className="badge bg-light text-dark border me-2">
                                        {series.episodes} Episoden
                                      </span>
                                    )}
                                    {series.releaseYear && (
                                      <span className="badge bg-light text-dark border">
                                        {series.releaseYear}
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
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCalendar;