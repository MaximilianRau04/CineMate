import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const EditReviewModal = ({
  showEditModal,
  rating,
  comment,
  submitting,
  onClose,
  onEditReview,
}) => {
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editHover, setEditHover] = useState(null);

  useEffect(() => {
    if (showEditModal) {
      setEditRating(rating);
      setEditComment(comment);
    }
  }, [showEditModal, rating, comment]);

  const handleSubmit = () => {
    onEditReview(editRating, editComment);
  };

  if (!showEditModal) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Bewertung bearbeiten</h5>
            <button type="button" className="btn-close" onClick={onClose} />
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
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting || editRating === 0}
            >
              {submitting ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReviewModal;
