import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SearchableMediaSelect.css';

const SearchableMediaSelect = ({ type, value, onChange, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [allMediaLoaded, setAllMediaLoaded] = useState(false);
    const dropdownRef = useRef(null);

    const fetchMediaDetails = useCallback(async (mediaId) => {
        try {
            const endpoint = type === 'movie' ? 'movies' : 'series';
            const response = await fetch(`http://localhost:8080/api/${endpoint}/${mediaId}`);
            if (response.ok) {
                const media = await response.json();
                setSelectedMedia(media);
            }
        } catch (error) {
            console.error(`Error fetching ${type} details:`, error);
        }
    }, [type]);

    const searchMedia = useCallback(async (query) => {
        setLoading(true);
        try {
            const endpoint = type === 'movie' ? 'movies' : 'series';
            const response = await fetch(`http://localhost:8080/api/${endpoint}/search?query=${encodeURIComponent(query)}&page=0&size=20`);
            if (response.ok) {
                const data = await response.json();
                setOptions(data.content || data);
            }
        } catch (error) {
            console.error(`Error searching ${type}:`, error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, [type]);

    const loadAllMedia = useCallback(async () => {
        if (allMediaLoaded) return;
        
        setLoading(true);
        try {
            const endpoint = type === 'movie' ? 'movies' : 'series';
            const response = await fetch(`http://localhost:8080/api/${endpoint}?page=0&size=100`);
            if (response.ok) {
                const data = await response.json();
                setOptions(data.content || data);
                setAllMediaLoaded(true);
            }
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (media) => {
        setSelectedMedia(media);
        onChange(media.id);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = () => {
        setSelectedMedia(null);
        onChange('');
        setSearchTerm('');
    };

    const handleInputClick = () => {
        if (!disabled) {
            setIsOpen(true);
            if (!allMediaLoaded && searchTerm.length === 0) {
                loadAllMedia();
            }
        }
    };

    const getMediaTitle = (media) => {
        return media.title || media.name || 'Unbekannt';
    };

    const getMediaYear = (media) => {
        const date = media.releaseDate || media.firstAirDate;
        return date ? new Date(date).getFullYear() : '';
    };

    return (
        <div className={`searchable-media-select ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
            <div className="selected-media-container">
                {selectedMedia ? (
                    <div className="selected-media">
                        {selectedMedia.posterPath && (
                            <img 
                                src={`http://localhost:8080/api/media/image/${selectedMedia.posterPath}`} 
                                alt={getMediaTitle(selectedMedia)}
                                className="media-poster-small"
                            />
                        )}
                        <div className="media-info">
                            <span className="media-title">{getMediaTitle(selectedMedia)}</span>
                            {getMediaYear(selectedMedia) && (
                                <span className="media-year">({getMediaYear(selectedMedia)})</span>
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
                            placeholder={disabled ? 'Deaktiviert' : placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={handleInputClick}
                            onClick={handleInputClick}
                            className="search-input"
                            disabled={disabled}
                        />
                        <div className="search-icon" onClick={() => !disabled && setIsOpen(!isOpen)}>
                            {disabled ? '�' : '�🔍'}
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
                                {searchTerm ? `Suchergebnisse für "${searchTerm}"` : `Alle verfügbaren ${type === 'movie' ? 'Filme' : 'Serien'}`}
                            </div>
                            {options.map((media) => (
                                <div
                                    key={media.id}
                                    className="option-item"
                                    onClick={() => handleSelect(media)}
                                >
                                    {media.posterPath && (
                                        <img 
                                            src={`http://localhost:8080/api/media/image/${media.posterPath}`} 
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
                                                    : media.overview
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchTerm.length >= 2 ? (
                        <div className="no-results">
                            Keine {type === 'movie' ? 'Filme' : 'Serien'} gefunden für "{searchTerm}"
                        </div>
                    ) : (
                        <div className="search-hint">
                            {searchTerm.length < 2 
                                ? `Mindestens 2 Zeichen eingeben zum Suchen` 
                                : `Keine ${type === 'movie' ? 'Filme' : 'Serien'} verfügbar`
                            }
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableMediaSelect;
