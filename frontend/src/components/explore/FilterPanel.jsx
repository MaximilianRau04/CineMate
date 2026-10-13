import { FaSearch, FaTimes } from "react-icons/fa";
import { useTranslation } from "../../i18n/I18nContext";
import "./Explore.css";

export const LoadingSpinner = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="cm-spinner" role="status">
      <div className="cm-reel" />
      <span>{message || t("common.loading")}</span>
    </div>
  );
};

export const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const { t } = useTranslation();
  return (
    <label className="cm-search">
      <FaSearch className="cm-search-icon" aria-hidden="true" />
      <input
        type="search"
        placeholder={t("explore.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label={t("common.search")}
      />
    </label>
  );
};

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
}) => {
  const { t } = useTranslation();
  const types = [
    { value: "all", label: t("common.all") },
    { value: "movies", label: t("common.movies") },
    { value: "series", label: t("common.seriesPlural") },
  ];

  return (
    <div className="cm-filter-panel">
      <div className="cm-filter-grid">
        <div>
          <div className="cm-filter-label">{t("explore.contentType")}</div>
          <div className="cm-segment" role="group">
            {types.map((type) => (
              <button
                key={type.value}
                type="button"
                className={contentType === type.value ? "is-active" : ""}
                aria-pressed={contentType === type.value}
                onClick={() => setContentType(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {sortOrder !== undefined && setSortOrder && (
          <div>
            <label className="cm-filter-label" htmlFor="cm-sort">
              {t("explore.sort")}
            </label>
            <select
              id="cm-sort"
              className="form-select form-select-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">{t("explore.sortNewest")}</option>
              <option value="asc">{t("explore.sortOldest")}</option>
            </select>
          </div>
        )}

        <div>
          <div className="cm-filter-label">{t("explore.dateRange")}</div>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="date"
              className="form-control form-control-sm"
              aria-label={t("explore.from")}
              min={minDate || ""}
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
            <span className="text-muted">–</span>
            <input
              type="date"
              className="form-control form-control-sm"
              aria-label={t("explore.to")}
              min={dateRange.start || minDate || ""}
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {availableGenres.length > 0 && (
        <div className="mt-3">
          <div className="cm-filter-label">{t("explore.genres")}</div>
          <div className="cm-chips">
            {[...availableGenres].sort().map((genre) => (
              <button
                key={genre}
                type="button"
                className={`cm-chip${selectedGenres.includes(genre) ? " is-active" : ""}`}
                aria-pressed={selectedGenres.includes(genre)}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end mt-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={resetFilters}
        >
          <FaTimes className="me-1" />
          {t("explore.resetFilters")}
        </button>
      </div>
    </div>
  );
};
