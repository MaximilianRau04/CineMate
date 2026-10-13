import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTrophy,
  FaMedal,
  FaAward,
  FaStar,
  FaEye,
  FaHeart,
} from "react-icons/fa";
import api from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";
import { LoadingSpinner } from "../explore/FilterPanel";
import { useTranslation } from "../../i18n/I18nContext";

const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const { error: showError } = useToast();
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myPoints, setMyPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          src={`${import.meta.env.VITE_BASE_URL}${avatarUrl}`}
          alt={username}
          className="rounded-circle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: "cover",
          }}
        />
      );
    } else {
      return (
        <div
          className="cm-avatar"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            fontSize: `${size * 0.32}px`,
          }}
        >
          {username?.slice(0, 2).toUpperCase()}
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
      await Promise.all([loadLeaderboard(), loadMyPoints()]);
    } catch (error) {
      console.error("Error loading leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads the leaderboard data from the API.
   */
  const loadLeaderboard = async () => {
    try {
      const { data } = await api.get("/social/leaderboard?limit=20");
      setLeaderboard(data);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      showError(t("leaderboard.loadError"));
    }
  };

  /**
   * Loads the user's points data from the API.
   */
  const loadMyPoints = async () => {
    try {
      const { data } = await api.get("/social/points");
      setMyPoints(data);
    } catch (error) {
      console.error("Error loading my points:", error);
      showError(t("leaderboard.pointsError"));
    }
  };

  /**
   * Returns the appropriate icon for the user's rank.
   * @param {number} rank - The user's rank.
   * @returns {JSX.Element} The icon element.
   */
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy style={{ color: "var(--cm-brass)" }} size={20} />;
      case 2:
        return <FaMedal style={{ color: "#c9c3bd" }} size={20} />;
      case 3:
        return <FaAward style={{ color: "#cd7f32" }} size={20} />;
      default:
        return <span className="cm-mono text-muted">{rank}</span>;
    }
  };

  /**
   * returns the appropriate CSS class for the user's rank.
   * @param {*} rank
   * @returns {string} The CSS class for the rank.
   */
  const getRankClass = (rank) => {
    return rank <= 3 ? "cm-podium" : "";
  };

  if (loading) {
    return <LoadingSpinner message={t("leaderboard.loading")} />;
  }

  return (
    <div className="container-xxl cm-page">
      <div className="row">
        <div className="col-12">
          <header className="cm-page-head">
            <div>
              <div className="cm-eyebrow">{t("leaderboard.eyebrow")}</div>
              <h1>{t("leaderboard.title")}</h1>
            </div>
          </header>

          {myPoints && (
            <div className="cm-stat-tiles mb-4">
              <div className="cm-stat-tile">
                <div className="cm-stat-value">
                  {leaderboard.findIndex(
                    (entry) => entry.userId === currentUser?.id,
                  ) + 1 || "–"}
                </div>
                <div className="cm-stat-label">{t("leaderboard.yourRank")}</div>
              </div>
              <div className="cm-stat-tile">
                <div className="cm-stat-value">{myPoints.totalPoints}</div>
                <div className="cm-stat-label">
                  {t("leaderboard.totalPoints")}
                </div>
              </div>
              <div className="cm-stat-tile">
                <div className="cm-stat-value">{myPoints.reviewPoints}</div>
                <div className="cm-stat-label">
                  <FaStar className="me-1" />
                  {t("leaderboard.reviews")}
                </div>
              </div>
              <div className="cm-stat-tile">
                <div className="cm-stat-value">{myPoints.watchPoints}</div>
                <div className="cm-stat-label">
                  <FaEye className="me-1" />
                  {t("leaderboard.watched")}
                </div>
              </div>
              <div className="cm-stat-tile">
                <div className="cm-stat-value">{myPoints.socialPoints}</div>
                <div className="cm-stat-label">
                  <FaHeart className="me-1" />
                  {t("leaderboard.social")}
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">{t("leaderboard.topUsers")}</h5>
            </div>
            <div className="card-body">
              {leaderboard.length === 0 ? (
                <p className="text-muted text-center">
                  {t("leaderboard.noData")}
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th width="80" className="text-center">
                          {t("leaderboard.rank")}
                        </th>
                        <th>{t("statistics.user")}</th>
                        <th className="text-center">
                          {t("leaderboard.total")}
                        </th>
                        <th className="text-center">
                          <FaStar
                            className="text-warning"
                            title={t("leaderboard.reviewPoints")}
                          />
                        </th>
                        <th className="text-center">
                          <FaEye title={t("leaderboard.watchPoints")} />
                        </th>
                        <th className="text-center">
                          <FaHeart
                            className="text-success"
                            title={t("leaderboard.socialPoints")}
                          />
                        </th>
                        <th className="text-center">
                          <FaAward
                            className="text-primary"
                            title={t("leaderboard.achievementPoints")}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => {
                        const rank = index + 1;
                        const isCurrentUser = entry.userId === currentUser?.id;

                        return (
                          <tr
                            key={entry.id}
                            className={`${getRankClass(rank)} ${isCurrentUser ? "cm-row-self" : ""}`}
                          >
                            <td className="text-center">{getRankIcon(rank)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                {isCurrentUser ? (
                                  <div className="me-3">
                                    {renderProfileImage(
                                      entry.avatarUrl,
                                      entry.username,
                                      40,
                                    )}
                                  </div>
                                ) : (
                                  <Link
                                    to={`/profile/${entry.userId}`}
                                    title={t("social.viewProfile")}
                                    className="me-3"
                                  >
                                    <div
                                      style={{
                                        cursor: "pointer",
                                        transition: "transform 0.2s",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform =
                                          "scale(1.1)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform =
                                          "scale(1)")
                                      }
                                    >
                                      {renderProfileImage(
                                        entry.avatarUrl,
                                        entry.username,
                                        40,
                                      )}
                                    </div>
                                  </Link>
                                )}
                                <div>
                                  <div className="fw-bold">
                                    {isCurrentUser ? (
                                      <>
                                        {entry.username}
                                        <span className="badge bg-primary ms-2">
                                          {t("common.you")}
                                        </span>
                                      </>
                                    ) : (
                                      <Link
                                        to={`/profile/${entry.userId}`}
                                        className="text-decoration-none fw-bold"
                                        style={{ color: "inherit" }}
                                        title={t("social.viewProfile")}
                                      >
                                        {entry.username}
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <span className="fs-5 fw-bold">
                                {entry.totalPoints}
                              </span>
                            </td>
                            <td className="text-center">
                              {entry.reviewPoints}
                            </td>
                            <td className="text-center">{entry.watchPoints}</td>
                            <td className="text-center">
                              {entry.socialPoints}
                            </td>
                            <td className="text-center">
                              {entry.achievementPoints}
                            </td>
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
              <h6 className="mb-0">{t("leaderboard.pointSystem")}</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 col-lg-3 mb-3 mb-lg-0">
                  <div className="text-center p-3 border rounded">
                    <FaStar className="fs-3 text-warning mb-2" />
                    <h6>{t("leaderboard.reviews")}</h6>
                    <p className="small text-muted mb-0">
                      {t("leaderboard.perReview")}
                    </p>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3 mb-3 mb-lg-0">
                  <div className="text-center p-3 border rounded">
                    <FaEye className="fs-3 text-info mb-2" />
                    <h6>{t("leaderboard.markWatched")}</h6>
                    <p className="small text-muted mb-0">
                      {t("leaderboard.perWatched")}
                    </p>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3 mb-3 mb-lg-0">
                  <div className="text-center p-3 border rounded">
                    <FaHeart className="fs-3 text-success mb-2" />
                    <h6>{t("leaderboard.socialInteractions")}</h6>
                    <p className="small text-muted mb-0">
                      {t("leaderboard.perFriendship")}
                    </p>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3 mb-3 mb-lg-0">
                  <div className="text-center p-3 border rounded">
                    <FaAward className="fs-3 text-primary mb-2" />
                    <h6>{t("nav.achievements")}</h6>
                    <p className="small text-muted mb-0">
                      {t("leaderboard.perMilestone")}
                    </p>
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
