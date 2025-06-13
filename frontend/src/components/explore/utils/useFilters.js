/**
 * Filter media items based on search query, genres, date range
 * @param {Array} movies - List of movies
 * @param {Array} series - List of series
 * @param {Object} filters - Filter criteria
 * @returns {Object} - Filtered movies and series
 */
export const applyMediaFilters = (movies, series, filters) => {
  const { searchQuery, selectedGenres, dateRange, contentType, sortOrder } = filters;
  
  let tempMovies = [...movies];
  let tempSeries = [...series];
  
  // Apply search filter
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
  
  // Apply genre filter
  if (selectedGenres.length > 0) {
    tempMovies = tempMovies.filter(movie => 
      movie.genreArray && movie.genreArray.some(genre => selectedGenres.includes(genre))
    );
    
    tempSeries = tempSeries.filter(series => 
      series.genreArray && series.genreArray.some(genre => selectedGenres.includes(genre))
    );
  }

  // Apply date range filters
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
  
  // Apply sorting
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
  
  // Filter by content type
  if (contentType === "movies") {
    return { filteredMovies: tempMovies, filteredSeries: [] };
  } else if (contentType === "series") {
    return { filteredMovies: [], filteredSeries: tempSeries };
  } else {
    return { filteredMovies: tempMovies, filteredSeries: tempSeries };
  }
};