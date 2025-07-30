import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaStar, FaLock, FaUnlock } from 'react-icons/fa';
import '../../assets/achievements.css';

const AchievementsPage = ({ userId }) => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unlocked');

  /**
   * Fetch user achievements and stats from the API.
   */
  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadUserAchievements(),
          loadAchievementStats()
        ]);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    /**
     * Fetch user achievements from the API.
     */
    const loadUserAchievements = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/achievements/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserAchievements(data);
        }
      } catch (error) {
        console.error('Error loading user achievements:', error);
      }
    };

    /**
     * Fetch user achievement stats from the API.
     */
    const loadAchievementStats = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/achievements/user/${userId}/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading achievement stats:', error);
      }
    };

    if (userId) {
      loadAchievements();
    }
  }, [userId]);

  /**
   * Get the badge icon for a specific achievement.
   * @param {*} achievement 
   * @returns {JSX.Element} The icon component for the achievement type.
   */
  const getBadgeIcon = (achievement) => {
    switch (achievement.type) {
      case 'REVIEWS':
        return <FaStar className="achievement-icon" />;
      case 'MOVIES_WATCHED':
      case 'SERIES_WATCHED':
        return <FaTrophy className="achievement-icon" />;
      case 'FORUM_POSTS':
      case 'FRIENDS':
        return <FaMedal className="achievement-icon" />;
      default:
        return <FaTrophy className="achievement-icon" />;
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
        return 'achievement-badge-warning';
      case 'badge-primary':
        return 'achievement-badge-primary';
      case 'badge-info':
        return 'achievement-badge-info';
      case 'badge-success':
        return 'achievement-badge-success';
      case 'badge-danger':
        return 'achievement-badge-danger';
      case 'badge-gold':
        return 'achievement-badge-gold';
      default:
        return 'achievement-badge-secondary';
    }
  };

  const getUnlockedAchievements = () => {
    return userAchievements.filter(ua => ua.unlocked);
  };

  const getInProgressAchievements = () => {
    return userAchievements.filter(ua => !ua.unlocked);
  };

  const renderAchievementCard = (userAchievement, isUnlocked = true) => {
    const achievement = userAchievement.achievement;
    const progressPercentage = userAchievement.progressPercentage || 0;

    return (
      <div key={userAchievement.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
        <div className={`achievement-badge ${getBadgeClass(achievement.badgeColor)}`}>
          {isUnlocked ? <FaUnlock className="unlock-icon" /> : <FaLock className="lock-icon" />}
          {getBadgeIcon(achievement)}
        </div>
        
        <div className="achievement-content">
          <h5 className="achievement-title">{achievement.title}</h5>
          <p className="achievement-description">{achievement.description}</p>
          
          {!isUnlocked && (
            <div className="progress-container">
              <div className="progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <small className="progress-text">
                {userAchievement.progress} / {achievement.threshold} ({progressPercentage.toFixed(1)}%)
              </small>
            </div>
          )}
          
          <div className="achievement-footer">
            <span className="achievement-points">
              <FaTrophy className="me-1" />
              {achievement.points} Punkte
            </span>
            {isUnlocked && userAchievement.unlockedAt && (
              <small className="text-muted">
                Freigeschaltet: {new Date(userAchievement.unlockedAt).toLocaleDateString('de-DE')}
              </small>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Achievements werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="achievements-title">
              <FaTrophy className="me-3" />
              Meine Achievements
            </h1>
            {stats && (
              <div className="achievement-stats">
                <div className="row">
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{stats.unlockedAchievements}</h3>
                      <p>Freigeschaltet</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{stats.totalAchievements}</h3>
                      <p>Gesamt verfügbar</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{stats.progressPercentage.toFixed(1)}%</h3>
                      <p>Fortschritt</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs achievement-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'unlocked' ? 'active' : ''}`}
                  onClick={() => setActiveTab('unlocked')}
                >
                  <FaUnlock className="me-2" />
                  Freigeschaltet ({getUnlockedAchievements().length})
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
                  onClick={() => setActiveTab('progress')}
                >
                  <FaLock className="me-2" />
                  In Bearbeitung ({getInProgressAchievements().length})
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="row">
          <div className="col-12">
            <div className="achievements-grid">
              {activeTab === 'unlocked' ? (
                getUnlockedAchievements().length > 0 ? (
                  getUnlockedAchievements().map(ua => renderAchievementCard(ua, true))
                ) : (
                  <div className="text-center py-5">
                    <FaTrophy className="text-muted display-1 mb-3" />
                    <h4>Noch keine Achievements freigeschaltet</h4>
                    <p className="text-muted">Schaue Filme, schreibe Reviews und sammle Freunde, um deine ersten Achievements zu bekommen!</p>
                  </div>
                )
              ) : (
                getInProgressAchievements().length > 0 ? (
                  getInProgressAchievements().map(ua => renderAchievementCard(ua, false))
                ) : (
                  <div className="text-center py-5">
                    <FaMedal className="text-muted display-1 mb-3" />
                    <h4>Alle Achievements freigeschaltet!</h4>
                    <p className="text-muted">Du hast alle verfügbaren Achievements erreicht. Glückwunsch!</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
