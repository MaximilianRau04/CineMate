import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaSpinner, FaFilter, FaTimes, FaSearch, FaSync } from "react-icons/fa";

const ExplorePage = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [contentType, setContentType] = useState("all"); 
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [availableGenres, setAvailableGenres] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  /**
   * Fetch average rating for a specific item
   * @param {string} itemId 
   * @param {string} type 
   * @returns {Promise<number|null>} 
   */
  const fetchAverageRating = async (itemId, type) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${type}/${itemId}`);
      if (!response.ok) {
        if (response.status === 404) return 0; 
        return null; 
      }
      
      const reviews = await response.json();
      if (!reviews || reviews.length === 0) return 0;
      
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.length;
    } catch (error) {
      console.error(`Fehler beim Laden des Ratings für ${type} ${itemId}:`, error);
      return null;
    }
  };

  /**
   * Fetch movies and series data from API with current ratings
   * @param {boolean} showLoadingSpinner 
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    
    try {
      const [moviesResponse, seriesResponse] = await Promise.all([
        fetch("http://localhost:8080/api/movies"),
        fetch("http://localhost:8080/api/series")
      ]);

      if (!moviesResponse.ok) {
        throw new Error("Filme konnten nicht geladen werden");
      }
      if (!seriesResponse.ok) {
        throw new Error("Serien konnten nicht geladen werden");
      }

      const [moviesData, seriesData] = await Promise.all([
        moviesResponse.json(),
        seriesResponse.json()
      ]);

      // Process movies with genres and current ratings
      const processedMovies = await Promise.all(
        moviesData.map(async (movie) => {
          const genreArray = movie.genre ? movie.genre.split(/,\s*/) : [];
          const currentRating = await fetchAverageRating(movie.id, 'movie');
          return { 
            ...movie, 
            genreArray,
            currentRating: currentRating !== null ? currentRating : movie.rating
          };
        })
      );
      
      // Process series with genres and current ratings
      const processedSeries = await Promise.all(
        seriesData.map(async (series) => {
          const genreArray = series.genre ? series.genre.split(/,\s*/) : [];
          const currentRating = await fetchAverageRating(series.id, 'series');
          return { 
            ...series, 
            genreArray,
            currentRating: currentRating !== null ? currentRating : series.rating
          };
        })
      );
      
      setMovies(processedMovies);
      setSeries(processedSeries);
      setFilteredMovies(processedMovies);
      setFilteredSeries(processedSeries);

      const allGenres = [
        ...processedMovies.flatMap(movie => movie.genreArray),
        ...processedSeries.flatMap(series => series.genreArray)
      ].filter(Boolean);
      
      setAvailableGenres([...new Set(allGenres)]);
      setError(null);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Listen for focus events to refresh data when user returns to tab
   */
  useEffect(() => {
    const handleFocus = () => {
      fetchData(false);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  /**
   * Apply filters whenever filter criteria change
   */
  useEffect(() => {
    applyFilters();
  }, [contentType, selectedGenres, dateRange, searchQuery, movies, series, sortOrder]);

  /**
   * This function filters the movies and series based on the search query, selected genres, date range, and sort order.
   * @returns {void}
   */
  const applyFilters = () => {
    let tempMovies = [...movies];
    let tempSeries = [...series];
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      tempMovies = tempMovies.filter(movie => 
        movie.title?.toLowerCase().includes(query) || 
        movie.genre?.toLowerCase().includes(query) ||
        movie.genreArray?.some(genre => genre.toLowerCase().includes(query))
      );
      
      tempSeries = tempSeries.filter(series => 
        series.title?.toLowerCase().includes(query) || 
        series.genre?.toLowerCase().includes(query) ||
        series.genreArray?.some(genre => genre.toLowerCase().includes(query))
      );
    }
    
    if (selectedGenres.length > 0) {
      tempMovies = tempMovies.filter(movie => 
        movie.genreArray && movie.genreArray.some(genre => selectedGenres.includes(genre))
      );
      
      tempSeries = tempSeries.filter(series => 
        series.genreArray && series.genreArray.some(genre => selectedGenres.includes(genre))
      );
    }

    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      tempMovies = tempMovies.filter(movie => 
        movie.releaseDate && new Date(movie.releaseDate) >= startDate
      );
      
      tempSeries = tempSeries.filter(series => 
        series.releaseDate && new Date(series.releaseDate) >= startDate
      );
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      
      tempMovies = tempMovies.filter(movie => 
        movie.releaseDate && new Date(movie.releaseDate) <= endDate
      );
      
      tempSeries = tempSeries.filter(series => 
        series.releaseDate && new Date(series.releaseDate) <= endDate
      );
    }
    
    tempMovies.sort((a, b) => {
      const dateA = new Date(a.releaseDate || 0);
      const dateB = new Date(b.releaseDate || 0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    tempSeries.sort((a, b) => {
      const dateA = new Date(a.releaseDate || 0);
      const dateB = new Date(b.releaseDate || 0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    // Apply content type filter
    if (contentType === "movies") {
      setFilteredSeries([]);
      setFilteredMovies(tempMovies);
    } else if (contentType === "series") {
      setFilteredMovies([]);
      setFilteredSeries(tempSeries);
    } else {
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
    setSearchQuery("");
    setSortOrder("asc");
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
   * Format rating for display 
   * @param {Object} item 
   * @returns {string} 
   */
  const formatRating = (item) => {
    const rating = item.currentRating !== undefined ? item.currentRating : item.rating;
    
    if (rating === null || rating === undefined) return "N/A";
    
    const numRating = Number(rating);
    
    if (isNaN(numRating)) return "N/A";
    
    return numRating.toFixed(1);
  };

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
          <button className="btn btn-outline-danger" onClick={() => fetchData()}>
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center text-primary mb-0">
          🎬 Entdecke Filme und Serien
        </h1>
      </div>

      {/* Search and Filter UI */}
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h5 className="mb-0">🔍 Suche und Filter</h5>
          </div>
          <div className="d-flex align-items-center">
            <div className="input-group me-4">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Suche"
              />
              <span className="input-group-text bg-white">
                <FaSearch className="text-muted" />
              </span>
            </div>
            <button 
              className="btn btn-light btn-sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="me-1" />
              {showFilters ? "Filter ausblenden" : "Filter anzeigen"}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="card-body bg-light border-bottom">
            <div className="row g-3">
              <div className="col-md-3">
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
              
              <div className="col-md-3">
                <label className="form-label fw-bold">Sortierung</label>
                <select
                  className="form-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">📅 Nach Datum (aufsteigend)</option>
                  <option value="desc">📅 Nach Datum (absteigend)</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label className="form-label fw-bold">Zeitraum</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input 
                      type="date" 
                      className="form-control" 
                      placeholder="Von" 
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                  </div>
                  <div className="col-6">
                    <input 
                      type="date" 
                      className="form-control" 
                      placeholder="Bis" 
                      min={dateRange.start || ""}
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 d-flex flex-column">
                <label className="form-label fw-bold">Genres</label>
                <div className="d-flex flex-wrap gap-2" style={{ maxHeight: "100px", overflowY: "auto" }}>
                  {availableGenres.sort().map((genre) => (
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
      </div>

      {/* No results message */}
      {filteredMovies.length === 0 && filteredSeries.length === 0 && (
        <div className="text-center py-5">
          <p className="lead text-muted">Keine passenden Inhalte gefunden.</p>
          {(contentType !== "all" || selectedGenres.length > 0 || dateRange.start || dateRange.end || searchQuery) && (
            <button className="btn btn-outline-primary mt-2" onClick={resetFilters}>
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {/* Movies */}
      {contentType !== "series" && filteredMovies.length > 0 && (
        <>
          <h2 className="mt-5 mb-3">🎥 Filme</h2>
          <div className="row">
            {filteredMovies.map((movie) => (
              <div className="col-md-6 mb-4" key={movie.id}>
                <div className="card h-100 shadow-sm">
                  <div className="row g-0">
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
                    <div className="col">
                      <div className="card-body d-flex flex-column justify-content-between h-100">
                        <div>
                          <h5 className="card-title mb-1">{movie.title}</h5>
                          <div className="mb-1">
                            {movie.genreArray && movie.genreArray.map((genre, index) => (
                              <span key={index} className="badge bg-secondary me-1">
                                {genre}
                              </span>
                            ))}
                          </div>
                          <p className="card-text mb-1">
                            ⭐ <strong>{formatRating(movie)}</strong>
                          </p>
                          <p className="card-text mb-1">
                            📅{" "}
                            {movie.releaseDate
                              ? new Date(movie.releaseDate).toLocaleDateString("de-DE")
                              : "Unbekannt"}
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
        </>
      )}

      {/* Series */}
      {contentType !== "movies" && filteredSeries.length > 0 && (
        <>
          <h2 className="mt-5 mb-3">📺 Serien</h2>
          <div className="row">
            {filteredSeries.map((serie) => (
              <div className="col-md-6 mb-4" key={serie.id}>
                <div className="card h-100 shadow-sm">
                  <div className="row g-0">
                    <div className="col-auto">
                      <img
                        src={serie.posterUrl}
                        alt={serie.title}
                        width="100"
                        height="150"
                        className="img-fluid rounded-start"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100x150?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="col">
                      <div className="card-body d-flex flex-column justify-content-between h-100">
                        <div>
                          <h5 className="card-title mb-1">{serie.title}</h5>
                          <div className="mb-1">
                            {serie.genreArray && serie.genreArray.map((genre, index) => (
                              <span key={index} className="badge bg-secondary me-1">
                                {genre}
                              </span>
                            ))}
                          </div>
                          <p className="card-text mb-1">
                            ⭐ <strong>{formatRating(serie)}</strong>
                          </p>
                          <p className="card-text mb-1">
                            📅{" "}
                            {serie.releaseDate
                              ? new Date(serie.releaseDate).toLocaleDateString("de-DE")
                              : "Unbekannt"}
                          </p>
                        </div>
                        <Link
                          to={`/series/${serie.id}`}
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
        </>
      )}
    </div>
  );
};

export default ExplorePage;