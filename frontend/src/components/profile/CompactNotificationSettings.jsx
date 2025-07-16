import React, { useState } from 'react';
import { useNotificationSettings } from './utils/useNotificationSettings';
import { getNotificationTypeLabel, getNotificationStatus, filterNotificationTypesByRole } from './utils/notificationUtils';

const CompactNotificationSettings = ({ userId }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    loading,
    saving,
    globalSettings,
    notificationTypes,
    user,
    updateGlobalSettings,
    updatePreference,
    getPreferenceForType
  } = useNotificationSettings(userId);

  const filteredNotificationTypes = filterNotificationTypesByRole(notificationTypes, user);
  const status = getNotificationStatus(globalSettings);

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm" role="status"></div>
          <span className="ms-2">Benachrichtigungseinstellungen werden geladen...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">🔔 Benachrichtigungen</h6>
        <button 
          className="btn btn-link btn-sm p-0"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Weniger anzeigen' : 'Detaillierte Einstellungen'}
        </button>
      </div>
      <div className="card-body">
        {saving && (
          <div className="alert alert-info alert-sm d-flex align-items-center mb-3">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Wird gespeichert...
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="emailGlobal"
                checked={globalSettings.emailNotificationsEnabled}
                onChange={(e) => updateGlobalSettings('emailNotificationsEnabled', e.target.checked)}
                disabled={saving}
              />
              <label className="form-check-label" htmlFor="emailGlobal">
                📧 Email-Benachrichtigungen
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="webGlobal"
                checked={globalSettings.webNotificationsEnabled}
                onChange={(e) => updateGlobalSettings('webNotificationsEnabled', e.target.checked)}
                disabled={saving}
              />
              <label className="form-check-label" htmlFor="webGlobal">
                🌐 Web-Benachrichtigungen
              </label>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="summaryRecommendations"
                checked={globalSettings.summaryRecommendationsEnabled}
                onChange={(e) => updateGlobalSettings('summaryRecommendationsEnabled', e.target.checked)}
                disabled={saving}
              />
              <label className="form-check-label" htmlFor="summaryRecommendations">
                📝 Empfehlungen als Zusammenfassung
                <div className="text-muted small">
                  Mehrere Empfehlungen in einer Benachrichtigung
                </div>
              </label>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4">
            <h6 className="border-bottom pb-2 mb-3">⚙️ Detaillierte Einstellungen</h6>
            <div className="text-muted small mb-3">
              Stelle für jeden Benachrichtigungstyp einzeln ein, ob du Email- und/oder Web-Benachrichtigungen erhalten möchtest.
            </div>

            <div className="row">
              {filteredNotificationTypes.map((type) => {
                const pref = getPreferenceForType(type);
                return (
                  <div key={type} className="col-12 mb-2">
                    <div className="card border-light">
                      <div className="card-body py-2">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <small className="fw-bold">{getNotificationTypeLabel(type)}</small>
                          </div>
                          <div className="col-md-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`email-${type}`}
                                checked={pref.emailEnabled}
                                onChange={(e) => updatePreference(type, 'emailEnabled', e.target.checked)}
                                disabled={saving || !globalSettings.emailNotificationsEnabled}
                              />
                              <label className="form-check-label small" htmlFor={`email-${type}`}>
                                📧 Email
                              </label>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`web-${type}`}
                                checked={pref.webEnabled}
                                onChange={(e) => updatePreference(type, 'webEnabled', e.target.checked)}
                                disabled={saving || !globalSettings.webNotificationsEnabled}
                              />
                              <label className="form-check-label small" htmlFor={`web-${type}`}>
                                🌐 Web
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 p-3 bg-light rounded">
              <h6 className="mb-2">ℹ️ Hinweise:</h6>
              <ul className="mb-0 small text-muted">
                <li>Globale Einstellungen überschreiben alle spezifischen Einstellungen</li>
                <li>Email-Benachrichtigungen werden nur versendet, wenn sowohl global als auch spezifisch aktiviert</li>
                <li>Änderungen werden automatisch gespeichert</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-3">
          <small className="text-muted">
            <strong>Status:</strong> 
            <span className={status.className}> {status.text}</span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default CompactNotificationSettings;
