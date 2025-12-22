import React, { useState, useEffect } from "react";

const StreamingIndicator = ({ mediaId, mediaType, maxProviders = 3 }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mediaId && mediaType) {
      fetchProviders();
    }
  }, [mediaId, mediaType]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * fetches the streaming providers for the given media ID and type.
   * @returns {Promise<void>}
   * @throws {Error} if the fetch fails or the response is not ok.
   */
  const fetchProviders = async () => {
    try {
      setLoading(true);
      // Convert frontend mediaType to backend format
      const backendMediaType = mediaType === "movies" ? "movie" : "series";
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/streaming/availability/${backendMediaType}/${mediaId}/region/DE`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      if (response.ok) {
        const data = await response.json();
        // Group by provider and take only unique providers
        const uniqueProviders = data.reduce((acc, availability) => {
          const providerId = availability.provider.id;
          if (!acc.find((p) => p.id === providerId)) {
            acc.push(availability.provider);
          }
          return acc;
        }, []);

        setProviders(uniqueProviders.slice(0, maxProviders));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Streaming-Anbieter:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || providers.length === 0) {
    return null;
  }

  return (
    <div className="streaming-indicator">
      <div className="streaming-logos">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="streaming-logo"
            title={provider.name}
          >
            {provider.logoUrl ? (
              <img
                src={provider.logoUrl}
                alt={provider.name}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div className="streaming-fallback" style={{ display: "none" }}>
              {provider.name.charAt(0)}
            </div>
          </div>
        ))}
        {providers.length >= maxProviders && (
          <div className="streaming-more" title="Weitere Anbieter verfügbar">
            <i className="bi bi-three-dots"></i>
          </div>
        )}
      </div>

      <style jsx>{`
        .streaming-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
        }

        .streaming-logos {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .streaming-logo,
        .streaming-more {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .streaming-logo img {
          width: 20px;
          height: 20px;
          object-fit: contain;
          border-radius: 2px;
        }

        .streaming-fallback {
          width: 20px;
          height: 20px;
          background: #007bff;
          color: white;
          font-size: 10px;
          font-weight: bold;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
        }

        .streaming-more {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .streaming-logo,
          .streaming-more {
            width: 20px;
            height: 20px;
          }

          .streaming-logo img {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default StreamingIndicator;
