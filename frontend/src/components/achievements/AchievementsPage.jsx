import { useState, useEffect } from "react";
import { FaTrophy, FaMedal, FaStar, FaLock, FaUnlock } from "react-icons/fa";
import "./AchievementsPage.css";
import api from "../../utils/api";
import { useToast } from "../toasts";
import { LoadingSpinner } from "../explore/FilterPanel";
import { achievementTitle, achievementDescription } from "./localize";
import { useTranslation } from "../../i18n/I18nContext";

const AchievementsPage = ({ userId }) => {
  const { error: showError } = useToast();
  const { t, has, formatDate } = useTranslation();
  const [userAchievements, setUserAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("unlocked");

  /**
   * Fetch user achievements and stats from the API.
   */
  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      try {
        await Promise.all([loadUserAchievements(), loadAchievementStats()]);
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    /**
     * Fetch user achievements from the API.
     */
    const loadUserAchievements = async () => {
      try {
        const { data } = await api.get(`/achievements/user/${userId}`);
        setUserAchievements(data);
      } catch (error) {
        console.error("Error loading user achievements:", error);
        showError(t("achievements.loadError"));
      }
    };

    /**
     * Fetch user achievement stats from the API.
     */
    const loadAchievementStats = async () => {
      try {
        const { data } = await api.get(`/achievements/user/${userId}/stats`);
        setStats(data);
      } catch (error) {
        console.error("Error loading achievement stats:", error);
        showError(t("achievements.statsError"));
      }
    };

    if (userId) {
      loadAchievements();
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Get the badge icon for a specific achievement.
   * @param {*} achievement
   * @returns {JSX.Element} The icon component for the achievement type.
   */
  const getBadgeIcon = (achievement) => {
    switch (achievement.type) {
      case "REVIEWS":
        return <FaStar className="achievement-icon" />;
      case "MOVIES_WATCHED":
      case "SERIES_WATCHED":
        return <FaTrophy className="achievement-icon" />;
      case "FORUM_POSTS":
      case "FRIENDS":
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
      case "badge-warning":
        return "achievement-badge-warning";
      case "badge-primary":
        return "achievement-badge-primary";
      case "badge-info":
        return "achievement-badge-info";
      case "badge-success":
        return "achievement-badge-success";
      case "badge-danger":
        return "achievement-badge-danger";
      case "badge-gold":
        return "achievement-badge-gold";
      default:
        return "achievement-badge-secondary";
    }
  };

  const getUnlockedAchievements = () => {
    return userAchievements.filter((ua) => ua.unlocked);
  };

  const getInProgressAchievements = () => {
    return userAchievements.filter((ua) => !ua.unlocked);
  };

  const renderAchievementCard = (userAchievement, isUnlocked = true) => {
    const achievement = userAchievement.achievement;
    const progressPercentage = userAchievement.progressPercentage || 0;

    return (
      <article
        key={userAchievement.id}
        className={`achievement-card ${isUnlocked ? "unlocked" : "locked"}`}
      >
        <div
          className={`achievement-badge ${getBadgeClass(achievement.badgeColor)}`}
        >
          {getBadgeIcon(achievement)}
          {!isUnlocked && <FaLock className="lock-icon" />}
        </div>

        <div className="achievement-content">
          <h3 className="achievement-title">
            {achievementTitle(achievement, t)}
          </h3>
          <p className="achievement-description">
            {achievementDescription(achievement, t, has)}
          </p>

          {!isUnlocked && (
            <div className="progress-container">
              <div
                className="progress"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <small className="progress-text">
                {userAchievement.progress} / {achievement.threshold}
              </small>
            </div>
          )}

          <div className="achievement-footer">
            <span className="achievement-points">
              {t("achievements.points", { count: achievement.points })}
            </span>
            {isUnlocked && userAchievement.unlockedAt && (
              <small className="text-muted">
                {formatDate(userAchievement.unlockedAt)}
              </small>
            )}
          </div>
        </div>
      </article>
    );
  };

  if (loading) {
    return <LoadingSpinner message={t("achievements.loading")} />;
  }

  const unlocked = getUnlockedAchievements();
  const inProgress = getInProgressAchievements();

  return (
    <div className="container-xxl cm-page">
      <header className="cm-page-head">
        <div>
          <div className="cm-eyebrow">{t("achievements.eyebrow")}</div>
          <h1>{t("achievements.title")}</h1>
        </div>
        {stats && (
          <dl className="cm-stat-strip">
            <div>
              <dt>{t("achievements.unlocked")}</dt>
              <dd>{stats.unlockedAchievements}</dd>
            </div>
            <div>
              <dt>{t("achievements.total")}</dt>
              <dd>{stats.totalAchievements}</dd>
            </div>
            <div>
              <dt>{t("achievements.progress")}</dt>
              <dd>{Math.round(stats.progressPercentage)}%</dd>
            </div>
          </dl>
        )}
      </header>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "unlocked" ? "active" : ""}`}
            onClick={() => setActiveTab("unlocked")}
          >
            <FaUnlock className="me-2" />
            {t("achievements.unlocked")} ({unlocked.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            <FaLock className="me-2" />
            {t("achievements.inProgress")} ({inProgress.length})
          </button>
        </li>
      </ul>

      {activeTab === "unlocked" ? (
        unlocked.length > 0 ? (
          <div className="achievements-grid">
            {unlocked.map((ua) => renderAchievementCard(ua, true))}
          </div>
        ) : (
          <div className="cm-empty">
            <h3>{t("achievements.noneUnlocked")}</h3>
            <p className="mb-0">{t("achievements.noneUnlockedHint")}</p>
          </div>
        )
      ) : inProgress.length > 0 ? (
        <div className="achievements-grid">
          {inProgress.map((ua) => renderAchievementCard(ua, false))}
        </div>
      ) : (
        <div className="cm-empty">
          <h3>{t("achievements.allUnlocked")}</h3>
          <p className="mb-0">{t("achievements.allUnlockedHint")}</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
