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

const MovieDetail = () => {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState(null);
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
  const [reviews, setReviews] = useState([]); 

  /**
   * fetches the currently logged in user from the API
   * @returns {Promise<void>}
   * @throws {Error} if the user could not be loaded
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
   * fetches the movie details from the API
   * @returns {Promise<void>}
   * @throws {Error} if the movie could not be loaded
   */
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/movies/${movieId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Film konnte nicht geladen werden");
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden des Films:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [movieId]);

  /**
   * checks if the movie is already in the user's watchlist
   * @returns {Promise<void>}
   * @throws {Error} if the watchlist could not be loaded
   */
  useEffect(() => {
    if (!userId || !movieId) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/movies`, {})
      .then((res) => res.json())
      .then((data) => {
        const alreadyInWatchlist = data.some((m) => m.id.toString() === movieId);
        setAdded(alreadyInWatchlist);
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));
  }, [userId, movieId]);

  /**
   * checks if the user has already reviewed the movie
   * @returns {Promise<void>}
   * @throws {Error} if the review could not be loaded
   */
  useEffect(() => {
    if (!userId || !movieId) return;

    fetch(`http://localhost:8080/api/reviews/movie/${movieId}/${userId}`, {})
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
  }, [userId, movieId]);

  /**
   * fetches all reviews for this movie
   * @returns {Promise<void>}
   * @throws {Error} if the reviews could not be loaded
   */
  useEffect(() => {
    if (!movieId) return;
    loadReviews();
  },);

  /**
   * adds the movie to the user's watchlist
   * @returns {Promise<void>}
   * @throws {Error} if the movie could not be added to the watchlist
   */
  const handleAddToWatchlist = () => {
    if (!userId || added) return;

    setAdding(true);
    fetch(`http://localhost:8080/api/users/${userId}/watchlist/movies/${movieId}`, {
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
   * fetches all reviews of a movie
   * @returns {Promise<void>}
   */
  const loadReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/movie/${movieId}`);
      if (!response.ok) throw new Error("Bewertungen konnten nicht geladen werden");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Fehler beim Laden der Bewertungen:", error);
    }
  };

  /**
   * adds a review to the movie
   * @returns {Promise<void>}
   * @throws {Error} if the review could not be added
   */
  const handleSubmitReview = () => {
    if (!userId || rating === 0) return;

    setSubmitting(true);
    fetch(`http://localhost:8080/api/reviews/movie/${movieId}/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        itemId: movieId,
        rating: rating,
        comment: comment,
        type: "movie",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Speichern der Bewertung");
        return res.json();
      })
      .then((data) => {
        setReviewed(true);
        setSubmitting(false);
        setSubmitSuccess(true);
        if (data && data.id) {
          setReviewId(data.id);
        }
   
        loadReviews();
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
        itemId: movieId,
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
        
        loadReviews();
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

        loadReviews();
      })
      .catch((err) => console.error("Fehler beim Löschen:", err));
  };

  /**
   * render star rating for movie
   * @param {*} rating
   * @returns {JSX.Element}
   */
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
      } else {
        stars.push(<FaRegStar key={i} color="#e4e5e9" />);
      }
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Film wird geladen...</p>
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

  if (!movie) return null;

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-4 text-center bg-dark text-white p-4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded shadow-sm mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
            <div className="small text-muted">Filmposter</div>
          </div>

          <div className="col-md-8 p-4">
            <h2 className="mb-3">{movie.title}</h2>

            <div className="mb-3">
              {movie.genre && (
                <span className="badge bg-primary me-2">{movie.genre}</span>
              )}
              {movie.duration && (
                <span className="badge bg-secondary me-2">
                  {movie.duration}
                </span>
              )}
              {movie.releaseYear && (
                <span className="badge bg-info text-dark">
                  {movie.releaseYear}
                </span>
              )}
            </div>

            <p className="text-muted mb-2">
              <strong>Bewertung:</strong> ⭐ {movie.rating.toFixed(1)}/5
            </p>

            {movie.description && (
              <div className="mb-4">
                <h5>📝 Beschreibung</h5>
                <p className="text-secondary">{movie.description}</p>
              </div>
            )}

            {/* Watchlist Actions */}
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
                  disabled={submitting || rating ===.0 || submitSuccess}
                >
                  {submitting
                    ? "Wird gespeichert..."
                    : submitSuccess
                    ? "Bewertung gespeichert!"
                    : "Bewertung abgeben"}
                </button>
              </div>
            )}
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

      {/* Reviews-Sektion */}
      {reviews && reviews.length > 0 && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-light">
            <h4 className="mb-0">📢 Nutzerbewertungen</h4>
          </div>
          <div className="card-body">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{review.user?.username || "Unbekannter Nutzer"}</strong>
                  <span className="text-muted" style={{ fontSize: "0.9em" }}>
                    {review.date 
                      ? new Date(review.date).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}) 
                      : new Date(review.createdAt).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="d-flex align-items-center">
                    {renderStars(review.rating)}
                    <span className="ms-2">({review.rating.toFixed(1)} / 5)</span>
                  </div>
                </div>
                {review.comment && <p className="mb-0">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews && reviews.length === 0 && (
        <div className="card mt-4 shadow-sm">
          <div className="card-body text-center py-4">
            <p className="text-muted mb-0">Noch keine Bewertungen für diesen Film.</p>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default MovieDetail;