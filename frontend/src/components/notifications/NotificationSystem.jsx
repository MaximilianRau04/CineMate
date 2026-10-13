import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Clock } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";
import { useTranslation } from "../../i18n/I18nContext";

const NotificationSystem = () => {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const { t, formatRelative } = useTranslation();
  const userId = user?.id ?? null;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches notifications for the current user.
   * @returns {Promise<void>}
   * @throws {Error} If the fetch request fails.
   */
  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      await fetchUnreadCount();

      const url = showUnreadOnly
        ? `/notifications/user/${userId}/unread`
        : `/notifications/user/${userId}`;

      const { data } = await api.get(url);

      const processedData = data.map((notification) => ({
        ...notification,
        createdAt: notification.createdAt || new Date().toISOString(),
        readAt: notification.readAt || null,
      }));

      setNotifications(processedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showError(t("notifications.loadError"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marks a notification as read.
   * @param {number} notificationId - The ID of the notification to mark as read.
   * @returns {Promise<void>}
   */
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);

      if (showUnreadOnly) {
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId),
        );
      } else {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId
              ? { ...notif, read: true, readAt: new Date().toISOString() }
              : notif,
          ),
        );
      }

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      showError(t("notifications.markReadError"));
    }
  };

  /**
   * Marks all notifications as read.
   * @returns {Promise<void>}
   * @throws {Error} If the fetch request fails.
   */
  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/user/${userId}/read-all`);

      if (showUnreadOnly) {
        setNotifications([]);
      } else {
        setNotifications((prev) =>
          prev.map((notif) => ({
            ...notif,
            read: true,
            readAt: new Date().toISOString(),
          })),
        );
      }

      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      showError(t("notifications.markAllReadError"));
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;

    try {
      const { data: countData } = await api.get(
        `/notifications/user/${userId}/unread/count`,
      );
      setUnreadCount(countData.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  /**
   * Deletes all notifications for the current user.
   * @returns {Promise<void>}
   */
  const deleteAllNotifications = async () => {
    try {
      await api.delete(`/notifications/user/${userId}/delete-all`);

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      showError(t("notifications.deleteAllError"));
    }
  };

  /**
   * Deletes a notification.
   * @param {number} notificationId - The ID of the notification to delete.
   * @returns {Promise<void>}
   */
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);

      const deletedNotif = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId),
      );

      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      showError(t("notifications.deleteError"));
    }
  };

  /**
   * Gets the notification style based on the type.
   * @param {string} type - The type of the notification.
   * @returns {Object} The style object containing icon and color.
   */
  const getNotificationIcon = (type) => {
    const icons = {
      NEW_MOVIE: "🎬",
      REMINDER: "⏰",
      FRIEND_REQUEST: "👥",
      SYSTEM: "⚙️",
      PROMOTION: "🎁",
    };
    return icons[type] || "📢";
  };

  // Fetch notifications when userId changes or filter changes
  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [userId, showUnreadOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle dropdown open/close behavior
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle filter function with visual confirmation
  const handleFilterToggle = () => {
    setShowUnreadOnly(!showUnreadOnly);
  };

  return (
    <div className="cm-notif">
      <button
        className="cm-icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-expanded={isOpen}
        aria-label={t("notifications.title")}
        title={t("notifications.title")}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="cm-notif-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="cm-notif-panel">
          <div className="cm-notif-head">
            <div className="d-flex justify-content-between align-items-center">
              <h6>{t("notifications.title")}</h6>
              <button
                className="btn-close"
                onClick={() => setIsOpen(false)}
                aria-label={t("common.close")}
                style={{ fontSize: "0.7rem" }}
              ></button>
            </div>

            <div className="cm-notif-tools">
              <button
                className={`btn btn-sm ${showUnreadOnly ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={handleFilterToggle}
              >
                {showUnreadOnly
                  ? t("notifications.showAll")
                  : t("notifications.unreadOnly")}
              </button>

              <div className="d-flex gap-2">
                {unreadCount > 0 && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck size={12} className="me-1" />
                    {t("notifications.markAllRead")}
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={deleteAllNotifications}
                  >
                    <Trash2 size={12} className="me-1" />
                    {t("notifications.deleteAll")}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="cm-notif-list">
            {loading && notifications.length === 0 ? (
              <div className="cm-notif-empty">
                <span className="spinner-border spinner-border-sm me-2 text-primary"></span>
                {t("notifications.loading")}
              </div>
            ) : notifications.length === 0 ? (
              <div className="cm-notif-empty">
                <Bell size={28} className="mb-2 opacity-50" />
                <div>
                  {showUnreadOnly
                    ? t("notifications.emptyUnread")
                    : t("notifications.empty")}
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cm-notif-item${notification.read ? "" : " is-unread"}`}
                >
                  <div className="cm-notif-icon">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <h6
                        className={`cm-notif-title ${notification.read ? "fw-normal" : "fw-semibold"}`}
                      >
                        {notification.title}
                      </h6>

                      <div className="cm-notif-actions">
                        {!notification.read && (
                          <button
                            className="cm-notif-action"
                            onClick={() => markAsRead(notification.id)}
                            title={t("notifications.markRead")}
                            aria-label={t("notifications.markRead")}
                          >
                            <Check size={13} />
                          </button>
                        )}
                        <button
                          className="cm-notif-action is-danger"
                          onClick={() => deleteNotification(notification.id)}
                          title={t("common.delete")}
                          aria-label={t("common.delete")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="cm-notif-msg">{notification.message}</p>

                    <span className="cm-notif-time d-inline-flex align-items-center">
                      <Clock size={11} className="me-1" />
                      {notification.sentAt
                        ? formatRelative(notification.sentAt)
                        : t("common.unknownDate")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
