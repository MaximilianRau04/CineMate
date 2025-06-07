import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingSection = ({
  userId,
  reviewed,
  rating,
  comment,
  submitting,
  submitSuccess,
  onRatingChange,
  onCommentChange,
  onSubmitReview,
  onEdit,
  onDelete,
  renderStars
}) => {
  const [hover, setHover] = useState(null);

  // Helper function to render stars (using the one passed as prop or fallback)
  const displayStars = renderStars || ((value) => (
    <span>
      {[1, 2, 3, 4, 5].map((star, i) => {
        if (value >= star) return <FaStar key={i} color="#ffc107" />;
        else if (value >= star - 0.5) return <FaStarHalfAlt key={i} color="#ffc107" />;
        else return <FaRegStar key={i} color="#e4e5e9" />;
      })}
    </span>
  ));

  if (!userId) return null;

  // === Falls bereits bewertet ===
  if (reviewed) {
    return (
      <div className="alert alert-info mt-4" style={{ maxWidth: '33%' }}>
        <h5>⭐ Deine bisherige Bewertung</h5>
        <p>
          Bewertung: {displayStars(rating)} ({rating}/5)
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
            onClick={onEdit}
          >
            ✏️ Bearbeiten
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={onDelete}
          >
            ❌ Löschen
          </button>
        </div>
      </div>
    );
  }

  // === Bewertungsformular ===
  return (
    <div className="mt-4">
      <h5 className="card-title mb-1 text-white">
        ⭐ Deine Bewertung
      </h5>
      <div className="d-flex mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="position-relative"
            style={{ fontSize: "32px", cursor: "pointer" }}
          >
            <span
              style={{ position: "absolute", width: "50%", height: "100%", left: 0 }}
              onClick={() => onRatingChange(star - 0.5)}
              onMouseEnter={() => setHover(star - 0.5)}
              onMouseLeave={() => setHover(null)}
            />
            <span
              style={{ position: "absolute", width: "50%", height: "100%", right: 0 }}
              onClick={() => onRatingChange(star)}
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

      <div className="mb-3" style={{ maxWidth: "500px" }}>
        <label htmlFor="comment" className="form-label text-white">
          Kommentar (optional):
        </label>
        <textarea
          id="comment"
          className="form-control border border-primary"
          rows="3"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
      </div>

      <div className="d-flex gap-2 mb-3">
        <button
          className="btn btn-primary"
          onClick={onSubmitReview}
          disabled={submitting || rating === 0 || submitSuccess}
        >
          {submitting
            ? "Wird gespeichert..."
            : submitSuccess
              ? "Bewertung gespeichert!"
              : "Bewertung abgeben"}
        </button>
      </div>
    </div>
  );
};

export default RatingSection;