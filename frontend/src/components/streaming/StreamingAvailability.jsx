import React, { useState, useEffect } from 'react';
import './StreamingAvailability.css';

const StreamingAvailability = ({ mediaId, mediaType, userRegion = 'DE' }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStreamingAvailability();
  }, [mediaId, mediaType, userRegion]);

  /**
   * fetches the streaming availability for the given media ID and type.
   * @returns {Promise<void>}
   * @throws {Error} if the fetch fails or the response is not ok.
   */
  const fetchStreamingAvailability = async () => {
    try {
      setLoading(true);
      // Convert frontend mediaType to backend format
      const backendMediaType = mediaType === 'movies' ? 'movie' : 'series';
      const response = await fetch(
        `http://localhost:8080/api/streaming/availability/${backendMediaType}/${mediaId}/region/${userRegion}`
      );
      
      if (!response.ok) {
        throw new Error('Streaming-Verfügbarkeiten konnten nicht geladen werden');
      }
      
      const data = await response.json();
      setAvailabilities(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Streaming-Verfügbarkeiten:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * returns the text representation of the availability type.
   * @param {*} type 
   * @returns {string} the text representation of the availability type. 
   */
  const getAvailabilityTypeText = (type) => {
    switch (type) {
      case 'SUBSCRIPTION':
        return 'Abo';
      case 'RENTAL':
        return 'Leihen';
      case 'PURCHASE':
        return 'Kaufen';
      case 'FREE':
        return 'Kostenlos';
      case 'FREE_WITH_ADS':
        return 'Kostenlos mit Werbung';
      default:
        return type;
    }
  };

  /**
   * returns the icon class for the availability type.
   * @param {*} type 
   * @returns {string} the icon class for the availability type. 
   */
  const getAvailabilityTypeIcon = (type) => {
    switch (type) {
      case 'SUBSCRIPTION':
        return 'bi-play-circle-fill';
      case 'RENTAL':
        return 'bi-clock-fill';
      case 'PURCHASE':
        return 'bi-cart-fill';
      case 'FREE':
        return 'bi-gift-fill';
      case 'FREE_WITH_ADS':
        return 'bi-tv-fill';
      default:
        return 'bi-play-fill';
    }
  };

  /**
   * formats the price for display.
   * @param {*} price 
   * @param {*} currency 
   * @returns {string} - Formatted price string 
   */
  const formatPrice = (price, currency) => {
    if (!price) return '';
    return `${price.toFixed(2)} ${currency || '€'}`;
  };

  /**
   * handles the click on a provider logo or name.
   * @param {*} availability 
   * @param {*} provider 
   */
  const handleProviderClick = (availability, provider) => {
    // Try availability URL first, then provider website URL
    const url = availability?.url || provider?.websiteUrl;
    if (url) {
      // Ensure URL has protocol
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log(`Keine URL verfügbar für ${provider?.name}`);
    }
  };

  if (loading) {
    return (
      <div className="streaming-availability">
        <h5 className="mb-3">
          <i className="bi bi-tv me-2"></i>
          Verfügbar auf
        </h5>
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Lädt...</span>
          </div>
          <span>Streaming-Verfügbarkeiten werden geladen...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="streaming-availability">
        <h5 className="mb-3">
          <i className="bi bi-tv me-2"></i>
          Verfügbar auf
        </h5>
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (availabilities.length === 0) {
    return (
      <div className="streaming-availability">
        <h5 className="mb-3">
          <i className="bi bi-tv me-2"></i>
          Verfügbar auf
        </h5>
        <div className="alert alert-info" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Derzeit keine Streaming-Verfügbarkeiten für Ihre Region verfügbar.
        </div>
      </div>
    );
  }

  // Group availabilities by provider
  const groupedAvailabilities = availabilities.reduce((acc, availability) => {
    const providerId = availability.provider.id;
    if (!acc[providerId]) {
      acc[providerId] = {
        provider: availability.provider,
        availabilities: []
      };
    }
    acc[providerId].availabilities.push(availability);
    return acc;
  }, {});

  return (
    <div className="streaming-availability">
      <h5 className="mb-3 text-white">
        <i className="bi bi-tv me-2"></i>
        Verfügbar auf
      </h5>
      
      <div className="streaming-providers">
        {Object.values(groupedAvailabilities).map(({ provider, availabilities: providerAvailabilities }) => (
          <div key={provider.id} className="streaming-provider-card">
            <div 
              className="provider-header"
              onClick={() => handleProviderClick(providerAvailabilities[0], provider)}
              style={{ cursor: 'pointer' }}
            >
              <div className="provider-info">
                <div className="provider-logo-container">
                  {provider.logoUrl ? (
                    <img 
                      src={provider.logoUrl} 
                      alt={provider.name}
                      className="provider-logo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="provider-logo-fallback" 
                    style={{ display: provider.logoUrl ? 'none' : 'flex' }}
                  >
                    <i className="bi bi-tv"></i>
                  </div>
                </div>
                <span className="provider-name">{provider.name}</span>
              </div>
              
              <div className="availability-options">
                {providerAvailabilities.map((availability, index) => (
                  <div key={index} className={`availability-badge ${availability.availabilityType.toLowerCase()}`}>
                    <i className={getAvailabilityTypeIcon(availability.availabilityType)}></i>
                    <span className="availability-text">
                      {getAvailabilityTypeText(availability.availabilityType)}
                    </span>
                    {availability.price && (
                      <span className="availability-price">
                        {formatPrice(availability.price, availability.currency)}
                      </span>
                    )}
                    {availability.quality && (
                      <span className="availability-quality">
                        {availability.quality}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {providerAvailabilities[0] && (
              <div className="provider-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering header click
                    handleProviderClick(providerAvailabilities[0], provider);
                  }}
                >
                  <i className="bi bi-play-fill me-1"></i>
                  Jetzt ansehen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="streaming-info mt-3">
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Verfügbarkeiten können sich ändern. Preise und Angebote können variieren.
        </small>
      </div>
    </div>
  );
};

export default StreamingAvailability;
