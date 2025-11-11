import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

const UserAchievementBadges = ({ userId, limit = 3, showCount = true }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetch user achievements from the API.
     * @returns {Promise<void>}
     */
    const getHeaders = () => {
      const token = localStorage.getItem('token');
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    const loadUserAchievements = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/achievements/user/${userId}/unlocked`, {
          headers: getHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          const sortedAchievements = data
            .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
            .slice(0, limit);
          setAchievements(sortedAchievements);
        }
      } catch (error) {
        console.error('Error loading user achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserAchievements();
    }
  }, [userId, limit]);

  /**
   * Get the badge icon for a specific achievement.
   * @param {*} type 
   * @returns {JSX.Element} The icon component for the achievement type.
   */
  const getBadgeIcon = (type) => {
    switch (type) {
      case 'REVIEWS':
        return <FaStar className="achievement-mini-icon" />;
      case 'MOVIES_WATCHED':
      case 'SERIES_WATCHED':
        return <FaTrophy className="achievement-mini-icon" />;
      case 'FORUM_POSTS':
      case 'FRIENDS':
        return <FaMedal className="achievement-mini-icon" />;
      default:
        return <FaTrophy className="achievement-mini-icon" />;
    }
  };

  /**
   * Get the badge class for a specific badge color.
   * @param {*} badgeColor 
   * @returns {string} The CSS class for the badge color.
   */
  const getBadgeClass = (badgeColor) => {
    switch (badgeColor) {
      case 'badge-warning':
        return 'bg-warning text-dark';
      case 'badge-primary':
        return 'bg-primary text-white';
      case 'badge-info':
        return 'bg-info text-white';
      case 'badge-success':
        return 'bg-success text-white';
      case 'badge-danger':
        return 'bg-danger text-white';
      case 'badge-gold':
        return 'bg-warning text-dark border-warning';
      default:
        return 'bg-secondary text-white';
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <div className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <small className="text-muted">Lade Achievements...</small>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="text-muted">
        <small>Noch keine Achievements freigeschaltet</small>
      </div>
    );
  }

  return (
    <div className="user-achievement-badges">
      <div className="d-flex align-items-center flex-wrap gap-2">
        {achievements.map((userAchievement) => (
          <div
            key={userAchievement.id}
            className={`achievement-mini-badge ${getBadgeClass(userAchievement.achievement.badgeColor)}`}
            title={`${userAchievement.achievement.title} - ${userAchievement.achievement.description}`}
            data-bs-toggle="tooltip"
          >
            {getBadgeIcon(userAchievement.achievement.type)}
          </div>
        ))}
        
        {showCount && achievements.length >= limit && (
          <small className="text-muted ms-2">
            und weitere...
          </small>
        )}
      </div>
      
      {showCount && (
        <small className="text-muted d-block mt-1">
          {achievements.length} Achievement{achievements.length !== 1 ? 's' : ''} freigeschaltet
        </small>
      )}
      
      <style jsx>{`
        .achievement-mini-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 0.8rem;
          cursor: help;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .achievement-mini-badge:hover {
          transform: scale(1.1);
        }
        
        .achievement-mini-icon {
          font-size: 0.8rem;
        }
        
        .user-achievement-badges {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default UserAchievementBadges;
