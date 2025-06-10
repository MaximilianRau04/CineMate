import React, { useEffect, useState, useRef } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalBio, setModalBio] = useState("");
  const fileInputRef = useRef(null);
  const [reviews, setReviews] = useState([]);

  /**
   * * Fetches the user data from the API and sets the user state.
   * * @returns {void}
   * * @throws {Error} If the user data cannot be fetched.
   */
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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

    fetch(`http://localhost:8080/api/reviews/user/${userId}`, {})
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
   */
  const handleRemoveAvatar = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      const formData = new FormData();
      const userData = { 
        bio: bio,
        removeAvatar: true 
      };

      formData.append(
        "user",
        new Blob([JSON.stringify(userData)], { type: "application/json" })
      );

      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Entfernen fehlgeschlagen: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (err) {
      console.error("Fehler beim Entfernen des Avatars:", err);
    } finally {
      setSaving(false);
    }
  };
  const openModal = () => {
    setModalBio(bio);
    setShowModal(true);
  };

  const saveModalBio = () => {
    setBio(modalBio);
    setShowModal(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  /**
   * automatically saves the user profile when the avatar file changes.
   */
  useEffect(() => {
    if (avatarFile) {
      const autoSave = async () => {
        if (!userId) return;
        
        const formData = new FormData();
        const userData = { bio };
        
        formData.append(
          "user",
          new Blob([JSON.stringify(userData)], { type: "application/json" })
        );
        
        formData.append("avatar", avatarFile);
        
        setSaving(true);
        try {
          const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: "PUT",
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Update fehlgeschlagen: ${response.status}`);
          }
          
          const updatedUser = await response.json();
          setUser(updatedUser);
          setAvatarFile(null);
          setAvatarPreview(null);
        } catch (err) {
          console.error("Fehler beim Speichern:", err);
        } finally {
          setSaving(false);
        }
      };
      
      autoSave();
    }
  }, [avatarFile, userId, bio]);

  if (loading)
    return <p className="text-center mt-5">🔄 Benutzer wird geladen...</p>;
  if (error)
    return <p className="text-center text-danger mt-5">❌ Fehler: {error}</p>;

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
                    src={
                      avatarPreview || 
                      `http://localhost:8080${avatarUrl}`
                    }
                    alt={username}
                    className="img-fluid rounded-circle shadow-sm mb-3"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    onClick={handleAvatarClick}
                    onError={(e) => {
                      console.log("Bild konnte nicht geladen werden:", e.target.src);
                      e.target.src = "https://via.placeholder.com/150?text=Kein+Bild";
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
                      <i className="bi bi-camera-fill" style={{ fontSize: "1.5rem" }}></i>
                      <div style={{ fontSize: "0.8rem", marginTop: "5px" }}>Ändern</div>
                    </div>
                  </div>
                  {/* Entfernen-Button */}
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
                      justifyContent: "center"
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
                    transition: "all 0.3s ease"
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
                  <i className="bi bi-camera-fill" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
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
            
            <div className="text-center">
              <small className="text-muted d-block">
                {hasAvatar ? 
                  "Klicke auf das Bild zum Ändern" : 
                  "Klicke hier, um ein Profilbild hinzuzufügen"
                }
              </small>
              {hasAvatar && (
                <small className="text-muted d-block mt-1">
                  <i className="bi bi-x-circle me-1"></i>
                  Oder auf das X zum Entfernen
                </small>
              )}
            </div>
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
                className="btn btn-outline-primary btn-sm"
                onClick={openModal}
              >
                <i className="bi bi-pencil-fill me-1"></i>
                Bearbeiten
              </button>
            </div>
            <p className="text-muted">
              <strong>Beigetreten:</strong> {formattedDate}
            </p>
            
            {saving && (
              <div className="mt-3 text-center">
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>{avatarFile ? "Bild wird gespeichert..." : "Avatar wird entfernt..."}</span>
              </div>
            )}
            
            <div className="mt-4">
              <h5>📝 Bewertungen</h5>
              <div
                className="review-container border rounded p-3 bg-light"
                style={{
                  maxHeight: "200px", 
                  overflowY: "auto",
                }}
              >
                {reviews.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {reviews.map((review) => (
                      <li key={review.id} className="list-group-item">
                        <strong>
                        🎬 {review.movie?.title || review.series?.title}
                        </strong>
                        <div className="mb-1">⭐ {review.rating} / 5</div>
                        <p className="mb-1">
                          {review.comment || "Kein Kommentar vorhanden."}
                        </p>
                        <small className="text-muted">
                          Bewertet am:{" "}
                          {new Date(review.date).toLocaleDateString("de-DE", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted fst-italic mb-0">
                    Noch keine Bewertungen.
                  </p>
                )}
              </div>
            </div>
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
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveModalBio}
                >
                  Speichern
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