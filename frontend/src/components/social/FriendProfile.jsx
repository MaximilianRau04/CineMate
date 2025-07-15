import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserFriends, FaEye, FaHeart, FaStar, FaLock } from 'react-icons/fa';
import UserMediaTabs from '../profile/UserMediaTabs';

const FriendProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(storedUser);
    
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  /**
   * Load user data, points, friends, and check friendship status.
   */
  const loadUserData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUser(),
        loadUserPoints(),
        loadUserFriends(),
        checkFriendship()
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load user profile data from the API.
   * @returns {Promise<void>}
   */
  const loadUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Benutzer konnte nicht geladen werden');
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Load user points from the API.
   * @returns {Promise<void>}
   */
  const loadUserPoints = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/social/points/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const pointsData = await response.json();
        setUserPoints(pointsData);
      }
    } catch (error) {
      console.error('Error loading user points:', error);
    }
  };

  /**
   * Load user friends from the API.
   * @returns {Promise<void>}
   */
  const loadUserFriends = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/social/friends/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const friendsData = await response.json();
        setFriends(friendsData);
      }
    } catch (error) {
      console.error('Error loading user friends:', error);
    }
  };

  /**
   * Check if the current user is friends with the viewed profile user.
   */
  const checkFriendship = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/social/friends', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const myFriends = await response.json();
        const friendshipExists = myFriends.some(friend => friend.id === userId);
        setIsFriend(friendshipExists);
      }
    } catch (error) {
      console.error('Error checking friendship:', error);
    }
  };

  /**
   * Send a friend request to the user.
   */
  const sendFriendRequest = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/social/friends/request/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Freundschaftsanfrage gesendet!');
      } else {
        const error = await response.text();
        alert(`Fehler: ${error}`);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Fehler beim Senden der Freundschaftsanfrage');
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Lade Benutzerprofil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Benutzer nicht gefunden.
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;
  const canViewProfile = isOwnProfile || isFriend || user.profilePublic;

  const formattedDate = new Date(user.joinedAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          {/* Profile Header */}
          <div className="col-md-4 d-flex flex-column align-items-center justify-content-center bg-dark text-white p-4">
            <img
              src={
                user.avatarUrl
                  ? `http://localhost:8080${user.avatarUrl}`
                  : "https://via.placeholder.com/150?text=Kein+Bild"
              }
              alt={user.username}
              className="img-fluid rounded-circle shadow-sm mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <h3 className="mb-2">{user.username}</h3>
            
            {!isOwnProfile && !isFriend && user.allowFriendRequests && (
              <button 
                className="btn btn-primary mt-2"
                onClick={sendFriendRequest}
              >
                <FaUserFriends className="me-2" />
                Freundschaftsanfrage senden
              </button>
            )}
            
            {isFriend && (
              <span className="badge bg-success mt-2">
                <FaUserFriends className="me-1" />
                Freund
              </span>
            )}
          </div>

          {/* Profile Content */}
          <div className="col-md-8 p-4">
            <div className="row">
              <div className="col-12">
                <h2 className="mb-3">{user.username}</h2>
                
                {!canViewProfile ? (
                  <div className="text-center py-5">
                    <FaLock className="fs-1 text-muted mb-3" />
                    <h4>Privates Profil</h4>
                    <p className="text-muted">
                      Dieses Profil ist privat. Du musst mit {user.username} befreundet sein, um mehr zu sehen.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Bio */}
                    {user.bio && (
                      <div className="mb-3">
                        <label className="form-label mb-2">
                          <strong>Über mich:</strong>
                        </label>
                        <div className="bio-container p-3 bg-light rounded">
                          <p className="mb-0">{user.bio}</p>
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="row mb-4">
                      <div className="col-md-3 col-6">
                        <div className="card text-center">
                          <div className="card-body py-3">
                            <FaUserFriends className="fs-3 text-primary mb-2" />
                            <h5 className="mb-0">{friends.length}</h5>
                            <small className="text-muted">Freunde</small>
                          </div>
                        </div>
                      </div>
                      
                      {userPoints && (
                        <>
                          <div className="col-md-3 col-6">
                            <div className="card text-center">
                              <div className="card-body py-3">
                                <FaStar className="fs-3 text-warning mb-2" />
                                <h5 className="mb-0">{userPoints.totalPoints}</h5>
                                <small className="text-muted">Punkte</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-6">
                            <div className="card text-center">
                              <div className="card-body py-3">
                                <FaEye className="fs-3 text-info mb-2" />
                                <h5 className="mb-0">{userPoints.watchPoints}</h5>
                                <small className="text-muted">Gesehen</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-6">
                            <div className="card text-center">
                              <div className="card-body py-3">
                                <FaHeart className="fs-3 text-danger mb-2" />
                                <h5 className="mb-0">{userPoints.reviewPoints}</h5>
                                <small className="text-muted">Reviews</small>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-muted">
                      <strong>Beigetreten:</strong> {formattedDate}
                    </p>

                    {/* Media Content - Only for friends or public profiles */}
                    {(isFriend || user.profilePublic || isOwnProfile) && (
                      <div className="card shadow-lg border-0 mt-4">
                        <div className="card-header bg-white">
                          <h4 className="mb-0">{user.username}s Medien</h4>
                        </div>
                        <div
                          className="card-body"
                          style={{
                            maxHeight: "350px",
                            overflowY: "auto"
                          }}
                        >
                          <UserMediaTabs userId={userId} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Friends List */}
        {canViewProfile && friends.length > 0 && (
          <div className="card-footer">
            <h6 className="mb-3">Freunde ({friends.length})</h6>
            <div className="row">
              {friends.slice(0, 6).map(friend => (
                <div key={friend.id} className="col-md-2 col-4 mb-2">
                  <div className="text-center">
                    <img
                      src={friend.avatarUrl ? `http://localhost:8080${friend.avatarUrl}` : 'https://via.placeholder.com/60'}
                      alt={friend.username}
                      className="rounded-circle mb-1"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <small className="d-block text-truncate">{friend.username}</small>
                  </div>
                </div>
              ))}
              {friends.length > 6 && (
                <div className="col-md-2 col-4 mb-2">
                  <div className="text-center">
                    <div 
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-1"
                      style={{ width: '60px', height: '60px' }}
                    >
                      <span className="text-muted">+{friends.length - 6}</span>
                    </div>
                    <small className="d-block">weitere</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendProfile;
