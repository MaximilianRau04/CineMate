import { useState, useEffect } from "react";
import api from "../../../utils/api";

export const useNotificationSettings = (userId) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    emailNotificationsEnabled: true,
    webNotificationsEnabled: true,
    summaryRecommendationsEnabled: false,
  });
  const [preferences, setPreferences] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) return;

    /**
     * loads all notification settings for the user
     * @returns {Promise<void>}
     * @throws {Error} if the request fails or the user is not found
     */
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load user information
        try {
          const { data: userData } = await api.get("/users/me");
          setUser(userData);
        } catch (e) {
          // ignore user load error, proceed with other settings
        }

        try {
          const { data: globalData } = await api.get(
            `/notification-preferences/user/${userId}/global`,
          );
          setGlobalSettings(globalData);
        } catch (e) {
          // ignore, keep defaults
        }

        try {
          const { data: typesData } = await api.get(
            "/notification-preferences/types",
          );
          setNotificationTypes(typesData);
        } catch (e) {
          // ignore
        }

        try {
          const { data: prefsData } = await api.get(
            `/notification-preferences/user/${userId}`,
          );
          setPreferences(prefsData);
        } catch (e) {
          // ignore
        }
      } catch (err) {
        setError("Fehler beim Laden der Einstellungen: " + err.message);
        console.error(
          "Fehler beim Laden der Benachrichtigungseinstellungen:",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [userId]);

  /**
   * updates global notification settings
   * @param {*} setting
   * @param {*} value
   * @returns {boolean} true if update was successful, false otherwise
   */
  const updateGlobalSettings = async (setting, value) => {
    try {
      setSaving(true);
      const newSettings = { ...globalSettings, [setting]: value };

      await api.put(
        `/notification-preferences/user/${userId}/global`,
        newSettings,
      );

      setGlobalSettings(newSettings);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Fehler beim Speichern:", err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  /**
   * updates a specific notification preference for the user
   * @param {*} notificationType
   * @param {*} settingType
   * @param {*} value
   * @returns {boolean} true if update was successful, false otherwise
   */
  const updatePreference = async (notificationType, settingType, value) => {
    try {
      setSaving(true);

      const updatedPreferences = preferences.map((pref) => {
        if (pref.type === notificationType) {
          return { ...pref, [settingType]: value };
        }
        return pref;
      });

      await api.put(
        `/notification-preferences/user/${userId}`,
        updatedPreferences,
      );

      setPreferences(updatedPreferences);
      return true;
    } catch (err) {
      setError(err.message);
      console.error(
        "Fehler beim Speichern der Benachrichtigungseinstellungen:",
        err,
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  /**
   * retrieves the notification preference for a specific type
   * @param {*} type
   * @returns {object} the preference for the given type, or a default object if not found
   */
  const getPreferenceForType = (type) => {
    return (
      preferences.find((pref) => pref.type === type) || {
        type: type,
        emailEnabled: true,
        webEnabled: true,
      }
    );
  };

  return {
    loading,
    saving,
    error,
    globalSettings,
    preferences,
    notificationTypes,
    user,

    updateGlobalSettings,
    updatePreference,
    getPreferenceForType,

    clearError: () => setError(null),
  };
};
