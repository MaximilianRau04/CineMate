import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaUserFriends, FaEye, FaStar, FaLock } from "react-icons/fa";
import { useToast } from "../toasts";
import UserMediaTabs from "../profile/UserMediaTabs";
import api from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { LoadingSpinner } from "../explore/FilterPanel";
import "../profile/Profile.css";
import { useTranslation } from "../../i18n/I18nContext";

const FriendProfile = () => {
  const { userId } = useParams();
  const { success, error: showError } = useToast();
  const { t, formatDate } = useTranslation();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Renders a profile image with fallback to default avatar
   * @param {string} avatarUrl - The user's avatar URL
   * @param {string} username - The user's username
   * @param {number} size - The size of the avatar (default: 150)
   * @returns {JSX.Element} Profile image element
   */
  const renderProfileImage = (avatarUrl, username, size = 150) => {
    if (avatarUrl) {
      return (
        <img
          src={`${import.meta.env.VITE_BASE_URL}${avatarUrl}`}
          alt=""
          className="rounded-circle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: "cover",
          }}
        />
      );
    }
    return (
      <span
        className="cm-avatar"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${size * 0.32}px`,
        }}
      >
        {username?.slice(0, 2).toUpperCase()}
      </span>
    );
  };

  /**
   * Load user data, points, friends, and check friendship status.
   * @return {Promise<void>} Resolves when all data is loaded.
   * @throws {Error} if any of the API requests fail.
   */
  const loadUserData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUser(),
        loadUserPoints(),
        loadUserFriends(),
        checkFriendship(),
      ]);
    } catch (error) {
      console.error("Error loading user data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load user profile data from the API.
   * @returns {Promise<void>}
   * @throws {Error} if the request fails
   */
  const loadUser = async () => {
    const { data: userData } = await api.get(`/users/${userId}`);
    setUser(userData);
  };

  /**
   * Load user points from the API.
   * @returns {Promise<void>}
   * @throws {Error} if the request fails
   */
  const loadUserPoints = async () => {
    try {
      const { data: pointsData } = await api.get(`/social/points/${userId}`);
      setUserPoints(pointsData);
    } catch (error) {
      console.error("Error loading user points:", error);
      showError(t("leaderboard.pointsError"));
    }
  };

  /**
   * Load user friends from the API.
   * @returns {Promise<void>}
   * @throws {Error} if the request fails
   */
  const loadUserFriends = async () => {
    try {
      const { data: friendsData } = await api.get(`/social/friends/${userId}`);
      setFriends(friendsData);
    } catch (error) {
      console.error("Error loading user friends:", error);
      showError(t("social.loadFriendsError"));
    }
  };

  /**
   * Check if the current user is friends with the viewed profile user.
   * @return {Promise<void>} Resolves when friendship status is checked.
   * @throws {Error} if the request fails
   */
  const checkFriendship = async () => {
    try {
      const { data: myFriends } = await api.get("/social/friends");
      const friendshipExists = myFriends.some((friend) => friend.id === userId);
      setIsFriend(friendshipExists);
    } catch (error) {
      console.error("Error checking friendship:", error);
      showError(t("social.friendshipCheckError"));
    }
  };

  /**
   * Send a friend request to the user.
   * @returns {Promise<void>} Resolves when the request is sent.
   * @throws {Error} if the request fails
   */
  const sendFriendRequest = async () => {
    try {
      await api.post(`/social/friends/request/${userId}`);
      success(t("social.requestSent"));
    } catch (error) {
      console.error("Error sending friend request:", error);
      showError(
        error.response?.data
          ? t("social.errorDetail", { message: error.response.data })
          : t("social.requestSendError"),
      );
    }
  };

  if (loading) {
    return <LoadingSpinner message={t("social.loadingProfile")} />;
  }

  if (error || !user) {
    return (
      <div className="container cm-page">
        <div className="cm-empty">
          <h3>{t("social.userNotFound")}</h3>
          {error && <p className="mb-0">{error}</p>}
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;
  const canViewProfile = isOwnProfile || isFriend || user.profilePublic;

  const formattedDate = formatDate(user.joinedAt, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container-xxl cm-page">
      <section className="cm-profile-head">
        <div className="cm-profile-avatar">
          <div className="cm-avatar-xl">
            {user.avatarUrl ? (
              <img
                src={`${import.meta.env.VITE_BASE_URL}${user.avatarUrl}`}
                alt=""
              />
            ) : (
              <span>{user.username?.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-grow-1">
          <div className="cm-eyebrow">
            {t("profile.memberSince", { date: formattedDate })}
          </div>
          <h1 className="cm-profile-name">{user.username}</h1>

          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            {isFriend && (
              <span className="cm-tag cm-tag-brass">
                <FaUserFriends className="me-1" />
                {t("social.friend")}
              </span>
            )}
            {!isOwnProfile && !isFriend && user.allowFriendRequests && (
              <button
                className="btn btn-primary btn-sm"
                onClick={sendFriendRequest}
              >
                <FaUserFriends className="me-2" />
                {t("social.sendRequest")}
              </button>
            )}
          </div>

          {canViewProfile && user.bio && <p className="cm-bio">{user.bio}</p>}
        </div>
      </section>

      {!canViewProfile ? (
        <div className="cm-empty mt-4">
          <FaLock className="fs-2 mb-3" />
          <h3>{t("social.privateProfile")}</h3>
          <p className="mb-0">
            {t("social.privateProfileHint", { name: user.username })}
          </p>
        </div>
      ) : (
        <>
          <div className="cm-stat-tiles my-4">
            <div className="cm-stat-tile">
              <div className="cm-stat-value">{friends.length}</div>
              <div className="cm-stat-label">{t("nav.friends")}</div>
            </div>
            {userPoints && (
              <>
                <div className="cm-stat-tile">
                  <div className="cm-stat-value">{userPoints.totalPoints}</div>
                  <div className="cm-stat-label">
                    {t("leaderboard.totalPoints")}
                  </div>
                </div>
                <div className="cm-stat-tile">
                  <div className="cm-stat-value">{userPoints.watchPoints}</div>
                  <div className="cm-stat-label">
                    <FaEye className="me-1" />
                    {t("leaderboard.watched")}
                  </div>
                </div>
                <div className="cm-stat-tile">
                  <div className="cm-stat-value">{userPoints.reviewPoints}</div>
                  <div className="cm-stat-label">
                    <FaStar className="me-1" />
                    {t("leaderboard.reviews")}
                  </div>
                </div>
              </>
            )}
          </div>

          <section className="cm-panel">
            <h2 className="cm-panel-title">
              {t("social.libraryOf", { name: user.username })}
            </h2>
            <UserMediaTabs userId={userId} readOnly={!isOwnProfile} />
          </section>

          {friends.length > 0 && (
            <section className="cm-panel mt-4">
              <h2 className="cm-panel-title">
                {t("nav.friends")}{" "}
                <span className="cm-count">{friends.length}</span>
              </h2>
              <div className="d-flex flex-wrap gap-3">
                {friends.slice(0, 12).map((friend) => (
                  <Link
                    key={friend.id}
                    to={`/profile/${friend.id}`}
                    className="cm-friend-chip"
                  >
                    {renderProfileImage(friend.avatarUrl, friend.username, 36)}
                    <span className="text-truncate">{friend.username}</span>
                  </Link>
                ))}
                {friends.length > 12 && (
                  <span className="text-muted align-self-center">
                    {t("lists.moreTags", { count: friends.length - 12 })}
                  </span>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default FriendProfile;
