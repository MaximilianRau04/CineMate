import { useState, useEffect } from 'react';

export const useNotificationSettings = (userId) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    emailNotificationsEnabled: true,
    webNotificationsEnabled: true
  });
  const [preferences, setPreferences] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!userId) return;

    /**
     * loads all notification settings for the user
     */
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load user information
        const userResponse = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
        
        const globalResponse = await fetch(`http://localhost:8080/api/notification-preferences/user/${userId}/global`);
        if (globalResponse.ok) {
          const globalData = await globalResponse.json();
          setGlobalSettings(globalData);
        }

        const typesResponse = await fetch('http://localhost:8080/api/notification-preferences/types');
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          setNotificationTypes(typesData);
        }

        const prefsResponse = await fetch(`http://localhost:8080/api/notification-preferences/user/${userId}`);
        if (prefsResponse.ok) {
          const prefsData = await prefsResponse.json();
          setPreferences(prefsData);
        }
      } catch (err) {
        setError('Fehler beim Laden der Einstellungen: ' + err.message);
        console.error('Fehler beim Laden der Benachrichtigungseinstellungen:', err);
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
      
      const response = await fetch(`http://localhost:8080/api/notification-preferences/user/${userId}/global`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        setGlobalSettings(newSettings);
        return true;
      } else {
        throw new Error('Fehler beim Speichern der globalen Einstellungen');
      }
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Speichern:', err);
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
      
      const updatedPreferences = preferences.map(pref => {
        if (pref.type === notificationType) {
          return { ...pref, [settingType]: value };
        }
        return pref;
      });

      const response = await fetch(`http://localhost:8080/api/notification-preferences/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreferences)
      });

      if (response.ok) {
        setPreferences(updatedPreferences);
        return true;
      } else {
        throw new Error('Fehler beim Speichern der Benachrichtigungseinstellungen');
      }
    } catch (err) {
      setError(err.message);
      console.error('Fehler beim Speichern der Benachrichtigungseinstellungen:', err);
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
    return preferences.find(pref => pref.type === type) || {
      type: type,
      emailEnabled: true,
      webEnabled: true
    };
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
 
    clearError: () => setError(null)
  };
};
