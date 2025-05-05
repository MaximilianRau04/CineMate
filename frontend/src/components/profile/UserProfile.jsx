import React, { useEffect, useState, useRef } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [setSaving] = useState(false);
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
   * updates the user profile with the new bio and avatar.
   * @param {*} e
   * @returns {void}
   * @throws {Error} If the profile cannot be updated.
   */
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!userId) return;

    const formData = new FormData();

    const userData = { bio };

    formData.append(
      "user",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    setSaving(true);
    fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Update fehlgeschlagen: ${res.status}`);
        }
        return res.json();
      })
      .then((updatedUser) => {
        setUser(updatedUser);
        if (avatarFile && avatarPreview) {
        } else if (updatedUser.avatarUrl) {
          setAvatarPreview(null);
        }
        setAvatarFile(null);
        alert("Profil erfolgreich aktualisiert!");
      })
      .catch((err) => {
        console.error("Fehler beim Speichern:", err);
        alert(`Fehler beim Aktualisieren: ${err.message}`);
      })
      .finally(() => {
        setSaving(false);
      });
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

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-4 d-flex flex-column align-items-center justify-content-center bg-dark text-white p-4">
            <div
              className="avatar-container position-relative"
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  avatarPreview ||
                  (avatarUrl && `http://localhost:8080${avatarUrl}`)
                }
                alt={username}
                className="img-fluid rounded-circle shadow-sm mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                onClick={handleAvatarClick}
                onError={(e) => {
                  console.log(
                    "Bild konnte nicht geladen werden:",
                    e.target.src
                  );
                  e.target.src =
                    "https://via.placeholder.com/150?text=Kein+Bild";
                }}
              />
              <div
                className="avatar-overlay position-absolute rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "150px",
                  height: "150px",
                  background: "rgba(0,0,0,0.5)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
                onClick={handleAvatarClick}
                onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseOut={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <span>Datei auswählen</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
              className="d-none"
            />
            <small className="text-muted d-block mt-2">
              Klicke auf das Bild, um ein neues Profilbild auszuwählen
            </small>
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
            <form onSubmit={handleProfileUpdate}></form>
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
