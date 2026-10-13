import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

import { LoadingSpinner, SearchBar, FilterPanel } from "../FilterPanel";
import CalendarList from "./CalendarList";
import {
  useCalendarData,
  getCombinedContent,
  groupContentByMonth,
} from "./utils/useCalendarData";
import { applyMediaFilters } from "../utils/useFilters";
import { useTranslation } from "../../../i18n/I18nContext";

const Calendar = () => {
  // Data fetching using custom hook
  const { movies, series, isLoading, error, availableGenres, fetchData } =
    useCalendarData();
  const { t, locale } = useTranslation();

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

  // Apply filters whenever filter criteria change
  useEffect(() => {
    const { filteredMovies: newMovies, filteredSeries: newSeries } =
      applyMediaFilters(movies, series, {
        contentType,
        selectedGenres,
        dateRange,
        searchQuery,
      });

    setFilteredMovies(newMovies);
    setFilteredSeries(newSeries);
  }, [movies, series, contentType, selectedGenres, dateRange, searchQuery]);

  // Helper functions
  const resetFilters = () => {
    setContentType("all");
    setSelectedGenres([]);
    setDateRange({ start: "", end: "" });
    setSearchQuery("");
  };

  // Toggle a genre in the selected genres list
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Get content based on filter selections
  const combinedContent =
    contentType === "all"
      ? getCombinedContent(filteredMovies, filteredSeries)
      : contentType === "movies"
        ? filteredMovies
        : filteredSeries;

  const groupedContent = groupContentByMonth(combinedContent, locale);
  const today = new Date().toISOString().split("T")[0];

  if (isLoading) {
    return <LoadingSpinner message={t("calendar.loading")} />;
  }

  const activeFilterCount =
    selectedGenres.length +
    (contentType !== "all" ? 1 : 0) +
    (dateRange.start || dateRange.end ? 1 : 0);

  if (error) {
    return (
      <div className="container cm-page">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">{t("calendar.loadError")}</h4>
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
    <div className="container cm-page">
      <header className="cm-page-head">
        <div>
          <div className="cm-eyebrow">{t("calendar.eyebrow")}</div>
          <h1>{t("calendar.title")}</h1>
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
          dateRange={dateRange}
          setDateRange={setDateRange}
          availableGenres={availableGenres}
          selectedGenres={selectedGenres}
          toggleGenre={toggleGenre}
          resetFilters={resetFilters}
          minDate={today}
        />
      )}

      <CalendarList
        groupedContent={groupedContent}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default Calendar;
