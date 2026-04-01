import { useState, useEffect, useRef, useCallback } from "react";
import "./css/SearchableMediaSelect.css";
import api from "../../utils/api";

const SearchableMediaSelect = ({
  type,
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [allMediaLoaded, setAllMediaLoaded] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * Fetches media details by ID
   * @param {string} mediaId - The ID of the media to fetch
   * @returns {Promise<void>} - Resolves when media details are fetched
   * @throws {Error} - If fetching media details fails
   */
  const fetchMediaDetails = useCallback(
    async (mediaId) => {
      try {
        const endpoint = type === "movie" ? "movies" : "series";
        const { data: media } = await api.get(`/${endpoint}/${mediaId}`);
        setSelectedMedia(media);
      } catch (error) {
        console.error(`Error fetching ${type} details:`, error);
      }
    },
    [type],
  );

  /**
   * Searches for media based on the search term
   * @param {string} query - The search term to use
   * @returns {Promise<void>} - Resolves when search results are fetched
   * @throws {Error} - If searching for media fails
   */
  const searchMedia = useCallback(
    async (query) => {
      setLoading(true);
      try {
        const endpoint = type === "movie" ? "movies" : "series";
        const { data } = await api.get(
          `/${endpoint}/search?query=${encodeURIComponent(query)}&page=0&size=20`,
        );
        setOptions(data.content || data);
      } catch (error) {
        console.error(`Error searching ${type}:`, error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [type],
  );

  /**
   * Loads all media of the specified type if not already loaded
   * @returns {Promise<void>} - Resolves when all media is loaded
   * @throws {Error} - If loading all media fails
   */
  const loadAllMedia = useCallback(async () => {
    if (allMediaLoaded) return;

    setLoading(true);
    try {
      const endpoint = type === "movie" ? "movies" : "series";
      const { data } = await api.get(`/${endpoint}?page=0&size=100`);
      setOptions(data.content || data);
      setAllMediaLoaded(true);
    } catch (error) {
      console.error(`Error loading all ${type}:`, error);
    } finally {
      setLoading(false);
    }
  }, [type, allMediaLoaded]);

  useEffect(() => {
    if (value) {
      fetchMediaDetails(value);
    }
  }, [value, fetchMediaDetails]);

  /**
   * Handles search term changes and debounces the search request
   * @returns {void}
   * @throws {Error} - If search term handling fails
   */
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const debounceTimer = setTimeout(() => {
        searchMedia(searchTerm);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else if (searchTerm.length === 0 && !allMediaLoaded) {
      loadAllMedia();
    }
  }, [searchTerm, searchMedia, loadAllMedia, allMediaLoaded]);

  /**
   * Handles clicks outside the dropdown to close it
   * @returns {void}
   * @throws {Error} - If handling outside click fails
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handles media selection from the dropdown
   * @param {*} media
   */
  const handleSelect = (media) => {
    setSelectedMedia(media);
    onChange(media.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  /**
   * Clears the selected media and resets the search term
   * @returns {void}
   * @throws {Error} - If clearing selection fails
   */
  const handleClear = () => {
    setSelectedMedia(null);
    onChange("");
    setSearchTerm("");
  };

  /**
   * Handles input click to open the dropdown and load all media if necessary
   * @returns {void}
   * @throws {Error} - If handling input click fails
   */
  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      if (!allMediaLoaded && searchTerm.length === 0) {
        loadAllMedia();
      }
    }
  };

  /**
   * Gets the title of the media item
   * @param {*} media
   * @returns {string} - The title of the media item
   */
  const getMediaTitle = (media) => {
    return media.title || media.name || "Unbekannt";
  };

  /**
   * returns the release year of the media item
   * @param {*} media
   * @returns {number} - The release year of the media item
   */
  const getMediaYear = (media) => {
    const date = media.releaseDate || media.firstAirDate;
    return date ? new Date(date).getFullYear() : "";
  };

  return (
    <div
      className={`searchable-media-select ${disabled ? "disabled" : ""}`}
      ref={dropdownRef}
    >
      <div className="selected-media-container">
        {selectedMedia ? (
          <div className="selected-media">
            {selectedMedia.posterPath && (
              <img
                src={`${import.meta.env.VITE_API_URL}/media/image/${selectedMedia.posterPath}`}
                alt={getMediaTitle(selectedMedia)}
                className="media-poster-small"
              />
            )}
            <div className="media-info">
              <span className="media-title">
                {getMediaTitle(selectedMedia)}
              </span>
              {getMediaYear(selectedMedia) && (
                <span className="media-year">
                  ({getMediaYear(selectedMedia)})
                </span>
              )}
            </div>
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              title="Auswahl entfernen"
              disabled={disabled}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="search-input-container">
            <input
              type="text"
              placeholder={disabled ? "Deaktiviert" : placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleInputClick}
              onClick={handleInputClick}
              className="search-input"
              disabled={disabled}
            />
            <div
              className="search-icon"
              onClick={() => !disabled && setIsOpen(!isOpen)}
            >
              {disabled ? "🔒" : "🔍"}
            </div>
          </div>
        )}
      </div>

      {isOpen && !selectedMedia && !disabled && (
        <div className="dropdown-menu">
          {loading ? (
            <div className="loading-item">
              <div className="mini-spinner"></div>
              Suche läuft...
            </div>
          ) : options.length > 0 ? (
            <div className="options-list">
              <div className="options-header">
                {searchTerm
                  ? `Suchergebnisse für "${searchTerm}"`
                  : `Alle verfügbaren ${type === "movie" ? "Filme" : "Serien"}`}
              </div>
              {options.map((media) => (
                <div
                  key={media.id}
                  className="option-item"
                  onClick={() => handleSelect(media)}
                >
                  {media.posterPath && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/media/image/${media.posterPath}`}
                      alt={getMediaTitle(media)}
                      className="media-poster-tiny"
                    />
                  )}
                  <div className="option-info">
                    <div className="option-title">{getMediaTitle(media)}</div>
                    {getMediaYear(media) && (
                      <div className="option-year">{getMediaYear(media)}</div>
                    )}
                    {media.overview && (
                      <div className="option-overview">
                        {media.overview.length > 80
                          ? `${media.overview.substring(0, 80)}...`
                          : media.overview}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="no-results">
              Keine {type === "movie" ? "Filme" : "Serien"} gefunden für "
              {searchTerm}"
            </div>
          ) : (
            <div className="search-hint">
              {searchTerm.length < 2
                ? `Mindestens 2 Zeichen eingeben zum Suchen`
                : `Keine ${type === "movie" ? "Filme" : "Serien"} verfügbar`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableMediaSelect;
