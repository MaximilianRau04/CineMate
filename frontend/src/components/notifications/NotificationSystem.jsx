import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Clock, Mail, Globe } from 'lucide-react';

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

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const endpoint = showUnreadOnly 
        ? `${API_BASE}/user/${userId}/unread`
        : `${API_BASE}/user/${userId}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setNotifications(data);
      
      const countResponse = await fetch(`${API_BASE}/user/${userId}/unread/count`);
      const countData = await countResponse.json();
      setUnreadCount(countData.count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${API_BASE}/${notificationId}/read`, {
        method: 'PUT'
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch(`${API_BASE}/user/${userId}/read-all`, {
        method: 'PUT'
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          read: true, 
          readAt: new Date().toISOString() 
        }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Gerade eben';
    } else if (diffInHours < 24) {
      return `vor ${Math.floor(diffInHours)} Std.`;
    } else {
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  // Get notification type icon and color
  const getNotificationStyle = (type) => {
    const styles = {
      NEW_MOVIE: { icon: '🎬', color: 'bg-blue-500' },
      REMINDER: { icon: '⏰', color: 'bg-yellow-500' },
      FRIEND_REQUEST: { icon: '👥', color: 'bg-green-500' },
      SYSTEM: { icon: '⚙️', color: 'bg-gray-500' },
      PROMOTION: { icon: '🎁', color: 'bg-purple-500' }
    };
    return styles[type] || { icon: '📢', color: 'bg-blue-500' };
  };

  useEffect(() => {
    fetchNotifications();
  }, [showUnreadOnly]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notification-dropdown position-relative">
      {/* Notification Bell Button */}
      <button
        className="btn btn-outline-light position-relative me-2"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        style={{ border: 'none' }}
      >
        🔔
        {unreadCount > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.6rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div 
          className="position-absolute bg-white border rounded shadow-lg" 
          style={{ 
            width: '400px', 
            maxHeight: '500px', 
            zIndex: 1050,
            right: 0,
            top: '100%',
            marginTop: '8px'
          }}
        >
          
          {/* Header */}
          <div className="p-3 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 text-dark fw-bold">Benachrichtigungen</h6>
              <button
                className="btn-close"
                onClick={() => setIsOpen(false)}
                style={{ fontSize: '0.8rem' }}
              ></button>
            </div>
            
            {/* Controls */}
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div>
                <button
                  className={`btn btn-sm me-2 ${showUnreadOnly ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                >
                  {showUnreadOnly ? 'Alle anzeigen' : 'Nur ungelesene'}
                </button>
              </div>
              
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={markAllAsRead}
                >
                  ✓✓ Alle lesen
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <div className="p-4 text-center text-muted">
                <div className="spinner-border spinner-border-sm me-2"></div>
                Lade Benachrichtigungen...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">
                {showUnreadOnly ? 'Keine ungelesenen Benachrichtigungen' : 'Keine Benachrichtigungen'}
              </div>
            ) : (
              notifications.map((notification) => {
                const style = getNotificationStyle(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                    style={{ borderColor: '#dee2e6 !important' }}
                  >
                    <div className="d-flex">
                      {/* Icon */}
                      <div className="me-3">
                        <span className="fs-4">
                          {style.icon}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className={`mb-1 ${!notification.read ? 'fw-bold' : ''} text-dark`}>
                            {notification.title}
                          </h6>
                          
                          {/* Actions */}
                          <div className="d-flex">
                            {!notification.read && (
                              <button
                                className="btn btn-sm btn-outline-success me-1"
                                onClick={() => markAsRead(notification.id)}
                                title="Als gelesen markieren"
                                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                              >
                                ✓
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteNotification(notification.id)}
                              title="Löschen"
                              style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        <p className="mb-2 text-muted small">
                          {notification.message}
                        </p>
                        
                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="mb-2">
                            {notification.metadata.genre && (
                              <span className="badge bg-secondary me-1" style={{ fontSize: '0.6rem' }}>
                                {notification.metadata.genre}
                              </span>
                            )}
                            {notification.metadata.releaseYear && (
                              <span className="badge bg-info me-1" style={{ fontSize: '0.6rem' }}>
                                {notification.metadata.releaseYear}
                              </span>
                            )}
                            {notification.metadata.cinema && (
                              <span className="badge bg-warning text-dark me-1" style={{ fontSize: '0.6rem' }}>
                                {notification.metadata.cinema}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Footer */}
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            🕐 {formatDate(notification.createdAt)}
                          </small>
                          
                          {!notification.read && (
                            <span className="badge bg-primary" style={{ fontSize: '0.6rem' }}>
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