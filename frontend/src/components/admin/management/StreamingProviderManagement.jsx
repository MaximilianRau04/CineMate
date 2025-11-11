import React, { useState, useEffect } from 'react';
import { useToast } from '../../toasts';

const StreamingProviderManagement = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    country: 'DE',
    subscriptionRequired: false,
    rentalAvailable: false,
    purchaseAvailable: false
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
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch('http://localhost:8080/api/streaming/providers/all', { headers });

      if (!response.ok) {
        throw new Error('Anbieter konnten nicht geladen werden');
      }
      const data = await response.json();
      setProviders(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Anbieter:', err);
      setError(err.message);
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
      const url = editingProvider
        ? `http://localhost:8080/api/streaming/providers/${editingProvider.id}`
        : 'http://localhost:8080/api/streaming/providers';

      const method = editingProvider ? 'PUT' : 'POST';

      const token = localStorage.getItem('token');
      const headers = token
        ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        : { 'Content-Type': 'application/json' };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Anbieter konnte nicht gespeichert werden');
      }

      const action = editingProvider ? 'aktualisiert' : 'erstellt';
      success(`Streaming-Anbieter erfolgreich ${action}!`);
      await fetchProviders();
      handleCloseModal();
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      showError(err.message || 'Fehler beim Speichern des Anbieters');
      setError(err.message);
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
      logoUrl: provider.logoUrl || '',
      websiteUrl: provider.websiteUrl || '',
      country: provider.country || 'DE',
      subscriptionRequired: provider.subscriptionRequired,
      rentalAvailable: provider.rentalAvailable,
      purchaseAvailable: provider.purchaseAvailable
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
    if (!window.confirm('Möchten Sie diesen Anbieter wirklich löschen?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`http://localhost:8080/api/streaming/providers/${providerId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Anbieter konnte nicht gelöscht werden');
      }

      success('Streaming-Anbieter erfolgreich gelöscht!');
      await fetchProviders();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
      showError(err.message || 'Fehler beim Löschen des Anbieters');
      setError(err.message);
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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/streaming/providers/${providerId}/toggle`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Status konnte nicht geändert werden');
      }

      const updatedProvider = await response.json();

      setProviders(prevProviders =>
        prevProviders.map(provider =>
          provider.id === providerId ? updatedProvider : provider
        )
      );
    } catch (err) {
      console.error('Fehler beim Ändern des Status:', err);
      setError(err.message);
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
      name: '',
      logoUrl: '',
      websiteUrl: '',
      country: 'DE',
      subscriptionRequired: false,
      rentalAvailable: false,
      purchaseAvailable: false
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Lädt...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="streaming-provider-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>
          <i className="bi bi-tv me-2"></i>
          Streaming-Anbieter Verwaltung
        </h4>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Neuer Anbieter
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
              <th>Logo</th>
              <th>Name</th>
              <th>Land</th>
              <th>Verfügbarkeit</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(provider => (
              <tr key={provider.id}>
                <td>
                  {provider.logoUrl ? (
                    <img
                      src={provider.logoUrl}
                      alt={provider.name}
                      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                      <i className="bi bi-tv text-muted"></i>
                    </div>
                  )}
                </td>
                <td>
                  <strong>{provider.name}</strong>
                  {provider.websiteUrl && (
                    <div>
                      <small className="text-muted">
                        <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer">
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
                      <span className="badge bg-primary">Abo</span>
                    )}
                    {provider.rentalAvailable && (
                      <span className="badge bg-warning">Leihen</span>
                    )}
                    {provider.purchaseAvailable && (
                      <span className="badge bg-success">Kaufen</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`badge ${provider.active ? 'bg-success' : 'bg-danger'}`}>
                    {provider.active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(provider)}
                      title="Bearbeiten"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className={`btn btn-outline-${provider.active ? 'warning' : 'success'} btn-sm`}
                      onClick={() => handleToggleStatus(provider.id)}
                      title={provider.active ? 'Deaktivieren' : 'Aktivieren'}
                    >
                      <i className={`bi bi-${provider.active ? 'pause' : 'play'}`}></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(provider.id)}
                      title="Löschen"
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
          <i className="bi bi-tv" style={{ fontSize: '3rem', color: '#ccc' }}></i>
          <h5 className="mt-3 text-muted">Keine Streaming-Anbieter vorhanden</h5>
          <p className="text-muted">Fügen Sie den ersten Anbieter hinzu, um zu beginnen.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProvider ? 'Anbieter bearbeiten' : 'Neuer Anbieter'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name *</label>
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
                    <label htmlFor="logoUrl" className="form-label">Logo URL</label>
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
                    <label htmlFor="websiteUrl" className="form-label">Website URL</label>
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
                    <label htmlFor="country" className="form-label">Land</label>
                    <select
                      className="form-select"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="DE">Deutschland</option>
                      <option value="US">USA</option>
                      <option value="GB">Großbritannien</option>
                      <option value="FR">Frankreich</option>
                      <option value="IT">Italien</option>
                      <option value="ES">Spanien</option>
                      <option value="AT">Österreich</option>
                      <option value="CH">Schweiz</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Verfügbarkeitsoptionen</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="subscriptionRequired"
                        name="subscriptionRequired"
                        checked={formData.subscriptionRequired}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="subscriptionRequired">
                        Abo erforderlich
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
                      <label className="form-check-label" htmlFor="rentalAvailable">
                        Leihen verfügbar
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
                      <label className="form-check-label" htmlFor="purchaseAvailable">
                        Kauf verfügbar
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Abbrechen
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProvider ? 'Aktualisieren' : 'Erstellen'}
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
