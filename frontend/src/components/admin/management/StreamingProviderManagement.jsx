import { useState, useEffect } from "react";
import { useToast } from "../../toasts";
import api from "../../../utils/api";
import "./StreamingProviderManagement.css";
import { useTranslation } from "../../../i18n/I18nContext";

const StreamingProviderManagement = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const { success, error: showError } = useToast();
  const { t, locale } = useTranslation();
  const countryName = (code) => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" }).of(code);
    } catch {
      return code;
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    country: "DE",
    subscriptionRequired: false,
    rentalAvailable: false,
    purchaseAvailable: false,
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  /**
   * fetches all streaming providers from the API.
   * @return {Promise<void>}
   * @throws {Error} if the fetch fails or the response is not ok.
   */
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/streaming/providers/all");
      setProviders(data);
      setError(null);
    } catch (err) {
      console.error("Fehler beim Laden der Anbieter:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handles the form submission for adding or editing a provider.
   * @param {*} e
   * @param {*} editingProvider
   * @returns {Promise<void>}
   * @throws {Error} if the fetch fails or the response is not ok.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProvider) {
        await api.put(`/streaming/providers/${editingProvider.id}`, formData);
      } else {
        await api.post("/streaming/providers", formData);
      }

      success(
        editingProvider
          ? t("admin.providers.updated")
          : t("admin.providers.created"),
      );
      await fetchProviders();
      handleCloseModal();
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      showError(
        err.response?.data?.message ||
          err.message ||
          t("admin.providers.saveError"),
      );
      setError(err.response?.data?.message || err.message);
    }
  };

  /**
   * handles the edit action for a provider.
   * @param {*} provider
   * @return {void}
   */
  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      logoUrl: provider.logoUrl || "",
      websiteUrl: provider.websiteUrl || "",
      country: provider.country || "DE",
      subscriptionRequired: provider.subscriptionRequired,
      rentalAvailable: provider.rentalAvailable,
      purchaseAvailable: provider.purchaseAvailable,
    });
    setShowModal(true);
  };

  /**
   * handles the delete action for a provider.
   * @param {*} providerId
   * @returns {Promise<void>}
   * @throws {Error} if the delete request fails or the response is not ok.
   */
  const handleDelete = async (providerId) => {
    if (!window.confirm(t("admin.providers.confirmDelete"))) {
      return;
    }

    try {
      await api.delete(`/streaming/providers/${providerId}`);
      success(t("admin.providers.deleted"));
      await fetchProviders();
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      showError(
        err.response?.data?.message ||
          err.message ||
          t("admin.providers.deleteError"),
      );
      setError(err.response?.data?.message || err.message);
    }
  };

  /**
   * handles toggling the status of a provider.
   * @param {*} providerId
   * @return {Promise<void>}
   * @throws {Error} if the toggle request fails or the response is not ok.
   */
  const handleToggleStatus = async (providerId) => {
    try {
      const { data: updatedProvider } = await api.patch(
        `/streaming/providers/${providerId}/toggle`,
      );

      setProviders((prevProviders) =>
        prevProviders.map((provider) =>
          provider.id === providerId ? updatedProvider : provider,
        ),
      );
    } catch (err) {
      console.error("Fehler beim Ändern des Status:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  /**
   * handles closing the modal and resetting the form.
   * @return {void}
   * @throws {Error} if the modal close fails or the response is not ok.
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProvider(null);
    setFormData({
      name: "",
      logoUrl: "",
      websiteUrl: "",
      country: "DE",
      subscriptionRequired: false,
      rentalAvailable: false,
      purchaseAvailable: false,
    });
  };

  /**
   * handles input changes in the form.
   * @param {*} e
   * @return {void}
   * @throws {Error} if the input change fails or the response is not ok.
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    <div className="streaming-provider-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <i className="bi bi-tv me-2"></i>
          {t("admin.tabs.streaming")}
        </h4>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus me-2"></i>
          {t("admin.providers.new")}
        </button>
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
              <th>{t("admin.providers.logo")}</th>
              <th>{t("admin.fields.name")}</th>
              <th>{t("admin.fields.country")}</th>
              <th>{t("admin.providers.availability")}</th>
              <th>{t("admin.fields.status")}</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td>
                  {provider.logoUrl ? (
                    <img
                      src={provider.logoUrl}
                      alt={provider.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                      }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center rounded"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                      }}
                    >
                      <i className="bi bi-tv text-muted"></i>
                    </div>
                  )}
                </td>
                <td>
                  <strong>{provider.name}</strong>
                  {provider.websiteUrl && (
                    <div>
                      <small className="text-muted">
                        <a
                          href={provider.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {provider.websiteUrl}
                        </a>
                      </small>
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge bg-secondary">{provider.country}</span>
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    {provider.subscriptionRequired && (
                      <span className="badge bg-primary">
                        {t("streaming.types.SUBSCRIPTION")}
                      </span>
                    )}
                    {provider.rentalAvailable && (
                      <span className="badge bg-warning">
                        {t("streaming.types.RENTAL")}
                      </span>
                    )}
                    {provider.purchaseAvailable && (
                      <span className="badge bg-success text-dark">
                        {t("streaming.types.PURCHASE")}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${provider.active ? "bg-success" : "bg-danger"}`}
                  >
                    {provider.active
                      ? t("admin.providers.active")
                      : t("admin.providers.inactive")}
                  </span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(provider)}
                      title={t("common.edit")}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className={`btn btn-outline-${provider.active ? "warning" : "success"} btn-sm`}
                      onClick={() => handleToggleStatus(provider.id)}
                      title={
                        provider.active
                          ? t("admin.providers.deactivate")
                          : t("admin.providers.activate")
                      }
                    >
                      <i
                        className={`bi bi-${provider.active ? "pause" : "play"}`}
                      ></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(provider.id)}
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

      {providers.length === 0 && !loading && (
        <div className="text-center py-5">
          <i
            className="bi bi-tv"
            style={{ fontSize: "3rem", opacity: 0.4 }}
          ></i>
          <h5 className="mt-3 text-muted">{t("admin.providers.empty")}</h5>
          <p className="text-muted">{t("admin.providers.emptyHint")}</p>
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
                  {editingProvider
                    ? t("admin.providers.edit")
                    : t("admin.providers.new")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      {t("admin.fields.name")} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="logoUrl" className="form-label">
                      {t("admin.providers.logoUrl")}
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="logoUrl"
                      name="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="websiteUrl" className="form-label">
                      {t("admin.providers.websiteUrl")}
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                      {t("admin.fields.country")}
                    </label>
                    <select
                      className="form-select"
                      id="country"
                      name="country"
                      value={formData.country}
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

                  <div className="mb-3">
                    <label className="form-label">
                      {t("admin.providers.availabilityOptions")}
                    </label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="subscriptionRequired"
                        name="subscriptionRequired"
                        checked={formData.subscriptionRequired}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="subscriptionRequired"
                      >
                        {t("admin.providers.subscriptionRequired")}
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rentalAvailable"
                        name="rentalAvailable"
                        checked={formData.rentalAvailable}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="rentalAvailable"
                      >
                        {t("admin.providers.rentalAvailable")}
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="purchaseAvailable"
                        name="purchaseAvailable"
                        checked={formData.purchaseAvailable}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="purchaseAvailable"
                      >
                        {t("admin.providers.purchaseAvailable")}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    {t("common.cancel")}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProvider ? t("common.save") : t("common.create")}
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

export default StreamingProviderManagement;
