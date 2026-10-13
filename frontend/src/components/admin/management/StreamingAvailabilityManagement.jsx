import { useState, useEffect } from "react";
import api from "../../../utils/api";
import { useTranslation } from "../../../i18n/I18nContext";

const StreamingAvailabilityManagement = ({
  mediaId,
  mediaType,
  mediaTitle,
  onClose,
}) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, locale } = useTranslation();
  const countryName = (code) => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" }).of(code);
    } catch {
      return code;
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [formData, setFormData] = useState({
    providerId: "",
    availabilityType: "SUBSCRIPTION",
    region: "DE",
    price: "",
    currency: "EUR",
    quality: "",
    url: "",
  });

  useEffect(() => {
    fetchData();
  }, [mediaId, mediaType]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Loads availabilities and providers
   */
  const fetchData = async () => {
    try {
      setLoading(true);

      try {
        const { data: availabilityData } = await api.get(
          `/streaming/availability/${mediaType}/${mediaId}`,
        );
        setAvailabilities(availabilityData);
      } catch (err) {
        // non-critical, keep existing state
      }

      try {
        const { data: providerData } = await api.get("/streaming/providers");
        setProviders(providerData);
      } catch (err) {
        // non-critical
      }

      setError(null);
    } catch (err) {
      console.error("Fehler beim Laden der Daten:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form submission for adding or editing availability
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams({
        providerId: formData.providerId,
        availabilityType: formData.availabilityType,
        region: formData.region,
        ...(formData.price && { price: formData.price }),
        ...(formData.currency && { currency: formData.currency }),
        ...(formData.quality && { quality: formData.quality }),
        ...(formData.url && { url: formData.url }),
      });

      if (editingAvailability) {
        await api.put(
          `/streaming/availability/${editingAvailability.id}?${params.toString()}`,
          params.toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        );
      } else {
        await api.post(
          `/streaming/availability/${mediaType}/${mediaId}?${params.toString()}`,
        );
      }

      await fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  /**
   * Handles editing an availability
   * @param {Object} availability - The availability to edit
   */
  const handleEdit = (availability) => {
    setEditingAvailability(availability);
    setFormData({
      providerId: availability.provider.id,
      availabilityType: availability.availabilityType,
      region: availability.region || "DE",
      price: availability.price || "",
      currency: availability.currency || "EUR",
      quality: availability.quality || "",
      url: availability.url || "",
    });
    setShowModal(true);
  };

  /**
   * Handles deleting an availability
   * @param {string} availabilityId - The ID of the availability to delete
   */
  const handleDelete = async (availabilityId) => {
    if (!window.confirm(t("admin.availability.confirmDelete"))) {
      return;
    }

    try {
      await api.delete(`/streaming/availability/${availabilityId}`);
      await fetchData();
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  /**
   * Handles closing the modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAvailability(null);
    setFormData({
      providerId: "",
      availabilityType: "SUBSCRIPTION",
      region: "DE",
      price: "",
      currency: "EUR",
      quality: "",
      url: "",
    });
  };

  /**
   * Handles input changes
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * returns the text representation of the availability type
   * @param {*} type
   * @returns {string}
   */
  const getAvailabilityTypeText = (type) =>
    ["SUBSCRIPTION", "RENTAL", "PURCHASE", "FREE"].includes(type)
      ? t(`streaming.types.${type}`)
      : type;

  /**
   * returns the Bootstrap badge class for the availability type
   * @param {*} type
   * @returns {string}
   */
  const getAvailabilityTypeBadgeClass = (type) => {
    switch (type) {
      case "SUBSCRIPTION":
        return "bg-primary";
      case "RENTAL":
        return "bg-warning";
      case "PURCHASE":
        return "bg-success";
      case "FREE":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="streaming-availability-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>
            <i className="bi bi-tv me-2"></i>
            {t("admin.availability.title")}
          </h4>
          <p className="text-muted mb-0">
            {mediaTitle} (
            {mediaType === "movie" ? t("common.movie") : t("common.series")})
          </p>
        </div>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus me-2"></i>
            {t("admin.availability.add")}
          </button>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label={t("common.close")}
          ></button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{t("admin.availability.provider")}</th>
              <th>{t("admin.fields.type")}</th>
              <th>{t("admin.availability.region")}</th>
              <th>{t("admin.availability.price")}</th>
              <th>{t("admin.availability.quality")}</th>
              <th>{t("admin.availability.url")}</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {availabilities.map((availability) => (
              <tr key={availability.id}>
                <td>
                  <div className="d-flex align-items-center">
                    {availability.provider.logoUrl ? (
                      <img
                        src={availability.provider.logoUrl}
                        alt={availability.provider.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "contain",
                        }}
                        className="me-2"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center me-2"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "4px",
                        }}
                      >
                        <i className="bi bi-tv text-muted"></i>
                      </div>
                    )}
                    <span>{availability.provider.name}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${getAvailabilityTypeBadgeClass(availability.availabilityType)}`}
                  >
                    {getAvailabilityTypeText(availability.availabilityType)}
                  </span>
                </td>
                <td>
                  <span className="badge bg-secondary">
                    {availability.region}
                  </span>
                </td>
                <td>
                  {availability.price ? (
                    <span>
                      {availability.price} {availability.currency}
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  {availability.quality ? (
                    <span className="badge bg-info">
                      {availability.quality}
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  {availability.url ? (
                    <a
                      href={availability.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(availability)}
                      title={t("common.edit")}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(availability.id)}
                      title={t("common.delete")}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {availabilities.length === 0 && !loading && (
        <div className="text-center py-5">
          <i
            className="bi bi-tv"
            style={{ fontSize: "3rem", color: "#ccc" }}
          ></i>
          <h5 className="mt-3 text-muted">{t("admin.availability.empty")}</h5>
          <p className="text-muted">{t("admin.availability.emptyHint")}</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(8, 4, 10, 0.75)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAvailability
                    ? t("admin.availability.edit")
                    : t("admin.availability.new")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label={t("common.close")}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="providerId" className="form-label">
                      {t("admin.availability.provider")} *
                    </label>
                    <select
                      className="form-select"
                      id="providerId"
                      name="providerId"
                      value={formData.providerId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        {t("admin.availability.selectProvider")}
                      </option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="availabilityType" className="form-label">
                      {t("admin.availability.type")} *
                    </label>
                    <select
                      className="form-select"
                      id="availabilityType"
                      name="availabilityType"
                      value={formData.availabilityType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="SUBSCRIPTION">
                        {t("streaming.types.SUBSCRIPTION")}
                      </option>
                      <option value="RENTAL">
                        {t("streaming.types.RENTAL")}
                      </option>
                      <option value="PURCHASE">
                        {t("streaming.types.PURCHASE")}
                      </option>
                      <option value="FREE">{t("streaming.types.FREE")}</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="region" className="form-label">
                      {t("admin.availability.region")}
                    </label>
                    <select
                      className="form-select"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                    >
                      <option value="DE">{countryName("DE")}</option>
                      <option value="US">{countryName("US")}</option>
                      <option value="GB">{countryName("GB")}</option>
                      <option value="FR">{countryName("FR")}</option>
                      <option value="IT">{countryName("IT")}</option>
                      <option value="ES">{countryName("ES")}</option>
                      <option value="AT">{countryName("AT")}</option>
                      <option value="CH">{countryName("CH")}</option>
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label htmlFor="price" className="form-label">
                          {t("admin.availability.price")}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder={t("admin.availability.optional")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="currency" className="form-label">
                          {t("admin.availability.currency")}
                        </label>
                        <select
                          className="form-select"
                          id="currency"
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                        >
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                          <option value="CHF">CHF</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="quality" className="form-label">
                      {t("admin.availability.quality")}
                    </label>
                    <select
                      className="form-select"
                      id="quality"
                      name="quality"
                      value={formData.quality}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        {t("admin.availability.notSpecified")}
                      </option>
                      <option value="SD">SD</option>
                      <option value="HD">HD</option>
                      <option value="4K">4K</option>
                      <option value="HDR">HDR</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="url" className="form-label">
                      {t("admin.availability.directLink")}
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder={t(
                        "admin.availability.directLinkPlaceholder",
                      )}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {editingAvailability ? t("common.save") : t("common.add")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingAvailabilityManagement;
