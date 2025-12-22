import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

import { LoadingSpinner, SearchBar, FilterPanel } from "./FilterPanel";
import MediaList from "./MediaCard";
import useMediaData from "./utils/useMediaData";
import { applyMediaFilters } from "./utils/useFilters";

const ExplorePage = () => {
  // Data fetching using custom hook
  const { movies, series, isLoading, error, availableGenres, fetchData } =
    useMediaData();

  // Filter state
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [contentType, setContentType] = useState("all");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [sortOrder, setSortOrder] = useState("asc");

  // Apply filters when filter criteria change
  useEffect(() => {
    const { filteredMovies: newMovies, filteredSeries: newSeries } =
      applyMediaFilters(movies, series, {
        contentType,
        selectedGenres,
        dateRange,
        searchQuery,
        sortOrder,
      });

    setFilteredMovies(newMovies);
    setFilteredSeries(newSeries);
  }, [
    movies,
    series,
    contentType,
    selectedGenres,
    dateRange,
    searchQuery,
    sortOrder,
  ]);

  /**
   * Reset all filters to their default values.
   */
  const resetFilters = () => {
    setContentType("all");
    setSelectedGenres([]);
    setDateRange({ start: "", end: "" });
    setSearchQuery("");
    setSortOrder("asc");
  };

  /**
   * toggles a genre in the selected genres list.
   * @param {*} genre - The genre to toggle in the selected genres list.
   */
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => fetchData()}
          >
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
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
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
          <FilterPanel
            contentType={contentType}
            setContentType={setContentType}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            dateRange={dateRange}
            setDateRange={setDateRange}
            availableGenres={availableGenres}
            selectedGenres={selectedGenres}
            toggleGenre={toggleGenre}
            resetFilters={resetFilters}
          />
        )}
      </div>

      {/* No results message */}
      {filteredMovies.length === 0 && filteredSeries.length === 0 && (
        <div className="text-center py-5">
          <p className="lead text-muted">Keine passenden Inhalte gefunden.</p>
          {(contentType !== "all" ||
            selectedGenres.length > 0 ||
            dateRange.start ||
            dateRange.end ||
            searchQuery) && (
            <button
              className="btn btn-outline-primary mt-2"
              onClick={resetFilters}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {/* Movies and Series lists */}
      <MediaList title="🎥 Filme" items={filteredMovies} type="movie" />
      <MediaList title="📺 Serien" items={filteredSeries} type="series" />
    </div>
  );
};

export default ExplorePage;
