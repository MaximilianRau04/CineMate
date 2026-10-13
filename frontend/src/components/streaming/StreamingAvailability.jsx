import React, { useState, useEffect } from "react";
import "./StreamingAvailability.css";
import api from "../../utils/api";
import { useTranslation } from "../../i18n/I18nContext";

const StreamingAvailability = ({ mediaId, mediaType, userRegion = "DE" }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, has, locale } = useTranslation();

  useEffect(() => {
    fetchStreamingAvailability();
  }, [mediaId, mediaType, userRegion]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * fetches the streaming availability for the given media ID and type.
   * @returns {Promise<void>}
   * @throws {Error} if the fetch fails or the response is not ok.
   */
  const fetchStreamingAvailability = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/streaming/availability/${mediaType}/${mediaId}`,
      );
      setAvailabilities(data);
      setError(null);
    } catch (err) {
      console.error("Fehler beim Laden der Streaming-Verfügbarkeiten:", err);
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
  const getAvailabilityTypeText = (type) =>
    has(`streaming.types.${type}`) ? t(`streaming.types.${type}`) : type;

  /**
   * returns the icon class for the availability type.
   * @param {*} type
   * @returns {string} the icon class for the availability type.
   */
  const getAvailabilityTypeIcon = (type) => {
    switch (type) {
      case "SUBSCRIPTION":
        return "bi-play-circle-fill";
      case "RENTAL":
        return "bi-clock-fill";
      case "PURCHASE":
        return "bi-cart-fill";
      case "FREE":
        return "bi-gift-fill";
      case "FREE_WITH_ADS":
        return "bi-tv-fill";
      default:
        return "bi-play-fill";
    }
  };

  /**
   * formats the price for display.
   * @param {*} price
   * @param {*} currency
   * @returns {string} - Formatted price string
   */
  const formatPrice = (price, currency) => {
    if (!price) return "";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency || "EUR",
      }).format(price);
    } catch {
      return `${price.toFixed(2)} ${currency || "€"}`;
    }
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
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  const heading = (
    <div className="cm-section-title mt-0">
      <h2>{t("streaming.title")}</h2>
    </div>
  );

  if (loading) {
    return (
      <section className="cm-detail-section">
        {heading}
        <div className="text-muted">
          <span className="spinner-border spinner-border-sm me-2" />
          {t("streaming.loading")}
        </div>
      </section>
    );
  }

  if (error || availabilities.length === 0) {
    return (
      <section className="cm-detail-section">
        {heading}
        <p className="text-muted mb-0">
          {error ? t("streaming.loadError") : t("streaming.none")}
        </p>
      </section>
    );
  }

  // Group availabilities by provider
  const groupedAvailabilities = availabilities.reduce((acc, availability) => {
    const providerId = availability.provider.id;
    if (!acc[providerId]) {
      acc[providerId] = {
        provider: availability.provider,
        availabilities: [],
      };
    }
    acc[providerId].availabilities.push(availability);
    return acc;
  }, {});

  return (
    <section className="cm-detail-section">
      {heading}

      <div className="cm-providers">
        {Object.values(groupedAvailabilities).map(
          ({ provider, availabilities: providerAvailabilities }) => (
            <button
              key={provider.id}
              type="button"
              className="cm-provider"
              onClick={() =>
                handleProviderClick(providerAvailabilities[0], provider)
              }
              title={t("streaming.watchOn", { provider: provider.name })}
            >
              <div className="cm-provider-logo">
                {provider.logoUrl ? (
                  <img
                    src={provider.logoUrl}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <i className="bi bi-tv" />
                )}
              </div>
              <div className="min-w-0 text-start">
                <div className="cm-provider-name">{provider.name}</div>
                <div className="cm-provider-offers">
                  {providerAvailabilities.map((availability, index) => (
                    <span
                      key={index}
                      className={`cm-offer cm-offer-${availability.availabilityType.toLowerCase()}`}
                    >
                      <i
                        className={`bi ${getAvailabilityTypeIcon(
                          availability.availabilityType,
                        )}`}
                      />
                      {getAvailabilityTypeText(availability.availabilityType)}
                      {availability.price
                        ? ` · ${formatPrice(availability.price, availability.currency)}`
                        : ""}
                      {availability.quality ? ` · ${availability.quality}` : ""}
                    </span>
                  ))}
                </div>
              </div>
              <i className="bi bi-box-arrow-up-right cm-provider-go" />
            </button>
          ),
        )}
      </div>

      <p className="small text-muted mt-2 mb-0">{t("streaming.disclaimer")}</p>
    </section>
  );
};

export default StreamingAvailability;
