import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight, FaSpinner, FaFilter, FaTimes, FaSearch } from "react-icons/fa";

const Calendar = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingMovies = data.filter((movie) => {
          if (!movie.releaseDate) return false;
          const releaseDate = new Date(movie.releaseDate);
          return releaseDate >= today;
        });

        upcomingMovies.sort((a, b) => {
          return new Date(a.releaseDate) - new Date(b.releaseDate);
        });

        const processedMovies = upcomingMovies.map(movie => {
          const genreArray = movie.genre ? movie.genre.split(/,\s*/) : [];
 
          return { ...movie, genreArray, contentType: 'movie' };
        });

        setMovies(processedMovies);
        setFilteredMovies(processedMovies);
        
        const allGenres = processedMovies
          .flatMap(movie => movie.genreArray)
          .filter(Boolean);
        
        setAvailableGenres(prev => [...new Set([...prev, ...allGenres])]);
        
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
   * Fetches series list from the API
   */
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/api/series");

        if (!response.ok) {
          throw new Error("Serien konnten nicht geladen werden");
        }

        const seriesList = await response.json();
        
        const seriesWithSeasons = await Promise.all(
          seriesList.map(async (seriesItem) => {
            try {
              const seasonsResponse = await fetch(`http://localhost:8080/api/series/${seriesItem.id}/seasons`);
              
              if (!seasonsResponse.ok) {
                console.error(`Fehler beim Laden der Staffeln für Serie ${seriesItem.id}`);
                return { ...seriesItem, seasons: [] };
              }
              
              const seasons = await seasonsResponse.json();
     
              const genreArray = seriesItem.genre ? seriesItem.genre.split(/,\s*/) : [];
              
              return { ...seriesItem, seasons, genreArray };
            } catch (error) {
              console.error(`Fehler beim Laden der Staffeln für Serie ${seriesItem.id}:`, error);
              return { ...seriesItem, seasons: [] };
            }
          })
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingSeries = seriesWithSeasons
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

        const processedSeries = upcomingSeries.map(series => ({
          ...series,
          contentType: 'series'
        }));

        setSeries(processedSeries);
        setFilteredSeries(processedSeries);
        
        const allGenres = processedSeries
          .flatMap(series => series.genreArray)
          .filter(Boolean);
        
        setAvailableGenres(prev => [...new Set([...prev, ...allGenres])]);
        
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
  }, [contentType, selectedGenres, dateRange, searchQuery, movies, series]);

  /**
   * Apply all active filters to the movies and series
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
        series.nextEpisodeDate && new Date(series.nextEpisodeDate) >= startDate
      );
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      
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
   * Combines movies and series into a single array sorted by date
   * @returns {Array}
   */
  const getCombinedContent = () => {
    const combinedContent = [
      ...filteredMovies.map(movie => ({
        ...movie,
        releaseItem: movie.releaseDate
      })),
      ...filteredSeries.map(series => ({
        ...series,
        releaseItem: series.nextEpisodeDate
      }))
    ];

    combinedContent.sort((a, b) => {
      return new Date(a.releaseItem) - new Date(b.releaseItem);
    });

    return combinedContent;
  };

  /**
   * Groups content (movies and series) by month based on their release date
   * @param {Array} content - Array of movies and series
   * @returns {Object}
   */
  const groupContentByMonth = (content) => {
    const grouped = {};

    content.forEach((item) => {
      const dateField = item.contentType === 'movie' ? item.releaseDate : item.nextEpisodeDate;
      
      if (!dateField) return;

      const date = new Date(dateField);
      const month = date.toLocaleDateString("de-DE", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[month]) {
        grouped[month] = [];
      }

      grouped[month].push(item);
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

  const combinedContent = contentType === "all" 
    ? getCombinedContent()
    : contentType === "movies" 
      ? filteredMovies
      : filteredSeries;

  const groupedContent = groupContentByMonth(combinedContent);

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

  const renderContentItem = (item) => {
    const isMovie = item.contentType === 'movie';
    const linkPath = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
    const releaseDate = isMovie ? item.releaseDate : item.nextEpisodeDate;
    
    return (
      <Link
        key={`${item.contentType}-${item.id}`}
        to={linkPath}
        className="list-group-item list-group-item-action d-flex align-items-center p-3"
      >
        <div className="d-flex align-items-center" style={{ width: "100%" }}>
          <div className="me-3" style={{ minWidth: "90px" }}>
            <span className="badge bg-info text-dark">
              {formatDate(releaseDate)}
            </span>
            <span className="ms-2 badge bg-primary">
              {isMovie ? 'Film' : 'Serie'}
            </span>
          </div>

          <div className="d-flex align-items-center" style={{ flex: 1 }}>
            {item.posterUrl && (
              <img
                src={item.posterUrl}
                alt={item.title}
                className="me-3 rounded shadow-sm"
                style={{
                  width: "50px",
                  height: "75px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/50x75?text=No+Image";
                }}
              />
            )}

            <div>
              <h5 className="mb-1">{item.title}</h5>
              <div>
                {item.genreArray && item.genreArray.map((genre, index) => (
                  <span key={index} className="badge bg-secondary me-2">
                    {genre}
                  </span>
                ))}
                
                {isMovie && item.duration && (
                  <span className="badge bg-light text-dark border me-2">
                    {item.duration}
                  </span>
                )}
                
                {!isMovie && item.seasons && (
                  <span className="badge bg-light text-dark border me-2">
                    {item.seasons.length} Staffel{item.seasons.length !== 1 ? 'n' : ''}
                  </span>
                )}
                
                {item.releaseYear && (
                  <span className="badge bg-light text-dark border">
                    {item.releaseYear}
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
    );
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaCalendarAlt className="me-2" />
            <h3 className="mb-0">Kommende Releases</h3>
          </div>
          <div className="d-flex align-items-center ">
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

        <div className="card-body">
          {Object.keys(groupedContent).length === 0 ? (
            <div className="text-center py-5">
              <p className="lead text-muted">Keine passenden Inhalte gefunden.</p>
              {(contentType !== "all" || selectedGenres.length > 0 || dateRange.start || dateRange.end) && (
                <button className="btn btn-outline-primary mt-2" onClick={resetFilters}>
                  Filter zurücksetzen
                </button>
              )}
            </div>
          ) : (
            Object.entries(groupedContent).map(([month, items]) => (
              <div key={month} className="mb-4">
                <h4 className="border-bottom pb-2 mb-3">
                  {month}
                </h4>
                <div className="list-group">
                  {items.map(item => renderContentItem(item))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;