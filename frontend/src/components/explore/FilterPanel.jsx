import { FaSearch, FaSpinner, FaTimes } from "react-icons/fa";

export const LoadingSpinner = ({ message = "Inhalte werden geladen..." }) => (
  <div className="container text-center py-5">
    <FaSpinner className="fa-spin mb-3" size={30} />
    <p>{message}</p>
  </div>
);

export const SearchBar = ({ searchQuery, setSearchQuery }) => (
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
);

export const FilterPanel = ({
  contentType,
  setContentType,
  sortOrder,
  setSortOrder,
  dateRange,
  setDateRange,
  availableGenres,
  selectedGenres,
  toggleGenre,
  resetFilters,
  minDate,
}) => (
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

      {sortOrder !== undefined && setSortOrder && (
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
      )}

      <div className="col-md-3">
        <label className="form-label fw-bold">Zeitraum</label>
        <div className="row g-2">
          <div className="col-6">
            <input
              type="date"
              className="form-control"
              placeholder="Von"
              min={minDate || ""}
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </div>
          <div className="col-6">
            <input
              type="date"
              className="form-control"
              placeholder="Bis"
              min={dateRange.start || minDate || ""}
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="col-md-3 d-flex flex-column">
        <label className="form-label fw-bold">Genres</label>
        <div
          className="d-flex flex-wrap gap-2"
          style={{ maxHeight: "100px", overflowY: "auto" }}
        >
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
);
