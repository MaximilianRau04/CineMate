import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

import { LoadingSpinner, SearchBar, FilterPanel } from "../FilterPanel";
import CalendarList from "./CalendarList";
import {
  useCalendarData,
  getCombinedContent,
  groupContentByMonth,
} from "./utils/useCalendarData";
import { applyMediaFilters } from "../utils/useFilters";

const Calendar = () => {
  // Data fetching using custom hook
  const { movies, series, isLoading, error, availableGenres, fetchData } =
    useCalendarData();

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

  const groupedContent = groupContentByMonth(combinedContent);
  const today = new Date().toISOString().split("T")[0];

  if (isLoading) {
    return <LoadingSpinner message="Kommende Releases werden geladen..." />;
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
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaCalendarAlt className="me-2" />
            <h3 className="mb-0">Kommende Releases</h3>
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
              {showFilters ? "Filter ausblenden" : "Filter anzeigen"}
            </button>
          </div>
        </div>

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

        <div className="card-body">
          <CalendarList
            groupedContent={groupedContent}
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
