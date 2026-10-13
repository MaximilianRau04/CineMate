import React, { useState, useEffect } from "react";
import StarInput from "../../common/StarInput";
import { useTranslation } from "../../../i18n/I18nContext";

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
  const { t } = useTranslation();

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
      style={{ backgroundColor: "rgba(8, 4, 10, 0.75)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("reviews.editTitle")}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label={t("common.close")}
            />
          </div>
          <div className="modal-body">
            <label className="form-label">{t("reviews.rating")}</label>
            <div className="mb-3">
              <StarInput
                value={editRating}
                onChange={setEditRating}
                label={t("reviews.rating")}
              />
            </div>

            <label htmlFor="editComment" className="form-label">
              {t("reviews.commentOptional")}
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
            <button className="btn btn-outline-secondary" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting || editRating === 0}
            >
              {submitting ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReviewModal;
