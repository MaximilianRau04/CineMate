import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

import { LoadingSpinner, SearchBar, FilterPanel } from "./FilterPanel";
import MediaList from "./MediaCard";
import useMediaData from "./utils/useMediaData";
import { applyMediaFilters } from "./utils/useFilters";
import { useTranslation } from "../../i18n/I18nContext";

const ExplorePage = () => {
  // Data fetching using custom hook
  const { movies, series, isLoading, error, availableGenres, fetchData } =
    useMediaData();
  const { t } = useTranslation();

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
  const [sortOrder, setSortOrder] = useState("desc");

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
    setSortOrder("desc");
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

  const activeFilterCount =
    selectedGenres.length +
    (contentType !== "all" ? 1 : 0) +
    (dateRange.start || dateRange.end ? 1 : 0);
  const hasFilters = activeFilterCount > 0 || searchQuery;

  if (error) {
    return (
      <div className="container cm-page">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">{t("explore.loadError")}</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => fetchData()}
          >
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl cm-page">
      <header className="cm-page-head">
        <div>
          <div className="cm-eyebrow">
            {t("explore.eyebrow", {
              movies: movies.length,
              series: series.length,
            })}
          </div>
          <h1>{t("explore.title")}</h1>
        </div>
        <div className="cm-explore-tools">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <button
            type="button"
            className={`btn ${showFilters ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <FaFilter className="me-2" size={12} />
            {t("explore.filters")}
            {activeFilterCount > 0 && (
              <span className="cm-filter-count">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </header>

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

      {filteredMovies.length === 0 && filteredSeries.length === 0 && (
        <div className="cm-empty mt-4">
          <h3>{t("explore.noResults")}</h3>
          <p>{t("explore.noResultsHint")}</p>
          {hasFilters && (
            <button className="btn btn-outline-primary" onClick={resetFilters}>
              {t("explore.resetFilters")}
            </button>
          )}
        </div>
      )}

      <MediaList
        title={t("common.movies")}
        items={filteredMovies}
        type="movie"
      />
      <MediaList
        title={t("common.seriesPlural")}
        items={filteredSeries}
        type="series"
      />
    </div>
  );
};

export default ExplorePage;
