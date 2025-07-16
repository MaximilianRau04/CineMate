import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaMedal, FaAward, FaStar, FaEye, FaHeart } from 'react-icons/fa';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myPoints, setMyPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Renders a profile image with fallback to default avatar
   * @param {string} avatarUrl - The user's avatar URL
   * @param {string} username - The user's username
   * @param {number} size - The size of the avatar (default: 40)
   * @returns {JSX.Element} Profile image element
   */
  const renderProfileImage = (avatarUrl, username, size = 40) => {
    if (avatarUrl) {
      return (
        <img 
          src={`http://localhost:8080${avatarUrl}`}
          alt={username}
          className="rounded-circle"
          style={{ width: `${size}px`, height: `${size}px`, objectFit: 'cover' }}
        />
      );
    } else {
      return (
        <div
          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <i className="bi bi-person-fill text-white" style={{ fontSize: `${size * 0.6}px` }}></i>
        </div>
      );
    }
  };

  /**
   * Loads the leaderboard and user's points data.
   */
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadLeaderboard(),
        loadMyPoints()
      ]);
    } catch (error) {
      console.error('Error loading leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads the leaderboard data from the API.
   */
  const loadLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/social/leaderboard?limit=20', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        setLeaderboard(data);
      } else {
        console.error('Failed to load leaderboard:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  /**
   * Loads the user's points data from the API.
   */
  const loadMyPoints = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/social/points', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyPoints(data);
      }
    } catch (error) {
      console.error('Error loading my points:', error);
    }
  };

  /**
   * Returns the appropriate icon for the user's rank.
   * @param {number} rank - The user's rank.
   * @returns {JSX.Element} The icon element.
   */
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaTrophy className="text-warning" />;
      case 2: return <FaMedal className="text-secondary" />;
      case 3: return <FaAward className="text-warning" style={{ color: '#CD7F32' }} />;
      default: return <span className="fw-bold text-muted">#{rank}</span>;
    }
  };

  /**
   * returns the appropriate CSS class for the user's rank.
   * @param {*} rank 
   * @returns {string} The CSS class for the rank. 
   */
  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient bg-warning text-dark';
      case 2: return 'bg-gradient bg-secondary text-white';
      case 3: return 'bg-gradient text-white';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Lade Rangliste...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">
            <FaTrophy className="me-2 text-warning" />
            Rangliste
          </h1>

          {/* My Points Card */}
          {myPoints && (
            <div className="card mb-4 bg-primary text-white">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 className="card-title">Deine Punkte</h5>
                    <div className="row">
                      <div className="col-sm-3">
                        <div className="text-center">
                          <h3 className="mb-0">{myPoints.totalPoints}</h3>
                          <small>Gesamt</small>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="text-center">
                          <h4 className="mb-0 text-warning">
                            <FaStar className="me-1" />
                            {myPoints.reviewPoints}
                          </h4>
                          <small>Bewertungen</small>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="text-center">
                          <h4 className="mb-0 text-info">
                            <FaEye className="me-1" />
                            {myPoints.watchPoints}
                          </h4>
                          <small>Gesehen</small>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="text-center">
                          <h4 className="mb-0 text-success">
                            <FaHeart className="me-1" />
                            {myPoints.socialPoints}
                          </h4>
                          <small>Sozial</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="bg-white bg-opacity-25 rounded p-3">
                      <h6 className="mb-2">Dein Rang</h6>
                      <h2 className="mb-0">
                        {leaderboard.findIndex(entry => 
                          entry.userId === JSON.parse(localStorage.getItem('user') || '{}').id
                        ) + 1 || 'Unranked'}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Top CineMate Nutzer</h5>
            </div>
            <div className="card-body">
              {leaderboard.length === 0 ? (
                <p className="text-muted text-center">Keine Daten verfügbar.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th width="80">Rang</th>
                        <th>Benutzer</th>
                        <th className="text-center">Gesamt</th>
                        <th className="text-center">
                          <FaStar className="text-warning" title="Bewertungspunkte" />
                        </th>
                        <th className="text-center">
                          <FaEye className="text-info" title="Gesehen-Punkte" />
                        </th>
                        <th className="text-center">
                          <FaHeart className="text-success" title="Soziale Punkte" />
                        </th>
                        <th className="text-center">
                          <FaAward className="text-primary" title="Achievement-Punkte" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => {
                        const rank = index + 1;
                        const isCurrentUser = entry.userId === JSON.parse(localStorage.getItem('user') || '{}').id;
                        
                        return (
                          <tr 
                            key={entry.id} 
                            className={`${getRankClass(rank)} ${isCurrentUser ? 'table-info' : ''}`}
                            style={{ 
                              background: rank <= 3 ? '' : (isCurrentUser ? 'rgba(13, 202, 240, 0.1)' : ''),
                              fontWeight: isCurrentUser ? 'bold' : 'normal'
                            }}
                          >
                            <td className="text-center">
                              {getRankIcon(rank)}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {isCurrentUser ? (
                                  <div className="me-3">
                                    {renderProfileImage(entry.avatarUrl, entry.username, 40)}
                                  </div>
                                ) : (
                                  <Link to={`/profile/${entry.userId}`} title="Profil ansehen" className="me-3">
                                    <div style={{ 
                                      cursor: 'pointer',
                                      transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                      {renderProfileImage(entry.avatarUrl, entry.username, 40)}
                                    </div>
                                  </Link>
                                )}
                                <div>
                                  <div className="fw-bold">
                                    {isCurrentUser ? (
                                      <>
                                        {entry.username}
                                        <span className="badge bg-info ms-2">Du</span>
                                      </>
                                    ) : (
                                      <Link 
                                        to={`/profile/${entry.userId}`}
                                        className="text-decoration-none fw-bold"
                                        style={{ color: 'inherit' }}
                                        title="Profil ansehen"
                                      >
                                        {entry.username}
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <span className="fs-5 fw-bold">{entry.totalPoints}</span>
                            </td>
                            <td className="text-center">{entry.reviewPoints}</td>
                            <td className="text-center">{entry.watchPoints}</td>
                            <td className="text-center">{entry.socialPoints}</td>
                            <td className="text-center">{entry.achievementPoints}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Points System Info */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">Punktesystem</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="text-center p-3 border rounded">
                    <FaStar className="fs-3 text-warning mb-2" />
                    <h6>Bewertungen</h6>
                    <p className="small text-muted mb-0">10 Punkte pro Review</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 border rounded">
                    <FaEye className="fs-3 text-info mb-2" />
                    <h6>Gesehen markieren</h6>
                    <p className="small text-muted mb-0">5 Punkte pro Film/Serie</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 border rounded">
                    <FaHeart className="fs-3 text-success mb-2" />
                    <h6>Soziale Interaktionen</h6>
                    <p className="small text-muted mb-0">15 Punkte pro Freundschaft</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 border rounded">
                    <FaAward className="fs-3 text-primary mb-2" />
                    <h6>Achievements</h6>
                    <p className="small text-muted mb-0">25 Punkte pro Meilenstein</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
