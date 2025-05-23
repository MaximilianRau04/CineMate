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
  const [currentUser, setCurrentUser] = useState(null); 
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
  const [averageRating, setAverageRating] = useState(0);
  const [reviewUsers, setReviewUsers] = useState({}); 
  const [actors, setActors] = useState([]);
  const [director, setDirector] = useState(null);
  const [castLoading, setCastLoading] = useState(true);

  /**
   * fetches the currently logged in user from the API
   * @returns {Promise<void>}
   * @throws {Error} if the user could not be loaded
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Kein Token gefunden, Benutzer nicht eingeloggt");
      return;
    }

    fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data?.id) {
          setUserId(data.id);
          setCurrentUser(data); 
        }
      })
      .catch((err) => console.error("Fehler beim Laden des Users:", err));
  }, []);

  /**
   * fetches the movie details from the API
   * @returns {Promise<void>}
   * @throws {Error} if the movie could not be loaded
   */
  useEffect(() => {
    if (!movieId) return;

    setIsLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/movies/${movieId}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Film wurde nicht gefunden");
          }
          throw new Error(`Film konnte nicht geladen werden (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setAverageRating(data.rating || 0);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden des Films:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [movieId]);

  /**
   * fetches actors and director information for the movie
   * @returns {Promise<void>}
   */
  useEffect(() => {
    if (!movieId) return;

    setCastLoading(true);

    const fetchActors = fetch(`http://localhost:8080/api/movies/${movieId}/actors`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return [];
          throw new Error(`Schauspieler konnten nicht geladen werden (${res.status})`);
        }
        return res.json();
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Schauspieler:", err);
        return [];
      });

    const fetchDirector = fetch(`http://localhost:8080/api/movies/${movieId}/director`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error(`Regisseur konnte nicht geladen werden (${res.status})`);
        }
        return res.json();
      })
      .catch((err) => {
        console.error("Fehler beim Laden des Regisseurs:", err);
        return null;
      });

    // Wait for both requests to complete
    Promise.all([fetchActors, fetchDirector])
      .then(([actorsData, directorData]) => {
        setActors(actorsData || []);
        setDirector(directorData);
        setCastLoading(false);
      });
  }, [movieId]);

  /**
   * checks if the movie is already in the user's watchlist
   * @returns {Promise<void>}
   * @throws {Error} if the watchlist could not be loaded
   */
  useEffect(() => {
    if (!userId || !movieId) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/movies`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP-Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const alreadyInWatchlist = data.some(
          (m) => m.id.toString() === movieId.toString()
        );
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

    fetch(`http://localhost:8080/api/reviews/movie/${movieId}/user/${userId}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error(`Fehler beim Laden der Bewertung (${res.status})`);
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
  }, [movieId]); 

  /**
   * Fetches user data for a specific review
   * @param {number} reviewId - The review ID
   * @returns {Promise<Object|null>} User data or null if not found
   */
  const fetchReviewUser = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}/user`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Fehler beim Laden der Benutzerdaten (${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Fehler beim Laden des Benutzers für Review ${reviewId}:`, error);
      return null;
    }
  };

  /**
   * adds the movie to the user's watchlist
   * @returns {Promise<void>}
   * @throws {Error} if the movie could not be added to the watchlist
   */
  const handleAddToWatchlist = () => {
    if (!userId || added) return;

    setAdding(true);
    fetch(
      `http://localhost:8080/api/users/${userId}/watchlist/movies/${movieId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP-Error: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setAdded(true);
        setAdding(false);
      })
      .catch((err) => {
        console.error("Fehler beim Hinzufügen zur Watchlist:", err);
        setAdding(false);
      });
  };

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  /**
   * Calculates the new average rating based on reviews
   * @param {Array} reviews - Array of review objects
   * @returns {number} - The calculated average rating
   */
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  /**
   * fetches all reviews of a movie and updates the average rating
   * @returns {Promise<void>}
   */
  const loadReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/movie/${movieId}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setReviews([]);
          setAverageRating(0);
          return;
        }
        throw new Error(`Bewertungen konnten nicht geladen werden (${response.status})`);
      }
      const data = await response.json();
      setReviews(data);

      const userPromises = data.map(async (review) => {
        if (!reviewUsers[review.id]) {
          const userData = await fetchReviewUser(review.id);
          return { reviewId: review.id, userData };
        }
        return null;
      });

      const userResults = await Promise.all(userPromises);
      const newReviewUsers = { ...reviewUsers };

      userResults.forEach((result) => {
        if (result && result.userData) {
          newReviewUsers[result.reviewId] = result.userData;
        }
      });

      setReviewUsers(newReviewUsers);

      const newAverageRating = calculateAverageRating(data);
      setAverageRating(newAverageRating);

      if (movie) {
        setMovie(prevMovie => ({
          ...prevMovie,
          rating: newAverageRating,
        }));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Bewertungen:", error);
      setReviews([]);
    }
  };

  /**
   * adds a review to the movie
   * @returns {Promise<void>}
   * @throws {Error} if the review could not be added
   */
  const handleSubmitReview = async () => {
    if (!userId || rating === 0) return;

    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/movie/${movieId}/user/${userId}`, {
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
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Fehler beim Speichern der Bewertung: ${errorData}`);
      }

      const data = await response.json();
      setReviewed(true);
      setSubmitSuccess(true);

      if (data && data.id) {
        setReviewId(data.id);
      }

      await loadReviews();
    } catch (error) {
      console.error("Fehler beim Speichern der Bewertung:", error);
      alert(`Fehler: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
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
  const handleEditReview = async () => {
    if (!userId || !reviewId || editRating === 0) return;

    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
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
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Fehler beim Bearbeiten der Bewertung: ${errorData}`);
      }

      setRating(editRating);
      setComment(editComment);
      setShowEditModal(false);

      await loadReviews();
    } catch (error) {
      console.error("Fehler beim Bearbeiten der Bewertung:", error);
      alert(`Fehler: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * deletes the review of the movie
   * @returns {Promise<void>}
   * @throws {Error} if the review could not be deleted
   */
  const handleDeleteReview = async () => {
    const confirmDelete = window.confirm(
      "Möchtest du deine Bewertung wirklich löschen?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Löschen der Bewertung (${response.status})`);
      }

      setReviewed(false);
      setRating(0);
      setComment("");
      setReviewId(null);
      setSubmitSuccess(false);

      await loadReviews();
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      alert(`Fehler: ${error.message}`);
    }
  };

  /**
   * render star rating for movie
   * @param {number} rating
   * @returns {JSX.Element[]}
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

  /**
   * formats birthday timestamp to readable date
   * @param {number} timestamp - Birthday timestamp
   * @returns {string} - Formatted date or empty string
   */
  const formatBirthday = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  /**
   * Get username for a review based on cached user data
   * @param {Object} review - Review object
   * @returns {string} - Username to display
   */
  const getReviewUsername = (review) => {
    const reviewUserId = review.userId || review.user_id || review.authorId || review.author_id;

    if (currentUser && reviewUserId === currentUser.id) {
      return currentUser.username || "Du";
    }

    const userData = reviewUsers[review.id];
    if (userData && userData.username) {
      return userData.username;
    }

    if (reviewUserId) {
      return `Nutzer ${reviewUserId}`;
    }

    return "Unbekannter Nutzer";
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
              <strong>Bewertung:</strong>{" "}
              <span className="d-inline-flex align-items-center">
                {renderStars(averageRating)}
                <span className="ms-2">({averageRating.toFixed(1)}/5)</span>
                {reviews.length > 0 && (
                  <span className="ms-2 text-muted">
                    ({reviews.length} Bewertung{reviews.length !== 1 ? 'en' : ''})
                  </span>
                )}
              </span>
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

            {reviewed && (
              <div className="alert alert-info mt-4">
                <h5>⭐ Deine bisherige Bewertung</h5>
                <p>
                  Bewertung: {renderStars(rating)} ({rating}/5)
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

      {/* Cast and Crew Section */}
      <div className="mb-4 text-white">
        <h5>🎬 Besetzung & Crew</h5>

        {castLoading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-secondary" role="status" />
            <span className="ms-2 text-muted">Besetzung wird geladen...</span>
          </div>
        ) : (
          <>
            {/* Director Section */}
            {director && (
              <div className="mb-3" style={{ width: "fit-content", minWidth: "50%" }}>
                <h6 className="text-primary mb-2" style={{ fontSize: "1rem" }}>🎯 Regisseur</h6>
                <div className="card border-0 shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-2" style={{ minWidth: "80px", maxWidth: "80px" }}>
                      <img
                        src={director.image}
                        alt={director.name}
                        className="rounded-start"
                        style={{
                          height: "80px",
                          width: "80px",
                          objectFit: "cover",
                          flexShrink: 0
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x80?text=Kein+Bild";
                        }}
                      />
                    </div>
                    <div className="col-md-10">
                      <div className="card-body py-2 px-3">
                        <h6 className="card-title mb-1" style={{ fontSize: "0.9rem" }}>{director.name}</h6>
                        {director.birthday && (
                          <small className="text-muted">
                            Geboren: {formatBirthday(director.birthday)}
                          </small>
                        )}
                        {director.biography && (
                          <p className="card-text mt-1 mb-0" style={{ fontSize: "0.8rem", lineHeight: "1.3" }}>
                            {director.biography.length > 120
                              ? `${director.biography.substring(0, 120)}...`
                              : director.biography}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actors Section */}
            {actors && actors.length > 0 && (
              <div className="mb-3">
                <h6 className="text-primary mb-2" style={{ fontSize: "1rem" }}>🎭 Schauspieler ({actors.length})</h6>
                <div className="row">
                  {actors.slice(0, 6).map((actor) => (
                    <div key={actor.id} className="col-md-6 mb-2" style={{ width: "fit-content", minWidth: "25%" }}>
                      <div className="card border-0 shadow-sm h-100">
                        <div className="row g-0 h-100">
                          <div className="col-3" style={{ minWidth: "60px", maxWidth: "60px" }}>
                            <img
                              src={actor.image}
                              alt={actor.name}
                              className="rounded-start"
                              style={{
                                height: "70px",
                                width: "60px",
                                objectFit: "cover",
                                flexShrink: 0
                              }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/60x70?text=Kein+Bild";
                              }}
                            />
                          </div>
                          <div className="col-9">
                            <div className="card-body py-2 px-2">
                              <h6 className="card-title mb-1" style={{ fontSize: "0.85rem" }}>
                                {actor.name}
                              </h6>
                              {actor.birthday && (
                                <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>
                                  {formatBirthday(actor.birthday)}
                                </small>
                              )}
                              {actor.biography && (
                                <p className="card-text mt-1 mb-0" style={{ fontSize: "0.7rem", lineHeight: "1.2" }}>
                                  {actor.biography.length > 60
                                    ? `${actor.biography.substring(0, 60)}...`
                                    : actor.biography}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {actors.length > 6 && (
                  <div className="text-center">
                    <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                      und {actors.length - 6} weitere Schauspieler...
                    </small>
                  </div>
                )}
              </div>
            )}

            {!director && (!actors || actors.length === 0) && (
              <div className="text-center py-3">
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  Keine Informationen über Besetzung und Crew verfügbar.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-light">
            <h4 className="mb-0">📢 Nutzerbewertungen ({reviews.length})</h4>
          </div>
          <div className="card-body">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>
                    {getReviewUsername(review)}
                  </strong>
                  <span className="text-muted" style={{ fontSize: "0.9em" }}>
                    {review.date
                      ? new Date(review.date).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      : review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        : "Unbekanntes Datum"}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="d-flex align-items-center">
                    {renderStars(review.rating)}
                    <span className="ms-2">({review.rating}/5)</span>
                  </div>
                </div>
                {review.comment && <p className="mb-0">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(!reviews || reviews.length === 0) && (
        <div className="card mt-4 shadow-sm">
          <div className="card-body text-center py-4">
            <p className="text-muted mb-0">
              Noch keine Bewertungen für diesen Film.
            </p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
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
                  disabled={submitting || editRating === 0}
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