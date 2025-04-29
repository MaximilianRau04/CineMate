import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaPlus,
  FaCheck,
  FaArrowLeft,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

const SeriesDetail = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hover, setHover] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editHover, setEditHover] = useState(null);

  /**
   * fetches the currently logged in user from the API
   * @returns {Promise<void>}
   * @throws {Error} if the user is not logged in
   */
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) setUserId(data.id);
      })
      .catch((err) => console.error("Fehler beim Laden des Users:", err));
  }, []);

  /**
   * fetches the series details from the API
   * @returns {Promise<void>}
   * @throws {Error} if the series is not found
   */
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/series/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Serie konnte nicht geladen werden");
        return res.json();
      })
      .then((data) => {
        setSeries(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Serie:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  /**
   * checks if the series is already in the user's watchlist
   * @returns {Promise<void>}
   * @throws {Error} if the user is not logged in or the series is not found
   */
  useEffect(() => {
    if (!userId || !id) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/series`, {})
      .then((res) => res.json())
      .then((data) => {
        const alreadyInWatchlist = data.some((m) => m.id.toString() === id);
        setAdded(alreadyInWatchlist);
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));
  }, [userId, id]);

  /**
   * checks if the user has already reviewed the series
   * @returns {Promise<void>}
   * @throws {Error} if the user is not logged in or the series is not found
   */
  useEffect(() => {
    if (!userId || !id) return;

    fetch(`http://localhost:8080/api/reviews/series/${id}/${userId}`, {})
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error("Fehler beim Laden der Bewertung");
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setReviewed(true);
          setRating(data.rating);
          setComment(data.comment || "");
          setReviewId(data.id);
        }
      })
      .catch((err) => console.error("Fehler beim Prüfen der Bewertung:", err));
  }, [userId, id]);

  /**
   * adds the series to the user's watchlist
   * @returns {Promise<void>}
   * @throws {Error} if the user is not logged in or the series is already in the watchlist
   */
  const handleAddToWatchlist = () => {
    if (!userId || added) return;

    setAdding(true);
    fetch(`http://localhost:8080/api/users/${userId}/watchlist/series/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Hinzufügen zur Watchlist");
        return res.json();
      })
      .then(() => {
        setAdded(true);
        setAdding(false);
      })
      .catch((err) => {
        console.error(err);
        setAdding(false);
      });
  };

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  /**
   * adds a review to the movie
   * @returns {Promise<void>}
   * @throws {Error} if the user is not logged in or the rating is 0
   */
  const handleSubmitReview = () => {
    if (!userId || rating === 0) return;

    setSubmitting(true);
    fetch(`http://localhost:8080/api/reviews/series/${id}/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        itemId: id,
        rating: rating,
        comment: "",
        type: "series",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Speichern der Bewertung");
        return res.json();
      })
      .then(() => {
        setReviewed(true);
        setSubmitting(false);
        setSubmitSuccess(true);
      })
      .catch((err) => {
        console.error(err);
        setSubmitting(false);
      });
  };

  // Initialize edit values when opening the modal
  const handleOpenEditModal = () => {
    setEditRating(rating);
    setEditComment(comment);
    setShowEditModal(true);
  };

  /**
   * edits the review of the movie
   * @returns {Promise<void>}
   * @throws {Error} if the review could not be edited
   */
  const handleEditReview = () => {
    if (!userId || !reviewId) return;

    setSubmitting(true);

    fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        itemId: id,
        rating: editRating,
        comment: editComment,
        type: "movie",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Bearbeiten der Bewertung");
        return res.json();
      })
      .then(() => {
        setRating(editRating);
        setComment(editComment);
        setShowEditModal(false);
        setSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setSubmitting(false);
      });
  };

  /**
   * deletes the review of the movie
   * @returns {Promise<void>}
   * @throws {Error} if the review could not be deleted
   */
  const handleDeleteReview = () => {
    const confirmDelete = window.confirm(
      "Möchtest du deine Bewertung wirklich löschen?"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Löschen der Bewertung");
        setReviewed(false);
        setRating(0);
        setComment("");
        setReviewId(null);
      })
      .catch((err) => console.error("Fehler beim Löschen:", err));
  };

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Serie wird geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <Link to="/explore" className="btn btn-outline-secondary mt-3">
            <FaArrowLeft className="me-2" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  if (!series) return null;

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-4 text-center bg-dark text-white p-4">
            <img
              src={series.posterUrl}
              alt={series.title}
              className="img-fluid rounded shadow-sm mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
            <div className="small text-muted">Serienposter</div>
          </div>

          <div className="col-md-8 p-4">
            <h2 className="mb-3">{series.title}</h2>

            <div className="mb-3">
              {series.genre && (
                <span className="badge bg-primary me-2">{series.genre}</span>
              )}
              {series.releaseDate && (
                <span className="badge bg-info text-dark">
                  {new Date(series.releaseDate).getFullYear()}
                </span>
              )}
            </div>

            <p className="text-muted mb-2">
              <strong>Bewertung:</strong> ⭐ {series.rating.toFixed(1)}/5
            </p>

            {series.description && (
              <div className="mb-4">
                <h5>📝 Beschreibung</h5>
                <p className="text-secondary">{series.description}</p>
              </div>
            )}

            {userId && !added && (
              <button
                className="btn btn-success me-2"
                onClick={handleAddToWatchlist}
                disabled={adding}
              >
                {adding ? (
                  "Wird hinzugefügt..."
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Zur Watchlist hinzufügen
                  </>
                )}
              </button>
            )}

            {/* Rating Actions */}
            {userId && !reviewed && (
              <div className="mt-4">
                <h5>⭐ Deine Bewertung</h5>
                <div className="d-flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="position-relative"
                      style={{ fontSize: "32px", cursor: "pointer" }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          width: "50%",
                          height: "100%",
                          left: 0,
                        }}
                        onClick={() => handleRating(star - 0.5)}
                        onMouseEnter={() => setHover(star - 0.5)}
                        onMouseLeave={() => setHover(null)}
                      />
                      <span
                        style={{
                          position: "absolute",
                          width: "50%",
                          height: "100%",
                          right: 0,
                        }}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                      />

                      {(hover || rating) >= star ? (
                        <FaStar color="#ffc107" />
                      ) : (hover || rating) >= star - 0.5 ? (
                        <FaStarHalfAlt color="#ffc107" />
                      ) : (
                        <FaRegStar color="#e4e5e9" />
                      )}
                    </span>
                  ))}
                </div>

                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    Kommentar (optional):
                  </label>
                  <textarea
                    id="comment"
                    className="form-control"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleSubmitReview}
                  disabled={submitting || rating === 0 || submitSuccess}
                >
                  {submitting
                    ? "Wird gespeichert..."
                    : submitSuccess
                    ? "Bewertung gespeichert!"
                    : "Bewertung abgeben"}
                </button>
              </div>
            )}
            {/* previous rating */}
            {reviewed && (
              <div className="alert alert-info mt-4">
                <h5>⭐ Deine bisherige Bewertung</h5>
                <p>
                  Bewertung: {rating} / 5
                  {comment && (
                    <>
                      <br />
                      Kommentar: {comment}
                    </>
                  )}
                </p>
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleOpenEditModal}
                  >
                    ✏️ Bearbeiten
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleDeleteReview}
                  >
                    ❌ Löschen
                  </button>
                </div>
              </div>
            )}

            {added && (
              <div
                className="alert alert-success d-inline-flex align-items-center px-3 py-2 mt-2"
                role="alert"
              >
                <FaCheck className="me-2" />
                In deiner Watchlist!
              </div>
            )}

            <div className="mt-4">
              <Link to="/explore" className="btn btn-outline-primary">
                <FaArrowLeft className="me-2" />
                Zurück zur Übersicht
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bewertung bearbeiten</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <div className="modal-body">
                <label className="form-label">⭐ Bewertung:</label>
                <div className="d-flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="position-relative"
                      style={{ fontSize: "32px", cursor: "pointer" }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          width: "50%",
                          height: "100%",
                          left: 0,
                        }}
                        onClick={() => setEditRating(star - 0.5)}
                        onMouseEnter={() => setEditHover(star - 0.5)}
                        onMouseLeave={() => setEditHover(null)}
                      />
                      <span
                        style={{
                          position: "absolute",
                          width: "50%",
                          height: "100%",
                          right: 0,
                        }}
                        onClick={() => setEditRating(star)}
                        onMouseEnter={() => setEditHover(star)}
                        onMouseLeave={() => setEditHover(null)}
                      />
                      {(editHover || editRating) >= star ? (
                        <FaStar color="#ffc107" />
                      ) : (editHover || editRating) >= star - 0.5 ? (
                        <FaStarHalfAlt color="#ffc107" />
                      ) : (
                        <FaRegStar color="#e4e5e9" />
                      )}
                    </span>
                  ))}
                </div>

                <label htmlFor="editComment" className="form-label">
                  Kommentar (optional):
                </label>
                <textarea
                  id="editComment"
                  className="form-control"
                  rows="3"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleEditReview}
                  disabled={submitting}
                >
                  {submitting ? "Speichern..." : "Speichern"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* seasons and episodes */}
      {series.seasons && series.seasons.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4 text-light">📺 Staffeln und Episoden</h3>
          <div className="accordion" id="seasonsAccordion">
            {series.seasons.map((season, index) => (
              <div
                className="accordion-item bg-dark text-light"
                key={season.seasonNumber}
              >
                <h2
                  className="accordion-header"
                  id={`heading-${season.seasonNumber}`}
                >
                  <button
                    className="accordion-button collapsed bg-dark text-light"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${season.seasonNumber}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${season.seasonNumber}`}
                  >
                    Staffel {season.seasonNumber}
                  </button>
                </h2>
                <div
                  id={`collapse-${season.seasonNumber}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${season.seasonNumber}`}
                  data-bs-parent="#seasonsAccordion"
                >
                  <div className="accordion-body">
                    {season.episodes.map((episode) => (
                      <div
                        key={episode.episodeNumber}
                        className="row mb-4 align-items-center"
                      >
                        {/* episode poster */}
                        <div className="col-md-3 text-center">
                          <img
                            src={
                              episode.posterUrl ||
                              "https://via.placeholder.com/200x300?text=No+Image"
                            }
                            alt={episode.title}
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                          />
                        </div>

                        {/* episode Infos */}
                        <div className="col-md-9">
                          <h5 className="text-white">
                            Episode {episode.episodeNumber}: {episode.title}
                          </h5>
                          <p className="small text-light mb-1">
                            ⏱️ {episode.duration} | 📅{" "}
                            {new Date(episode.releaseDate).toLocaleDateString()}
                          </p>
                          <p className="text-secondary">
                            {episode.description}
                          </p>
                        </div>

                        <hr className="border-secondary my-3" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesDetail;
