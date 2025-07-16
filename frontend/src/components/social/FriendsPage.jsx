import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaUserPlus, FaCheck, FaTimes, FaSearch, FaTrash } from 'react-icons/fa';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load initial data for friends, pending requests, and all users.
   * @returns {Promise<void>}
   * @throws {Error} if the API requests fail
   */
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadFriends(),
        loadPendingRequests(),
        loadAllUsers()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load friends from the API.
   * @returns {Promise<void>}
   * @throws {Error} if the API request fails
   */
  const loadFriends = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/social/friends', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  /**
   * Load pending friend requests from the API.
   * @returns {Promise<void>}
   * @throws {Error} if the API request fails
   */
  const loadPendingRequests = async () => {
    try {
      console.log('Loading pending requests...');
      const response = await fetch('http://localhost:8080/api/social/friends/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Pending requests data:', data);
        setPendingRequests(data);
      } else {
        console.error('Failed to load pending requests:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  /**
   * Load all users from the API, excluding current user and existing friends.
   * @returns {Promise<void>}
   * @throws {Error} if the API request fails
   */
  const loadAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        // Filter out current user and existing friends
        const filteredUsers = data.filter(user =>
          user.id !== currentUser.id &&
          !friends.some(friend => friend.id === user.id)
        );
        setAllUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  /**
   * sends a friend request to the user.
   * @param {*} userId
   * @returns {Promise<void>}
   * @throws {Error} if the request fails or the user is already a friend 
   */
  const sendFriendRequest = async (userId) => {
    try {
      console.log('Sending friend request to user:', userId);
      const response = await fetch(`http://localhost:8080/api/social/friends/request/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Send friend request response status:', response.status);

      if (response.ok) {
        alert('Freundschaftsanfrage gesendet!');
        setAllUsers(prev => prev.filter(user => user.id !== userId));
        loadData();
      } else {
        const error = await response.text();
        console.error('Failed to send friend request:', error);
        alert(`Fehler: ${error}`);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Fehler beim Senden der Freundschaftsanfrage');
    }
  };

  /**
   * accepts a friend request.
   * @param {*} friendshipId
   * @returns {Promise<void>}
   * @throws {Error} if the request fails or the friendship ID is invalid 
   */
  const acceptFriendRequest = async (friendshipId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/social/friends/accept/${friendshipId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Freundschaftsanfrage akzeptiert!');
        loadData();
      } else {
        const error = await response.text();
        alert(`Fehler: ${error}`);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  /**
   * declines a friend request.
   * @param {*} friendshipId
   * @returns {Promise<void>}
   * @throws {Error} if the request fails or the friendship ID is invalid 
   */
  const declineFriendRequest = async (friendshipId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/social/friends/decline/${friendshipId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Freundschaftsanfrage abgelehnt');
        loadPendingRequests();
      } else {
        const error = await response.text();
        alert(`Fehler: ${error}`);
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  /**
   * removes a friend.
   * @param {*} friendId 
   * @returns {Promise<void>}
   * @throws {Error} if the request fails or the user confirms removal  
   */
  const removeFriend = async (friendId) => {
    if (!window.confirm('Möchtest du diesen Freund wirklich entfernen?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/social/friends/${friendId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Freund entfernt');
        loadFriends();
      } else {
        const error = await response.text();
        alert(`Fehler: ${error}`);
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  /**
   * handles search input changes.
   * @param {*} query
   * @returns {void}
   * @throws {Error} if the search query is invalid or less than 3 characters 
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const filtered = allUsers.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchUsers(filtered);
    } else {
      setSearchUsers([]);
    }
  };

  /**
   * Renders a profile image with fallback to default avatar
   * @param {string} avatarUrl - The user's avatar URL
   * @param {string} username - The user's username
   * @param {number} size - The size of the avatar (default: 50)
   * @returns {JSX.Element} Profile image element
   */
  const renderProfileImage = (avatarUrl, username, size = 50) => {
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

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Lade Freunde...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">
            <FaUserFriends className="me-2" />
            Freunde verwalten
          </h1>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                Meine Freunde ({friends.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                Anfragen ({pendingRequests.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => setActiveTab('search')}
              >
                Neue Freunde finden
              </button>
            </li>
          </ul>

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="card">
              <div className="card-header">
                <h5>Meine Freunde</h5>
              </div>
              <div className="card-body">
                {friends.length === 0 ? (
                  <p className="text-muted">Du hast noch keine Freunde. Nutze die Suche, um neue Freunde zu finden!</p>
                ) : (
                  <div className="row">
                    {friends.map(friend => (
                      <div key={friend.id} className="col-md-6 col-lg-4 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <div className="me-3">
                                {renderProfileImage(friend.avatarUrl, friend.username, 50)}
                              </div>
                              <div>
                                <h6 className="mb-0">{friend.username}</h6>
                                <small className="text-muted">{friend.email}</small>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <Link
                                to={`/profile/${friend.id}`}
                                className="btn btn-light mt-2 fw-bold"
                                style={{ color: '#0d6efd', borderColor: '#0d6efd' }}
                              >
                                Profil ansehen
                              </Link>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeFriend(friend.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pending Requests Tab */}
          {activeTab === 'requests' && (
            <div className="card">
              <div className="card-header">
                <h5>Freundschaftsanfragen</h5>
              </div>
              <div className="card-body">
                {pendingRequests.length === 0 ? (
                  <p className="text-muted">Keine offenen Freundschaftsanfragen.</p>
                ) : (
                  <div className="list-group">
                    {pendingRequests.map(request => (
                      <div key={request.id} className="list-group-item">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              {renderProfileImage(request.requester.avatarUrl, request.requester.username, 40)}
                            </div>
                            <div>
                              <h6 className="mb-0">{request.requester.username}</h6>
                              <small className="text-muted">
                                {new Date(request.requestedAt).toLocaleDateString('de-DE')}
                              </small>
                            </div>
                          </div>
                          <div>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => acceptFriendRequest(request.id)}
                            >
                              <FaCheck /> Akzeptieren
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => declineFriendRequest(request.id)}
                            >
                              <FaTimes /> Ablehnen
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="card">
              <div className="card-header">
                <h5>Neue Freunde finden</h5>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Benutzername oder E-Mail suchen..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>

                {searchQuery.length > 2 && (
                  <div>
                    {searchUsers.length === 0 ? (
                      <p className="text-muted">Keine Benutzer gefunden.</p>
                    ) : (
                      <div className="row">
                        {searchUsers.map(user => (
                          <div key={user.id} className="col-md-6 col-lg-4 mb-3">
                            <div className="card h-100">
                              <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                  <div className="me-3">
                                    {renderProfileImage(user.avatarUrl, user.username, 50)}
                                  </div>
                                  <div>
                                    <h6 className="mb-0">{user.username}</h6>
                                    <small className="text-muted">{user.email}</small>
                                  </div>
                                </div>
                                <div className="d-flex gap-2">
                                  <Link
                                    to={`/profile/${user.id}`}
                                    className="btn btn-light mt-2 fw-bold"
                                    style={{ color: '#0d6efd', borderColor: '#0d6efd' }}
                                  >
                                    Profil ansehen
                                  </Link>
                                  <button
                                    className="btn btn-primary btn-sm px-3 py-1 d-flex align-items-center"
                                    onClick={() => sendFriendRequest(user.id)}
                                  >
                                    <FaUserPlus className="me-1" style={{ fontSize: "0.85rem" }} />
                                    <span style={{ fontSize: "0.85rem" }}>Anfrage senden</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
