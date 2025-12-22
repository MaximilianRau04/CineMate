import { useState, useCallback, useEffect } from "react";

const useMediaData = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [availableGenres, setAvailableGenres] = useState([]);

  /**
   * Fetch average rating for a specific item
   * @param {number} itemId - ID of the item (movie or series)
   * @param {string} type - Type of the item ('movie' or 'series')
   * @returns {Promise<number|null>}
   * @throws {Error} - If fetching reviews fails
   */
  const fetchAverageRating = async (itemId, type) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `http://localhost:8080/api/reviews/${type}/${itemId}`,
        { headers },
      );
      if (!response.ok) {
        if (response.status === 404) return 0;
        return null;
      }

      const reviews = await response.json();
      if (!reviews || reviews.length === 0) return 0;

      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.length;
    } catch (error) {
      console.error(
        `Fehler beim Laden des Ratings für ${type} ${itemId}:`,
        error,
      );
      return null;
    }
  };

  /**
   * Fetch movies and series data from API
   * @param {boolean} showLoadingSpinner - Whether to show loading spinner
   * @returns {Promise<{movies: Array, series: Array}>} - Fetched movies and series
   * @throws {Error} - If fetching data fails
   */
  const fetchData = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [moviesResponse, seriesResponse] = await Promise.all([
        fetch("http://localhost:8080/api/movies", { headers }),
        fetch("http://localhost:8080/api/series", { headers }),
      ]);

      if (!moviesResponse.ok) {
        throw new Error("Filme konnten nicht geladen werden");
      }
      if (!seriesResponse.ok) {
        throw new Error("Serien konnten nicht geladen werden");
      }

      const [moviesData, seriesData] = await Promise.all([
        moviesResponse.json(),
        seriesResponse.json(),
      ]);

      // Process movies with genres and current ratings
      const processedMovies = await Promise.all(
        moviesData.map(async (movie) => {
          const genreArray = movie.genre ? movie.genre.split(/,\s*/) : [];
          const currentRating = await fetchAverageRating(movie.id, "movie");
          return {
            ...movie,
            genreArray,
            currentRating:
              currentRating !== null ? currentRating : movie.rating,
          };
        }),
      );

      // Process series with genres and current ratings
      const processedSeries = await Promise.all(
        seriesData.map(async (series) => {
          const genreArray = series.genre ? series.genre.split(/,\s*/) : [];
          const currentRating = await fetchAverageRating(series.id, "series");
          return {
            ...series,
            genreArray,
            currentRating:
              currentRating !== null ? currentRating : series.rating,
          };
        }),
      );

      setMovies(processedMovies);
      setSeries(processedSeries);

      const allGenres = [
        ...processedMovies.flatMap((movie) => movie.genreArray),
        ...processedSeries.flatMap((series) => series.genreArray),
      ].filter(Boolean);

      setAvailableGenres([...new Set(allGenres)]);
      setError(null);

      return { movies: processedMovies, series: processedSeries };
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      setError(err.message);
      return { movies: [], series: [] };
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add focus event listener
  useEffect(() => {
    const handleFocus = () => {
      fetchData(false);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData]);

  return {
    movies,
    series,
    isLoading,
    isRefreshing,
    error,
    availableGenres,
    fetchData,
  };
};

export default useMediaData;
