
/**
 * german translations for notification types
 * @param {string} type - the notification type
 * @returns {string} 
 */
export const getNotificationTypeLabel = (type) => {
  const labels = {
    'MOVIE_WATCHLIST_RELEASED': '🎬 Film aus Watchlist verfügbar',
    'SERIES_NEW_SEASON': '📺 Neue Staffel verfügbar',
    'SERIES_NEW_EPISODE': '🆕 Neue Episode verfügbar',
    'SERIES_STATUS_CHANGED': '📊 Serie Status-Update',
    'WATCHLIST_ITEM_REVIEWED': '⭐ Watchlist-Item bewertet',
    'FAVORITE_ITEM_REVIEWED': '❤️ Favorit bewertet',
    'MILESTONE_REACHED': '🏆 Meilenstein erreicht',
    'UPCOMING_RELEASES': '📅 Wöchentliche Zusammenfassung',
    'SYSTEM_ANNOUNCEMENT': '📢 System-Ankündigung',
    'NEW_MOVIE_RELEASE': '🎬 Neue Filmveröffentlichung',
    'NEW_EPISODE_AVAILABLE': '📺 Neue Episode verfügbar',
    'SERIES_STATUS_UPDATE': '📊 Serie Status-Update',
    'WATCHLIST_REMINDER': '📋 Watchlist-Erinnerung',
    'RATING_UPDATE': '⭐ Bewertungs-Update',
    'NEW_SEASON_ANNOUNCED': '📺 Neue Staffel angekündigt',
    'RECOMMENDATION': '💡 Empfehlung',
    'BIRTHDAY_REMINDER': '🎂 Geburtstags-Erinnerung'
  };
  return labels[type] || type;
};

/**
 * creates a status message based on global settings
 * @param {object} globalSettings - the global settings
 * @returns {object} status info with text and CSS class
 */
export const getNotificationStatus = (globalSettings) => {
  const { emailNotificationsEnabled, webNotificationsEnabled } = globalSettings;
  
  if (emailNotificationsEnabled && webNotificationsEnabled) {
    return {
      text: '✓ Alle Benachrichtigungen aktiviert',
      className: 'text-success'
    };
  }
  
  if (emailNotificationsEnabled && !webNotificationsEnabled) {
    return {
      text: '⚠️ Nur Email-Benachrichtigungen aktiviert',
      className: 'text-warning'
    };
  }
  
  if (!emailNotificationsEnabled && webNotificationsEnabled) {
    return {
      text: '⚠️ Nur Web-Benachrichtigungen aktiviert',
      className: 'text-warning'
    };
  }
  
  return {
    text: '✗ Alle Benachrichtigungen deaktiviert',
    className: 'text-danger'
  };
};

/**
 * sorts notification types based on predefined order
 * @param {array} notificationTypes - array of notification types
 * @returns {array} 
 */
export const sortNotificationTypes = (notificationTypes) => {
  const order = [
    'MOVIE_WATCHLIST_RELEASED',
    'SERIES_NEW_SEASON',
    'SERIES_NEW_EPISODE',
    'SERIES_STATUS_CHANGED',
    
    'WATCHLIST_ITEM_REVIEWED',
    'FAVORITE_ITEM_REVIEWED',
    'RATING_UPDATE',
    
    'MILESTONE_REACHED',
    'UPCOMING_RELEASES',
    
    'NEW_MOVIE_RELEASE',
    'NEW_EPISODE_AVAILABLE',
    'SERIES_STATUS_UPDATE',
    'WATCHLIST_REMINDER',
    'NEW_SEASON_ANNOUNCED',
    'RECOMMENDATION',
    'BIRTHDAY_REMINDER',
    'SYSTEM_ANNOUNCEMENT'
  ];

  return notificationTypes.sort((a, b) => {
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);
    
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });
};

/**
 * groups notification types into categories
 * @param {array} notificationTypes - array of notification types
 * @returns {object} 
 */
export const groupNotificationTypes = (notificationTypes) => {
  const groups = {
    watchlist: {
      title: '📋 Watchlist',
      types: ['MOVIE_WATCHLIST_RELEASED', 'SERIES_NEW_SEASON', 'SERIES_NEW_EPISODE', 'SERIES_STATUS_CHANGED']
    },
    reviews: {
      title: '⭐ Bewertungen',
      types: ['WATCHLIST_ITEM_REVIEWED', 'FAVORITE_ITEM_REVIEWED', 'RATING_UPDATE']
    },
    achievements: {
      title: '🏆 Erfolge',
      types: ['MILESTONE_REACHED', 'UPCOMING_RELEASES']
    },
    general: {
      title: '📢 Allgemein',
      types: ['NEW_MOVIE_RELEASE', 'NEW_EPISODE_AVAILABLE', 'SERIES_STATUS_UPDATE', 'WATCHLIST_REMINDER', 'NEW_SEASON_ANNOUNCED', 'RECOMMENDATION', 'BIRTHDAY_REMINDER', 'SYSTEM_ANNOUNCEMENT']
    }
  };

  // only include groups that have available types
  const result = {};
  Object.entries(groups).forEach(([key, group]) => {
    const availableTypes = group.types.filter(type => notificationTypes.includes(type));
    if (availableTypes.length > 0) {
      result[key] = {
        ...group,
        types: availableTypes
      };
    }
  });

  return result;
};
