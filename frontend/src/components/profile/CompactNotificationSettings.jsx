import React, { useState } from "react";
import { useNotificationSettings } from "./utils/useNotificationSettings";
import {
  getNotificationTypeLabel,
  getNotificationStatus,
  filterNotificationTypesByRole,
} from "./utils/notificationUtils";
import { useTranslation } from "../../i18n/I18nContext";

const CompactNotificationSettings = ({ userId }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  const {
    loading,
    saving,
    globalSettings,
    notificationTypes,
    user,
    updateGlobalSettings,
    updatePreference,
    getPreferenceForType,
  } = useNotificationSettings(userId);

  const filteredNotificationTypes = filterNotificationTypesByRole(
    notificationTypes,
    user,
  );
  const status = getNotificationStatus(globalSettings, t);

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm" role="status"></div>
          <span className="ms-2">{t("notificationSettings.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card cm-settings-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="cm-panel-title mb-0">
          {t("notificationSettings.title")}
        </h2>
        <button
          className="btn btn-link btn-sm p-0"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails
            ? t("common.showLess")
            : t("notificationSettings.detailed")}
        </button>
      </div>
      <div className="card-body">
        {saving && (
          <div className="alert alert-info alert-sm d-flex align-items-center mb-3">
            <div
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></div>
            {t("common.saving")}
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
                onChange={(e) =>
                  updateGlobalSettings(
                    "emailNotificationsEnabled",
                    e.target.checked,
                  )
                }
                disabled={saving}
              />
              <label className="form-check-label" htmlFor="emailGlobal">
                {t("notificationSettings.email")}
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
                onChange={(e) =>
                  updateGlobalSettings(
                    "webNotificationsEnabled",
                    e.target.checked,
                  )
                }
                disabled={saving}
              />
              <label className="form-check-label" htmlFor="webGlobal">
                {t("notificationSettings.web")}
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
                onChange={(e) =>
                  updateGlobalSettings(
                    "summaryRecommendationsEnabled",
                    e.target.checked,
                  )
                }
                disabled={saving}
              />
              <label
                className="form-check-label"
                htmlFor="summaryRecommendations"
              >
                {t("notificationSettings.summary")}
                <div className="text-muted small">
                  {t("notificationSettings.summaryHint")}
                </div>
              </label>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4">
            <h6 className="border-bottom pb-2 mb-3">
              {t("notificationSettings.detailed")}
            </h6>
            <div className="text-muted small mb-3">
              {t("notificationSettings.detailedHint")}
            </div>

            <div className="row">
              {filteredNotificationTypes.map((type) => {
                const pref = getPreferenceForType(type);
                return (
                  <div key={type} className="col-12 mb-2">
                    <div className="card">
                      <div className="card-body py-2">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <small className="fw-bold">
                              {getNotificationTypeLabel(type, t)}
                            </small>
                          </div>
                          <div className="col-md-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`email-${type}`}
                                checked={pref.emailEnabled}
                                onChange={(e) =>
                                  updatePreference(
                                    type,
                                    "emailEnabled",
                                    e.target.checked,
                                  )
                                }
                                disabled={
                                  saving ||
                                  !globalSettings.emailNotificationsEnabled
                                }
                              />
                              <label
                                className="form-check-label small"
                                htmlFor={`email-${type}`}
                              >
                                {t("notificationSettings.emailShort")}
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
                                onChange={(e) =>
                                  updatePreference(
                                    type,
                                    "webEnabled",
                                    e.target.checked,
                                  )
                                }
                                disabled={
                                  saving ||
                                  !globalSettings.webNotificationsEnabled
                                }
                              />
                              <label
                                className="form-check-label small"
                                htmlFor={`web-${type}`}
                              >
                                {t("notificationSettings.webShort")}
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
              <h6 className="mb-2">{t("notificationSettings.notes")}</h6>
              <ul className="mb-0 small text-muted">
                <li>{t("notificationSettings.note1")}</li>
                <li>{t("notificationSettings.note2")}</li>
                <li>{t("notificationSettings.note3")}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-3">
          <small className="text-muted">
            <strong>{t("notificationSettings.statusLabel")}</strong>
            <span className={status.className}> {status.text}</span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default CompactNotificationSettings;
