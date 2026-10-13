import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUserFriends,
  FaUserPlus,
  FaCheck,
  FaTimes,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useToast } from "../toasts";
import api from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { LoadingSpinner } from "../explore/FilterPanel";
import { useTranslation } from "../../i18n/I18nContext";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const { success, error: showError } = useToast();
  const { t, formatDate } = useTranslation();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load initial data for friends, pending requests, and all users.
   * @returns {Promise<void>}
   * @throws {Error} if the API requests fail
   */
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadFriends(), loadPendingRequests(), loadAllUsers()]);
    } catch (error) {
      console.error("Error loading data:", error);
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
      const { data } = await api.get("/social/friends");
      setFriends(data);
    } catch (error) {
      console.error("Error loading friends:", error);
      showError(t("social.loadFriendsError"));
    }
  };

  /**
   * Load pending friend requests from the API.
   * @returns {Promise<void>}
   * @throws {Error} if the API request fails
   */
  const loadPendingRequests = async () => {
    try {
      const { data } = await api.get("/social/friends/requests");
      setPendingRequests(data);
    } catch (error) {
      console.error("Error loading pending requests:", error);
      showError(t("social.loadRequestsError"));
    }
  };

  /**
   * Load all users from the API, excluding current user and existing friends.
   * @returns {Promise<void>}
   * @throws {Error} if the API request fails
   */
  const loadAllUsers = async () => {
    try {
      const { data } = await api.get("/users");
      // Filter out current user and existing friends
      const filteredUsers = data.filter(
        (user) =>
          user.id !== currentUser?.id &&
          !friends.some((friend) => friend.id === user.id),
      );
      setAllUsers(filteredUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      showError(t("social.loadUsersError"));
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
      await api.post(`/social/friends/request/${userId}`);
      success(t("social.requestSent"));
      setAllUsers((prev) => prev.filter((user) => user.id !== userId));
      loadData();
    } catch (error) {
      console.error("Error sending friend request:", error);
      showError(
        error.response?.data
          ? t("social.errorDetail", { message: error.response.data })
          : t("social.requestSendError"),
      );
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
      await api.post(`/social/friends/accept/${friendshipId}`);
      success(t("social.requestAccepted"));
      loadData();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      showError(
        error.response?.data
          ? t("social.errorDetail", { message: error.response.data })
          : t("social.requestAcceptError"),
      );
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
      await api.post(`/social/friends/decline/${friendshipId}`);
      success(t("social.requestDeclined"));
      loadPendingRequests();
    } catch (error) {
      console.error("Error declining friend request:", error);
      showError(
        error.response?.data
          ? t("social.errorDetail", { message: error.response.data })
          : t("social.requestDeclineError"),
      );
    }
  };

  /**
   * removes a friend.
   * @param {*} friendId
   * @returns {Promise<void>}
   * @throws {Error} if the request fails or the user confirms removal
   */
  const removeFriend = async (friendId) => {
    if (!window.confirm(t("social.confirmRemove"))) {
      return;
    }

    try {
      await api.delete(`/social/friends/${friendId}`);
      success(t("social.friendRemoved"));
      loadFriends();
    } catch (error) {
      console.error("Error removing friend:", error);
      showError(
        error.response?.data
          ? t("social.errorDetail", { message: error.response.data })
          : t("social.removeError"),
      );
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
      const filtered = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()),
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
   * @param {string} userId - The user's ID for profile link (optional)
   * @returns {JSX.Element} Profile image element
   */
  const renderProfileImage = (
    avatarUrl,
    username,
    size = 50,
    userId = null,
  ) => {
    const imageElement = avatarUrl ? (
      <img
        src={`${import.meta.env.VITE_BASE_URL}${avatarUrl}`}
        alt={username}
        className="rounded-circle"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "cover",
          cursor: userId ? "pointer" : "default",
        }}
      />
    ) : (
      <div
        className="cm-avatar"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${size * 0.32}px`,
          cursor: userId ? "pointer" : "default",
        }}
      >
        {username?.slice(0, 2).toUpperCase()}
      </div>
    );

    if (userId) {
      return (
        <Link to={`/profile/${userId}`} className="d-block">
          {imageElement}
        </Link>
      );
    }

    return imageElement;
  };

  if (loading) {
    return <LoadingSpinner message={t("social.loadingFriends")} />;
  }

  return (
    <div className="container-xxl cm-page">
      <div className="row">
        <div className="col-12">
          <header className="cm-page-head">
            <div>
              <div className="cm-eyebrow">
                <FaUserFriends className="me-2" />
                {t("nav.community")}
              </div>
              <h1>{t("social.title")}</h1>
            </div>
          </header>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "friends" ? "active" : ""}`}
                onClick={() => setActiveTab("friends")}
              >
                {t("social.myFriends")} ({friends.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "requests" ? "active" : ""}`}
                onClick={() => setActiveTab("requests")}
              >
                {t("social.requests")} ({pendingRequests.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "search" ? "active" : ""}`}
                onClick={() => setActiveTab("search")}
              >
                {t("social.findFriends")}
              </button>
            </li>
          </ul>

          {/* Friends Tab */}
          {activeTab === "friends" && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">{t("social.myFriends")}</h5>
              </div>
              <div className="card-body">
                {friends.length === 0 ? (
                  <p className="text-muted">{t("social.noFriends")}</p>
                ) : (
                  <div className="row">
                    {friends.map((friend) => (
                      <div key={friend.id} className="col-md-6 col-lg-4 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <div className="me-3">
                                {renderProfileImage(
                                  friend.avatarUrl,
                                  friend.username,
                                  50,
                                  friend.id,
                                )}
                              </div>
                              <div>
                                <h6 className="mb-0">{friend.username}</h6>
                                <small className="text-muted">
                                  {friend.email}
                                </small>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <Link
                                to={`/profile/${friend.id}`}
                                className="btn btn-outline-secondary btn-sm"
                              >
                                {t("social.viewProfile")}
                              </Link>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeFriend(friend.id)}
                                title={t("social.removeFriend")}
                                aria-label={t("social.removeFriend")}
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
          {activeTab === "requests" && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">{t("social.friendRequests")}</h5>
              </div>
              <div className="card-body">
                {pendingRequests.length === 0 ? (
                  <p className="text-muted">{t("social.noRequests")}</p>
                ) : (
                  <div className="list-group">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="list-group-item">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              {renderProfileImage(
                                request.requester.avatarUrl,
                                request.requester.username,
                                40,
                              )}
                            </div>
                            <div>
                              <h6 className="mb-0">
                                {request.requester.username}
                              </h6>
                              <small className="text-muted">
                                {formatDate(request.requestedAt)}
                              </small>
                            </div>
                          </div>
                          <div>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => acceptFriendRequest(request.id)}
                            >
                              <FaCheck className="me-1" /> {t("social.accept")}
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => declineFriendRequest(request.id)}
                            >
                              <FaTimes className="me-1" /> {t("social.decline")}
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
          {activeTab === "search" && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">{t("social.findFriends")}</h5>
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
                      placeholder={t("social.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>

                {searchQuery.length > 2 && (
                  <div>
                    {searchUsers.length === 0 ? (
                      <p className="text-muted">{t("social.noUsersFound")}</p>
                    ) : (
                      <div className="row">
                        {searchUsers.map((user) => (
                          <div key={user.id} className="col-md-6 col-lg-4 mb-3">
                            <div className="card h-100">
                              <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                  <div className="me-3">
                                    {renderProfileImage(
                                      user.avatarUrl,
                                      user.username,
                                      50,
                                      user.id,
                                    )}
                                  </div>
                                  <div>
                                    <h6 className="mb-0">{user.username}</h6>
                                    <small className="text-muted">
                                      {user.email}
                                    </small>
                                  </div>
                                </div>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-primary btn-sm px-3 py-1 d-flex align-items-center"
                                    onClick={() => sendFriendRequest(user.id)}
                                  >
                                    <FaUserPlus
                                      className="me-1"
                                      style={{ fontSize: "0.85rem" }}
                                    />
                                    <span style={{ fontSize: "0.85rem" }}>
                                      {t("social.sendRequest")}
                                    </span>
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
