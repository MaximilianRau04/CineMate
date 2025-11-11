import { useState, useEffect, useCallback } from "react";

export const useCalendarData = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableGenres, setAvailableGenres] = useState([]);

  /**
   * Finds the next episode date for a series based on its seasons and episodes
   * @param {Array} seasons - Array of seasons, each containing episodes
   * @returns {string|null}
   */
  const findNextEpisodeDate = (seasons) => {
    const now = new Date();
    const allEpisodes = seasons.flatMap((season) => season.episodes || []);
    const upcoming = allEpisodes.filter((ep) => new Date(ep.releaseDate) > now);
    upcoming.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    return upcoming.length > 0 ? upcoming[0].releaseDate : null;
  };

  /**
   * Fetch movies and series data from API
   * @returns {Promise<void>}
   * @throws {Error} - If fetching data fails
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      // Fetch movies
      const moviesResponse = await fetch("http://localhost:8080/api/movies", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!moviesResponse.ok) {
        throw new Error("Filme konnten nicht geladen werden");
      }

      const moviesData = await moviesResponse.json();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter and process movies
      const upcomingMovies = moviesData
        .filter((movie) => {
          if (!movie.releaseDate) return false;
          const releaseDate = new Date(movie.releaseDate);
          return releaseDate >= today;
        })
        .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
        .map((movie) => {
          const genreArray = movie.genre ? movie.genre.split(/,\s*/) : [];
          return { ...movie, genreArray, contentType: "movie" };
        });

      setMovies(upcomingMovies);

      // Fetch series
      const seriesResponse = await fetch("http://localhost:8080/api/series", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!seriesResponse.ok) {
        throw new Error("Serien konnten nicht geladen werden");
      }

      const seriesList = await seriesResponse.json();

      // Fetch seasons for each series
      const seriesWithSeasons = await Promise.all(
        seriesList.map(async (seriesItem) => {
          try {
            const seasonsResponse = await fetch(`http://localhost:8080/api/series/${seriesItem.id}/seasons`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!seasonsResponse.ok) {
              console.error(
                `Fehler beim Laden der Staffeln für Serie ${seriesItem.id}`
              );
              return { ...seriesItem, seasons: [] };
            }

            const seasons = await seasonsResponse.json();
            const genreArray = seriesItem.genre
              ? seriesItem.genre.split(/,\s*/)
              : [];

            return { ...seriesItem, seasons, genreArray };
          } catch (error) {
            console.error(
              `Fehler beim Laden der Staffeln für Serie ${seriesItem.id}:`,
              error
            );
            return { ...seriesItem, seasons: [] };
          }
        })
      );

      // Filter series to only include those with future episodes
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
        .sort(
          (a, b) => new Date(a.nextEpisodeDate) - new Date(b.nextEpisodeDate)
        )
        .map((series) => ({
          ...series,
          contentType: "series",
        }));

      setSeries(upcomingSeries);

      // Collect all genres
      const allGenres = [
        ...upcomingMovies.flatMap((movie) => movie.genreArray),
        ...upcomingSeries.flatMap((series) => series.genreArray),
      ].filter(Boolean);

      setAvailableGenres([...new Set(allGenres)]);
      setError(null);
    } catch (err) {
      console.error("Fehler beim Laden der Daten:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    movies,
    series,
    isLoading,
    error,
    availableGenres,
    fetchData,
  };
};

/**
 * Groups content (movies and series) by month based on their release date
 * @param {Array} content - Array of movies and series
 * @returns {Object}
 */
export const groupContentByMonth = (content) => {
  const grouped = {};

  content.forEach((item) => {
    const dateField =
      item.contentType === "movie" ? item.releaseDate : item.nextEpisodeDate;

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
 * Combines movies and series into a single array sorted by date
 * @returns {Array}
 */
export const getCombinedContent = (movies, series) => {
  const combinedContent = [
    ...movies.map((movie) => ({
      ...movie,
      releaseItem: movie.releaseDate,
    })),
    ...series.map((series) => ({
      ...series,
      releaseItem: series.nextEpisodeDate,
    })),
  ];

  combinedContent.sort((a, b) => {
    return new Date(a.releaseItem) - new Date(b.releaseItem);
  });

  return combinedContent;
};
