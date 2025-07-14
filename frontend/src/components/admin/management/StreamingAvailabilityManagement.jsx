import React, { useState, useEffect } from 'react';

const StreamingAvailabilityManagement = ({ mediaId, mediaType, mediaTitle, onClose }) => {
    const [availabilities, setAvailabilities] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingAvailability, setEditingAvailability] = useState(null);
    const [formData, setFormData] = useState({
        providerId: '',
        availabilityType: 'SUBSCRIPTION',
        region: 'DE',
        price: '',
        currency: 'EUR',
        quality: '',
        url: ''
    });

    useEffect(() => {
        fetchData();
    }, [mediaId, mediaType]);

    /**
     * Loads availabilities and providers
     */
    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch existing availabilities
            const availabilityResponse = await fetch(
                `http://localhost:8080/api/streaming/availability/${mediaType}/${mediaId}`
            );

            if (availabilityResponse.ok) {
                const availabilityData = await availabilityResponse.json();
                setAvailabilities(availabilityData);
            }

            // Fetch all providers
            const providerResponse = await fetch('http://localhost:8080/api/streaming/providers');
            if (providerResponse.ok) {
                const providerData = await providerResponse.json();
                setProviders(providerData);
            }

            setError(null);
        } catch (err) {
            console.error('Fehler beim Laden der Daten:', err);
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
            const url = editingAvailability
                ? `http://localhost:8080/api/streaming/availability/${editingAvailability.id}`
                : `http://localhost:8080/api/streaming/availability/${mediaType}/${mediaId}`;

            const method = editingAvailability ? 'PUT' : 'POST';

            const params = new URLSearchParams({
                providerId: formData.providerId,
                availabilityType: formData.availabilityType,
                region: formData.region,
                ...(formData.price && { price: formData.price }),
                ...(formData.currency && { currency: formData.currency }),
                ...(formData.quality && { quality: formData.quality }),
                ...(formData.url && { url: formData.url })
            });

            const fetchUrl = editingAvailability ? url : `${url}?${params.toString()}`;
            const body = editingAvailability ? params : undefined;

            const response = await fetch(fetchUrl, {
                method,
                ...(editingAvailability && {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: body
                })
            });

            if (!response.ok) {
                throw new Error('Verfügbarkeit konnte nicht gespeichert werden');
            }

            await fetchData();
            handleCloseModal();
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
            setError(err.message);
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
            region: availability.region || 'DE',
            price: availability.price || '',
            currency: availability.currency || 'EUR',
            quality: availability.quality || '',
            url: availability.url || ''
        });
        setShowModal(true);
    };

    /**
     * Handles deleting an availability
     * @param {string} availabilityId - The ID of the availability to delete
     */
    const handleDelete = async (availabilityId) => {
        if (!window.confirm('Möchten Sie diese Verfügbarkeit wirklich löschen?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/streaming/availability/${availabilityId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Verfügbarkeit konnte nicht gelöscht werden');
            }

            await fetchData();
        } catch (err) {
            console.error('Fehler beim Löschen:', err);
            setError(err.message);
        }
    };

    /**
     * Handles closing the modal
     */
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAvailability(null);
        setFormData({
            providerId: '',
            availabilityType: 'SUBSCRIPTION',
            region: 'DE',
            price: '',
            currency: 'EUR',
            quality: '',
            url: ''
        });
    };

    /**
     * Handles input changes
     * @param {Event} e - The input change event
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * returns the text representation of the availability type
     * @param {*} type 
     * @returns {string} 
     */
    const getAvailabilityTypeText = (type) => {
        switch (type) {
            case 'SUBSCRIPTION': return 'Abo';
            case 'RENTAL': return 'Leihen';
            case 'PURCHASE': return 'Kaufen';
            case 'FREE': return 'Kostenlos';
            default: return type;
        }
    };

    /**
     * returns the Bootstrap badge class for the availability type
     * @param {*} type 
     * @returns {string} 
     */
    const getAvailabilityTypeBadgeClass = (type) => {
        switch (type) {
            case 'SUBSCRIPTION': return 'bg-primary';
            case 'RENTAL': return 'bg-warning';
            case 'PURCHASE': return 'bg-success';
            case 'FREE': return 'bg-info';
            default: return 'bg-secondary';
        }
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
        <div className="streaming-availability-management">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4>
                        <i className="bi bi-tv me-2"></i>
                        Streaming-Verfügbarkeiten
                    </h4>
                    <p className="text-muted mb-0">
                        {mediaTitle} ({mediaType === 'movie' ? 'Film' : 'Serie'})
                    </p>
                </div>
                <div>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-plus me-2"></i>
                        Verfügbarkeit hinzufügen
                    </button>

                    <button type="button" className="btn-close" onClick={onClose}></button>
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
                            <th>Anbieter</th>
                            <th>Typ</th>
                            <th>Region</th>
                            <th>Preis</th>
                            <th>Qualität</th>
                            <th>URL</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availabilities.map(availability => (
                            <tr key={availability.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {availability.provider.logoUrl ? (
                                            <img
                                                src={availability.provider.logoUrl}
                                                alt={availability.provider.name}
                                                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                                className="me-2"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        ) : (
                                            <div className="bg-light d-flex align-items-center justify-content-center me-2"
                                                style={{ width: '32px', height: '32px', borderRadius: '4px' }}>
                                                <i className="bi bi-tv text-muted"></i>
                                            </div>
                                        )}
                                        <span>{availability.provider.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${getAvailabilityTypeBadgeClass(availability.availabilityType)}`}>
                                        {getAvailabilityTypeText(availability.availabilityType)}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge bg-secondary">{availability.region}</span>
                                </td>
                                <td>
                                    {availability.price ? (
                                        <span>{availability.price} {availability.currency}</span>
                                    ) : (
                                        <span className="text-muted">-</span>
                                    )}
                                </td>
                                <td>
                                    {availability.quality ? (
                                        <span className="badge bg-info">{availability.quality}</span>
                                    ) : (
                                        <span className="text-muted">-</span>
                                    )}
                                </td>
                                <td>
                                    {availability.url ? (
                                        <a href={availability.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
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
                                            title="Bearbeiten"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(availability.id)}
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

            {availabilities.length === 0 && !loading && (
                <div className="text-center py-5">
                    <i className="bi bi-tv" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                    <h5 className="mt-3 text-muted">Keine Streaming-Verfügbarkeiten vorhanden</h5>
                    <p className="text-muted">Fügen Sie die erste Verfügbarkeit hinzu, um zu beginnen.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingAvailability ? 'Verfügbarkeit bearbeiten' : 'Neue Verfügbarkeit'}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="providerId" className="form-label">Anbieter *</label>
                                        <select
                                            className="form-select"
                                            id="providerId"
                                            name="providerId"
                                            value={formData.providerId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Anbieter auswählen</option>
                                            {providers.map(provider => (
                                                <option key={provider.id} value={provider.id}>
                                                    {provider.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="availabilityType" className="form-label">Verfügbarkeitstyp *</label>
                                        <select
                                            className="form-select"
                                            id="availabilityType"
                                            name="availabilityType"
                                            value={formData.availabilityType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="SUBSCRIPTION">Abo</option>
                                            <option value="RENTAL">Leihen</option>
                                            <option value="PURCHASE">Kaufen</option>
                                            <option value="FREE">Kostenlos</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="region" className="form-label">Region</label>
                                        <select
                                            className="form-select"
                                            id="region"
                                            name="region"
                                            value={formData.region}
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

                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                <label htmlFor="price" className="form-label">Preis</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    id="price"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="currency" className="form-label">Währung</label>
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
                                        <label htmlFor="quality" className="form-label">Qualität</label>
                                        <select
                                            className="form-select"
                                            id="quality"
                                            name="quality"
                                            value={formData.quality}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Nicht angegeben</option>
                                            <option value="SD">SD</option>
                                            <option value="HD">HD</option>
                                            <option value="4K">4K</option>
                                            <option value="HDR">HDR</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="url" className="form-label">Direct Link URL</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="url"
                                            name="url"
                                            value={formData.url}
                                            onChange={handleInputChange}
                                            placeholder="Optional - direkter Link zum Inhalt"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        {editingAvailability ? 'Aktualisieren' : 'Hinzufügen'}
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
