import React, { useEffect, useState, useRef } from "react";
import { useToast } from "../toasts";
import UserMediaTabs from "./UserMediaTabs";
import CompactNotificationSettings from "./CompactNotificationSettings";
import UserAchievementBadges from "../achievements/UserAchievementBadges";
import { Link } from "react-router-dom";

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

  /**
   * * Fetches the user data from the API and sets the user state.
   * * @returns {void}
   * * @throws {Error} If the user data cannot be fetched.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/users/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Benutzer konnte nicht geladen werden.");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setBio(data.bio || "");
        setModalBio(data.bio || "");
        setLoading(false);
        setUserId(data.id);
      })
      .catch((err) => {
        setError(err.message);
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

    fetch(`http://localhost:8080/api/reviews/user/${userId}`, {
      headers: (() => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
      })(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Konnte Reviews nicht laden.");
        return res.json();
      })
      .then((data) => {
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

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "PUT",
          body: formData,
          headers: (() => {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
          })(),
        },
      );

      if (!response.ok) {
        throw new Error(`Entfernen fehlgeschlagen: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setAvatarPreview(null);
      setAvatarFile(null);
      success("Avatar erfolgreich entfernt!");
    } catch (err) {
      console.error("Fehler beim Entfernen des Avatars:", err);
      showError("Fehler beim Entfernen des Avatars");
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

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "PUT",
          headers: (() => {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
          })(),
          body: formData,
        },
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setBio(modalBio);
        setShowModal(false);
        success("Biografie erfolgreich aktualisiert!");
      } else {
        throw new Error("Fehler beim Speichern der Biografie");
      }
    } catch (error) {
      console.error("Error saving bio:", error);
      showError("Fehler beim Speichern der Biografie");
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
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8080/api/users/${userId}`,
            {
              method: "PUT",
              body: formData,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            },
          );

          if (!response.ok) {
            throw new Error(`Update fehlgeschlagen: ${response.status}`);
          }

          const updatedUser = await response.json();
          setUser(updatedUser);
          setAvatarFile(null);
          setAvatarPreview(null);
          success("Profil erfolgreich aktualisiert!");
        } catch (err) {
          console.error("Fehler beim Speichern:", err);
          showError("Fehler beim Aktualisieren des Profils");
        } finally {
          setSaving(false);
        }
      };

      autoSave();
    }
  }, [avatarFile, userId, bio, showError, success]);

  if (loading)
    return <p className="text-center mt-5">🔄 Benutzer wird geladen...</p>;

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  const { username, email, avatarUrl, joinedAt } = user;
  const formattedDate = new Date(joinedAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasAvatar = avatarPreview || avatarUrl;

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-4 d-flex flex-column align-items-center justify-content-center bg-dark text-white p-4">
            <div
              className="avatar-container position-relative"
              style={{ cursor: "pointer" }}
            >
              {hasAvatar ? (
                <>
                  <img
                    src={avatarPreview || `http://localhost:8080${avatarUrl}`}
                    alt={username}
                    className="img-fluid rounded-circle shadow-sm mb-3"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    onClick={handleAvatarClick}
                    onError={(e) => {
                      console.log(
                        "Bild konnte nicht geladen werden:",
                        e.target.src,
                      );
                      e.target.src =
                        "https://via.placeholder.com/150?text=Kein+Bild";
                    }}
                  />
                  {/* hover-overlay for avatar */}
                  <div
                    className="avatar-overlay position-absolute rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "150px",
                      height: "150px",
                      background: "rgba(0,0,0,0.7)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                    onClick={handleAvatarClick}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}
                  >
                    <div className="text-center">
                      <i
                        className="bi bi-camera-fill"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                      <div style={{ fontSize: "0.8rem", marginTop: "5px" }}>
                        Ändern
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-danger btn-sm position-absolute"
                    style={{
                      top: "5px",
                      right: "5px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={handleRemoveAvatar}
                    title="Avatar entfernen"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </>
              ) : (
                /* Placeholder*/
                <div
                  className="d-flex flex-column align-items-center justify-content-center rounded-circle bg-secondary mb-3"
                  style={{
                    width: "150px",
                    height: "150px",
                    border: "3px dashed #6c757d",
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleAvatarClick}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#5a6268";
                    e.currentTarget.style.borderColor = "#adb5bd";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#6c757d";
                    e.currentTarget.style.borderColor = "#6c757d";
                  }}
                >
                  <i
                    className="bi bi-camera-fill"
                    style={{ fontSize: "2rem", marginBottom: "10px" }}
                  ></i>
                  <div className="text-center" style={{ fontSize: "0.9rem" }}>
                    <div>Avatar</div>
                    <div>hinzufügen</div>
                  </div>
                </div>
              )}
            </div>

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

          <div className="col-md-8 p-4">
            <h2 className="mb-3">{username}</h2>
            <p className="text-muted mb-1">
              <strong>Email:</strong> {email}
            </p>
            <div className="mb-3">
              <label className="form-label mb-2">
                <strong>Über mich:</strong>
              </label>
              <div className="bio-container p-3 bg-light rounded mb-2">
                {bio ? (
                  <p className="mb-0">{bio}</p>
                ) : (
                  <p className="text-muted mb-0 fst-italic">
                    Keine Biografie vorhanden. Klicke auf "Bearbeiten", um eine
                    hinzuzufügen.
                  </p>
                )}
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={openModal}
              >
                <i className="bi bi-pencil-fill me-1"></i>
                Bearbeiten
              </button>
            </div>

            {/* Achievements Section */}
            <div className="mb-3">
              <label className="form-label mb-2">
                <strong>Meine Achievements:</strong>
              </label>
              {userId && (
                <UserAchievementBadges
                  userId={userId}
                  limit={6}
                  showCount={true}
                />
              )}
              <Link
                to={`/achievements`}
                className="btn btn-primary btn-sm mt-2"
              >
                <i className="bi bi-trophy me-1"></i>
                Alle Achievements anzeigen
              </Link>
            </div>

            <p className="text-muted">
              <strong>Beigetreten:</strong> {formattedDate}
            </p>

            {saving && (
              <div className="mt-3 text-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>
                  {avatarFile
                    ? "Bild wird gespeichert..."
                    : "Avatar wird entfernt..."}
                </span>
              </div>
            )}
          </div>

          <div className="card shadow-lg border-0 mt-4">
            <div className="card-header bg-white">
              <h4 className="mb-0">Meine Medien</h4>
            </div>
            <div
              className="card-body"
              style={{
                maxHeight: "350px",
                overflowY: "auto",
              }}
            >
              <UserMediaTabs userId={userId} />
            </div>
          </div>

          <div className="mt-4">
            <CompactNotificationSettings userId={userId} />
          </div>
        </div>
      </div>

      {/* Bio Edit Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Biografie bearbeiten</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="5"
                  value={modalBio}
                  onChange={(e) => setModalBio(e.target.value)}
                  placeholder="Erzähle etwas über dich..."
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isBioLoading}
                >
                  Abbrechen
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
                      Speichern...
                    </>
                  ) : (
                    "Speichern"
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
