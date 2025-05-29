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
}) => {
  const [hover, setHover] = useState(null);

  if (!userId || reviewed) return null;

  return (
    <div className="mt-4">
      <h5 className="card-title mb-1 text-white">⭐ Deine Bewertung</h5>
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
              onClick={() => onRatingChange(star - 0.5)}
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

      <button
        className="btn btn-primary mb-3"
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
  );
};

export default RatingSection;
