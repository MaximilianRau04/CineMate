import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Clock} from 'lucide-react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const API_BASE = "http://localhost:8080/api/notifications";

  /**
   * Fetches the current user from localStorage and sets userId and currentUser state.
   * @returns {void}
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(`HTTP Error: ${res.status}`))
      .then((data) => {
        if (data?.id) {
          setUserId(data.id);
        }
      })
      .catch((err) => console.error("Fehler beim Laden des Users:", err));
  }, []);

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

      const endpoint = showUnreadOnly
        ? `${API_BASE}/user/${userId}/unread`
        : `${API_BASE}/user/${userId}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();

      const processedData = data.map(notification => ({
        ...notification,
        createdAt: notification.createdAt || new Date().toISOString(),
        readAt: notification.readAt || null
      }));

      setNotifications(processedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
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
      await fetch(`${API_BASE}/${notificationId}/read`, {
        method: 'PUT'
      });

      if (showUnreadOnly) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      } else {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId
              ? { ...notif, read: true, readAt: new Date().toISOString() }
              : notif
          )
        );
      }

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  /**
   * Marks all notifications as read.
   * @returns {Promise<void>}
   * @throws {Error} If the fetch request fails.
   */
  const markAllAsRead = async () => {
    try {
      await fetch(`${API_BASE}/user/${userId}/read-all`, {
        method: 'PUT'
      });

      if (showUnreadOnly) {
        setNotifications([]);
      } else {
        setNotifications(prev =>
          prev.map(notif => ({
            ...notif,
            read: true,
            readAt: new Date().toISOString()
          }))
        );
      }

      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;

    try {
      const countResponse = await fetch(`${API_BASE}/user/${userId}/unread/count`);
      if (!countResponse.ok) {
        throw new Error(`HTTP Error: ${countResponse.status}`);
      }
      const countData = await countResponse.json();
      setUnreadCount(countData.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  /**
   * Deletes all notifications for the current user.
   * @returns {Promise<void>}
   */
  const deleteAllNotifications = async () => {

    try {
      await fetch(`${API_BASE}/user/${userId}/delete-all`, {
        method: 'DELETE'
      });

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  /**
   * Deletes a notification.
   * @param {number} notificationId - The ID of the notification to delete.
   * @returns {Promise<void>}
   */
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`${API_BASE}/${notificationId}`, {
        method: 'DELETE'
      });

      const deletedNotif = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));

      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  /**
 * Formats a date string into a more readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
  const formatDate = (dateString) => {
    if (!dateString) return 'Datum unbekannt';

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Datum unbekannt';
      }

      const now = new Date();
      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) {
        return 'Gerade eben';
      } else if (diffInMinutes < 60) {
        return `vor ${diffInMinutes} Min.`;
      } else if (diffInHours < 24) {
        return `vor ${diffInHours} Std.`;
      } else if (diffInDays === 1) {
        return 'Gestern';
      } else if (diffInDays < 7) {
        return `vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `vor ${weeks} Woche${weeks > 1 ? 'n' : ''}`;
      } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `vor ${months} Monat${months > 1 ? 'en' : ''}`;
      } else {
        return date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Datum unbekannt';
    }
  };

  /**
   * Gets the notification style based on the type.
   * @param {string} type - The type of the notification.
   * @returns {Object} The style object containing icon and color.
   */
  const getNotificationStyle = (type) => {
    const styles = {
      NEW_MOVIE: { icon: '🎬', color: '#667eea' },
      REMINDER: { icon: '⏰', color: '#f093fb' },
      FRIEND_REQUEST: { icon: '👥', color: '#4facfe' },
      SYSTEM: { icon: '⚙️', color: '#a8edea' },
      PROMOTION: { icon: '🎁', color: '#d299c2' }
    };
    return styles[type] || { icon: '📢', color: '#667eea' };
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
    <div className="notification-dropdown position-relative">
      {/* Notification Bell Button */}
      <button
        className="btn position-relative me-2"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        style={{
          border: 'none',
          background: 'transparent',
          color: '#ffd700',
          borderRadius: '50%',
          padding: '8px',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 0 transparent'
        }}
        onMouseEnter={(e) => {
          e.target.style.color = '#ffed4e';
          e.target.style.transform = 'translateY(-2px) scale(1.05)';
          e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = '#ffd700';
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 0 0 transparent';
        }}
      >
        <Bell size={25} fill="currentColor" />
        {unreadCount > 0 && (
          <span
            className="position-absolute badge rounded-pill"
            style={{
              top: '-2px',
              right: '-6px',
              fontSize: '0.6rem',
              background: 'linear-gradient(135deg, rgb(255, 80, 80), rgb(255, 120, 120))',
              border: '2px solid white',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
              lineHeight: 1
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="position-absolute border shadow-lg"
          style={{
            width: '380px',
            maxHeight: '480px',
            zIndex: 1050,
            right: 0,
            top: '100%',
            marginTop: '12px',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
        >

          {/* Header */}
          <div className="p-3 border-bottom" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderBottom: 'none'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold" style={{ color: 'white', fontSize: '1rem' }}>
                Benachrichtigungen
              </h6>
              <button
                className="btn-close btn-close-white"
                onClick={() => setIsOpen(false)}
                style={{
                  fontSize: '0.8rem',
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.8
                }}
              ></button>
            </div>

            {/* Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <button
                  className={`btn btn-sm ${showUnreadOnly ? 'btn-light' : 'btn-outline-light'}`}
                  onClick={handleFilterToggle}
                  style={{
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    border: showUnreadOnly ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    background: showUnreadOnly ? 'white' : 'transparent',
                    color: showUnreadOnly ? '#667eea' : 'white',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {showUnreadOnly ? 'Alle anzeigen' : 'Nur ungelesene'}
                </button>
              </div>

              <div className="d-flex gap-2">
                {unreadCount > 0 && (
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={markAllAsRead}
                    style={{
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    <CheckCheck size={12} className="me-1" />
                    Alle lesen
                  </button>
                )}
                
                {notifications.length > 0 && (
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={deleteAllNotifications}
                    style={{
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      border: '1px solid rgba(255, 182, 193, 0.5)',
                      color: 'white',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 99, 132, 0.2)';
                      e.target.style.borderColor = 'rgba(255, 99, 132, 0.7)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.borderColor = 'rgba(255, 182, 193, 0.5)';
                    }}
                  >
                    <Trash2 size={12} className="me-1" />
                    Alle löschen
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {loading ? (
              <div className="p-4 text-center text-muted">
                <div className="spinner-border spinner-border-sm me-2" style={{ color: '#667eea' }}></div>
                <span style={{ color: '#6c757d' }}>Lade Benachrichtigungen...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <Bell size={32} style={{ color: '#dee2e6', marginBottom: '8px' }} />
                <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                  {showUnreadOnly ? 'Keine ungelesenen Benachrichtigungen' : 'Keine Benachrichtigungen'}
                </div>
              </div>
            ) : (
              notifications.map((notification) => {
                const style = getNotificationStyle(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-3 border-bottom position-relative`}
                    style={{
                      borderColor: '#f1f3f4',
                      background: !notification.read ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.02) 0%, rgba(255, 255, 255, 1) 100%)' : 'white',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = !notification.read ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.02) 0%, rgba(255, 255, 255, 1) 100%)' : 'white';
                    }}
                  >
                    <div className="d-flex">
                      {/* Icon */}
                      <div className="me-3 d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '1.1rem'
                          }}
                        >
                          {style.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className={`mb-0 ${!notification.read ? 'fw-bold' : 'fw-normal'}`}
                            style={{
                              color: '#2d3748',
                              fontSize: '0.9rem',
                              lineHeight: '1.3'
                            }}>
                            {notification.title}
                          </h6>

                          {/* Actions */}
                          <div className="d-flex ms-2">
                            {!notification.read && (
                              <button
                                className="btn btn-sm me-1"
                                onClick={() => markAsRead(notification.id)}
                                title="Als gelesen markieren"
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  background: 'white',
                                  color: '#667eea',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = '#48bb78';
                                  e.target.style.color = 'white';
                                  e.target.style.borderColor = '#48bb78';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'white';
                                  e.target.style.color = '#667eea';
                                  e.target.style.borderColor = '#e2e8f0';
                                }}
                              >
                                <Check size={12} />
                              </button>
                            )}
                            <button
                              className="btn btn-sm"
                              onClick={() => deleteNotification(notification.id)}
                              title="Löschen"
                              style={{
                                fontSize: '0.7rem',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #fed7d7',
                                background: 'white',
                                color: '#e53e3e',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#e53e3e';
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'white';
                                e.target.style.color = '#e53e3e';
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        <p className="mb-2 small" style={{
                          color: '#718096',
                          fontSize: '0.8rem',
                          lineHeight: '1.4'
                        }}>
                          {notification.message}
                        </p>

                        {/* Footer */}
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="d-flex align-items-center" style={{ color: '#a0aec0', fontSize: '0.75rem' }}>
                            <Clock size={12} className="me-1" />
                            {formatDate(notification.sentAt)}
                          </small>

                          {!notification.read && (
                            <span
                              className="badge rounded-pill"
                              style={{
                                fontSize: '0.6rem',
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                color: 'white',
                                padding: '4px 8px'
                              }}
                            >
                              Neu
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;