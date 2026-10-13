const TYPE_ICONS = {
  MOVIE_WATCHLIST_RELEASED: "🎬",
  SERIES_NEW_SEASON: "📺",
  SERIES_NEW_EPISODE: "🆕",
  SERIES_STATUS_CHANGED: "📊",
  WATCHLIST_ITEM_REVIEWED: "⭐",
  FAVORITE_ITEM_REVIEWED: "❤️",
  MILESTONE_REACHED: "🏆",
  UPCOMING_RELEASES: "📅",
  SYSTEM_ANNOUNCEMENT: "📢",
  NEW_MOVIE_RELEASE: "🎬",
  WATCHLIST_REMINDER: "📋",
  RATING_UPDATE: "⭐",
  NEW_SEASON_ANNOUNCED: "📺",
  RECOMMENDATION: "💡",
  BIRTHDAY_REMINDER: "🎂",
  NEW_USER_REGISTERED: "👤",
  ADMIN_NOTIFICATION: "📢",
};

/**
 * localized label for a notification type
 * @param {string} type - the notification type
 * @param {Function} t - translate function from useTranslation
 * @returns {string}
 */
export const getNotificationTypeLabel = (type, t) => {
  const key = `notificationSettings.types.${type}`;
  const label = t ? t(key) : type;
  if (label === key) return type;
  return TYPE_ICONS[type] ? `${TYPE_ICONS[type]} ${label}` : label;
};

/**
 * creates a status message based on global settings
 * @param {object} globalSettings - the global settings
 * @param {Function} t - translate function from useTranslation
 * @returns {object} status info with text and CSS class
 */
export const getNotificationStatus = (globalSettings, t) => {
  const { emailNotificationsEnabled, webNotificationsEnabled } = globalSettings;

  if (emailNotificationsEnabled && webNotificationsEnabled) {
    return {
      text: t("notificationSettings.status.all"),
      className: "text-success",
    };
  }

  if (emailNotificationsEnabled && !webNotificationsEnabled) {
    return {
      text: t("notificationSettings.status.emailOnly"),
      className: "text-warning",
    };
  }

  if (!emailNotificationsEnabled && webNotificationsEnabled) {
    return {
      text: t("notificationSettings.status.webOnly"),
      className: "text-warning",
    };
  }

  return {
    text: t("notificationSettings.status.none"),
    className: "text-danger",
  };
};

/**
 * sorts notification types based on predefined order
 * @param {array} notificationTypes - array of notification types
 * @returns {array}
 */
export const sortNotificationTypes = (notificationTypes) => {
  const order = [
    "MOVIE_WATCHLIST_RELEASED",
    "SERIES_NEW_SEASON",
    "SERIES_NEW_EPISODE",
    "SERIES_STATUS_CHANGED",

    "WATCHLIST_ITEM_REVIEWED",
    "FAVORITE_ITEM_REVIEWED",
    "RATING_UPDATE",

    "MILESTONE_REACHED",
    "UPCOMING_RELEASES",

    "NEW_MOVIE_RELEASE",
    "WATCHLIST_REMINDER",
    "NEW_SEASON_ANNOUNCED",
    "RECOMMENDATION",
    "BIRTHDAY_REMINDER",
    "SYSTEM_ANNOUNCEMENT",

    "NEW_USER_REGISTERED",
    "ADMIN_NOTIFICATION",
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
 * @param {Function} t - translate function from useTranslation
 * @returns {object}
 */
export const groupNotificationTypes = (notificationTypes, t) => {
  const groups = {
    watchlist: {
      title: t("notificationSettings.groups.watchlist"),
      types: [
        "MOVIE_WATCHLIST_RELEASED",
        "SERIES_NEW_SEASON",
        "SERIES_NEW_EPISODE",
        "SERIES_STATUS_CHANGED",
      ],
    },
    reviews: {
      title: t("notificationSettings.groups.reviews"),
      types: [
        "WATCHLIST_ITEM_REVIEWED",
        "FAVORITE_ITEM_REVIEWED",
        "RATING_UPDATE",
      ],
    },
    achievements: {
      title: t("notificationSettings.groups.achievements"),
      types: ["MILESTONE_REACHED", "UPCOMING_RELEASES"],
    },
    general: {
      title: t("notificationSettings.groups.general"),
      types: [
        "NEW_MOVIE_RELEASE",
        "WATCHLIST_REMINDER",
        "NEW_SEASON_ANNOUNCED",
        "RECOMMENDATION",
        "BIRTHDAY_REMINDER",
        "SYSTEM_ANNOUNCEMENT",
      ],
    },
    admin: {
      title: t("notificationSettings.groups.admin"),
      types: ["NEW_USER_REGISTERED", "ADMIN_NOTIFICATION"],
    },
  };

  // only include groups that have available types
  const result = {};
  Object.entries(groups).forEach(([key, group]) => {
    const availableTypes = group.types.filter((type) =>
      notificationTypes.includes(type),
    );
    if (availableTypes.length > 0) {
      result[key] = {
        ...group,
        types: availableTypes,
      };
    }
  });

  return result;
};

/**
 * filters notification types based on user role
 * @param {array} notificationTypes - array of notification types
 * @param {object} user - user object with role information
 * @returns {array}
 */
export const filterNotificationTypesByRole = (notificationTypes, user) => {
  if (!user || !notificationTypes) return [];

  // Filter out WELCOME_NEW_USER from settings (but keep the type itself for notifications)
  let filteredTypes = notificationTypes.filter(
    (type) => type !== "WELCOME_NEW_USER",
  );

  // Only show NEW_USER_REGISTERED for admins
  if (user.role !== "ADMIN") {
    filteredTypes = filteredTypes.filter(
      (type) => type !== "NEW_USER_REGISTERED",
    );
  }

  return filteredTypes;
};
