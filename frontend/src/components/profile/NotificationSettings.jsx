import React from 'react';
import { useNotificationSettings } from '../../hooks/useNotificationSettings';
import { getNotificationTypeLabel, sortNotificationTypes } from './utils/notificationUtils';

const NotificationSettings = ({ userId }) => {
  const {
    loading,
    saving,
    error,
    globalSettings,
    notificationTypes,
    updateGlobalSettings,
    updatePreference,
    getPreferenceForType,
    clearError
  } = useNotificationSettings(userId);

  const sortedNotificationTypes = sortNotificationTypes(notificationTypes);

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">🔔 Benachrichtigungseinstellungen</h5>
        </div>
        <div className="card-body text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Wird geladen...</span>
          </div>
          <p className="mt-2">Einstellungen werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">🔔 Benachrichtigungseinstellungen</h5>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <strong>Fehler:</strong> {error}
            <button 
              className="btn btn-outline-danger btn-sm ms-2"
              onClick={clearError}
            >
              Fehler ausblenden
            </button>
            <button 
              className="btn btn-outline-danger btn-sm ms-2"
              onClick={() => window.location.reload()}
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">🔔 Benachrichtigungseinstellungen</h5>
      </div>
      <div className="card-body">
        {saving && (
          <div className="alert alert-info d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Einstellungen werden gespeichert...
          </div>
        )}

        {/* global settings */}
        <div className="mb-4">
          <h6 className="border-bottom pb-2 mb-3">📧 Globale Einstellungen</h6>
          
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailGlobal"
              checked={globalSettings.emailNotificationsEnabled}
              onChange={(e) => updateGlobalSettings('emailNotificationsEnabled', e.target.checked)}
              disabled={saving}
            />
            <label className="form-check-label" htmlFor="emailGlobal">
              <strong>📧 Email-Benachrichtigungen aktiviert</strong>
              <div className="text-muted small">
                Master-Schalter für alle Email-Benachrichtigungen
              </div>
            </label>
          </div>

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
              <strong>🌐 Web-Benachrichtigungen aktiviert</strong>
              <div className="text-muted small">
                Master-Schalter für alle Web-Benachrichtigungen
              </div>
            </label>
          </div>
        </div>

        {/* specific settings */}
        <div>
          <h6 className="border-bottom pb-2 mb-3">⚙️ Detaillierte Einstellungen</h6>
          <div className="text-muted small mb-3">
            Stelle für jeden Benachrichtigungstyp einzeln ein, ob du Email- und/oder Web-Benachrichtigungen erhalten möchtest.
          </div>

          <div className="row">
            {sortedNotificationTypes.map((type) => {
              const pref = getPreferenceForType(type);
              return (
                <div key={type} className="col-12 mb-3">
                  <div className="card">
                    <div className="card-body py-3">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <h6 className="mb-1">{getNotificationTypeLabel(type)}</h6>
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
                            <label className="form-check-label" htmlFor={`email-${type}`}>
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
                            <label className="form-check-label" htmlFor={`web-${type}`}>
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
        </div>

        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="mb-2">ℹ️ Hinweise:</h6>
          <ul className="mb-0 small text-muted">
            <li>Globale Einstellungen überschreiben alle spezifischen Einstellungen</li>
            <li>Email-Benachrichtigungen werden nur versendet, wenn sowohl global als auch spezifisch aktiviert</li>
            <li>Änderungen werden automatisch gespeichert</li>
            <li>Bei technischen Problemen werden Emails automatisch wiederholt</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
