import { useEffect, useState, useRef } from "react";
import { useToast } from "../toasts";
import UserMediaTabs from "./UserMediaTabs";
import CompactNotificationSettings from "./CompactNotificationSettings";
import UserAchievementBadges from "../achievements/UserAchievementBadges";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { LoadingSpinner } from "../explore/FilterPanel";
import "./Profile.css";
import { useTranslation } from "../../i18n/I18nContext";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalBio, setModalBio] = useState("");
  const fileInputRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const { success, error: showError } = useToast();
  const { t, formatDate } = useTranslation();

  /**
   * * Fetches the user data from the API and sets the user state.
   * * @returns {void}
   * * @throws {Error} If the user data cannot be fetched.
   */
  useEffect(() => {
    api
      .get("/users/me")
      .then(({ data }) => {
        setUser(data);
        setBio(data.bio || "");
        setModalBio(data.bio || "");
        setLoading(false);
        setUserId(data.id);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);

  /**
   * fetches the reviews of the user from the API and sets the reviews state.
   * @returns {void}
   * @throws {Error} If the reviews cannot be fetched.
   */
  useEffect(() => {
    if (!userId) return;

    api
      .get(`/reviews/user/${userId}`)
      .then(({ data }) => {
        setReviews(data);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Reviews:", err.message);
      });
  }, [userId]);

  /**
   * removes the avatar from the user profile.
   * @returns {void}
   * @throws {Error} If the avatar cannot be removed.
   */
  const handleRemoveAvatar = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      const formData = new FormData();
      const userData = {
        bio: bio,
        removeAvatar: true,
      };

      formData.append(
        "user",
        new Blob([JSON.stringify(userData)], { type: "application/json" }),
      );

      const { data: updatedUser } = await api.put(`/users/${userId}`, formData);

      setUser(updatedUser);
      setAvatarPreview(null);
      setAvatarFile(null);
      success(t("profile.avatarRemoved"));
    } catch (err) {
      console.error("Fehler beim Entfernen des Avatars:", err);
      showError(t("profile.avatarRemoveError"));
    } finally {
      setSaving(false);
    }
  };

  // open the modal to edit the bio
  const openModal = () => {
    setModalBio(bio);
    setShowModal(true);
  };

  // save the bio from the modal
  const saveModalBio = async () => {
    if (!userId) return;

    setIsBioLoading(true);
    try {
      const formData = new FormData();
      const userData = {
        bio: modalBio,
      };

      formData.append(
        "user",
        new Blob([JSON.stringify(userData)], { type: "application/json" }),
      );

      const { data: updatedUser } = await api.put(`/users/${userId}`, formData);
      setUser(updatedUser);
      setBio(modalBio);
      setShowModal(false);
      success(t("profile.bioSaved"));
    } catch (error) {
      console.error("Error saving bio:", error);
      showError(t("profile.bioSaveError"));
    } finally {
      setIsBioLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  /**
   * automatically saves the user profile when the avatar file changes.
   * @returns {void}
   * @throws {Error} If the user profile cannot be saved.
   */
  useEffect(() => {
    if (avatarFile) {
      const autoSave = async () => {
        if (!userId) return;

        const formData = new FormData();
        const userData = { bio };

        formData.append(
          "user",
          new Blob([JSON.stringify(userData)], { type: "application/json" }),
        );

        formData.append("avatar", avatarFile);

        setSaving(true);
        try {
          const { data: updatedUser } = await api.put(
            `/users/${userId}`,
            formData,
          );
          setUser(updatedUser);
          setAvatarFile(null);
          setAvatarPreview(null);
          success(t("profile.profileSaved"));
        } catch (err) {
          console.error("Fehler beim Speichern:", err);
          showError(t("profile.profileSaveError"));
        } finally {
          setSaving(false);
        }
      };

      autoSave();
    }
  }, [avatarFile, userId, bio, showError, success]);

  if (loading) return <LoadingSpinner message={t("profile.loading")} />;

  if (error) {
    return (
      <div className="container cm-page">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">{t("common.error")}</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  const { username, email, avatarUrl, joinedAt } = user;
  const formattedDate = formatDate(joinedAt, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasAvatar = avatarPreview || avatarUrl;

  return (
    <div className="container-xxl cm-page">
      <section className="cm-profile-head">
        <div className="cm-profile-avatar">
          <button
            type="button"
            className="cm-avatar-xl"
            onClick={handleAvatarClick}
            title={
              hasAvatar ? t("profile.changeAvatar") : t("profile.addAvatar")
            }
            aria-label={
              hasAvatar ? t("profile.changeAvatar") : t("profile.addAvatar")
            }
          >
            {hasAvatar ? (
              <img
                src={
                  avatarPreview ||
                  `${import.meta.env.VITE_BASE_URL}${avatarUrl}`
                }
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>{username?.slice(0, 2).toUpperCase()}</span>
            )}
            <span className="cm-avatar-xl-overlay">
              <i className="bi bi-camera-fill" />
            </span>
          </button>
          {hasAvatar && (
            <button
              type="button"
              className="btn btn-link btn-sm text-danger p-0 mt-2"
              onClick={handleRemoveAvatar}
            >
              {t("profile.removeAvatar")}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setAvatarPreview(URL.createObjectURL(file));
                setAvatarFile(file);
              }
            }}
            className="d-none"
          />
        </div>

        <div className="min-w-0 flex-grow-1">
          <div className="cm-eyebrow">
            {t("profile.memberSince", { date: formattedDate })}
          </div>
          <h1 className="cm-profile-name">{username}</h1>
          <div className="text-muted small mb-3">{email}</div>

          <div className="cm-bio">
            {bio ? (
              <p className="mb-0">{bio}</p>
            ) : (
              <p className="text-muted mb-0 fst-italic">{t("profile.noBio")}</p>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mt-3"
              onClick={openModal}
            >
              <i className="bi bi-pencil me-1"></i>
              {t("profile.editBio")}
            </button>
          </div>

          {saving && (
            <div className="mt-3 small text-muted">
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {avatarFile
                ? t("profile.savingAvatar")
                : t("profile.removingAvatar")}
            </div>
          )}
        </div>
      </section>

      <section className="cm-panel mt-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="cm-panel-title mb-0">{t("profile.achievements")}</h2>
          <Link to="/achievements" className="btn btn-sm btn-outline-primary">
            {t("profile.allAchievements")}
          </Link>
        </div>
        {userId && (
          <UserAchievementBadges userId={userId} limit={6} showCount={true} />
        )}
      </section>

      <section className="cm-panel mt-4">
        <h2 className="cm-panel-title">{t("profile.myMedia")}</h2>
        <UserMediaTabs userId={userId} />
      </section>

      <div className="mt-4">
        <CompactNotificationSettings userId={userId} />
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(8, 4, 10, 0.75)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("profile.editBio")}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label={t("common.close")}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="5"
                  value={modalBio}
                  onChange={(e) => setModalBio(e.target.value)}
                  placeholder={t("profile.bioPlaceholder")}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isBioLoading}
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveModalBio}
                  disabled={isBioLoading}
                >
                  {isBioLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {t("common.saving")}
                    </>
                  ) : (
                    t("common.save")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
