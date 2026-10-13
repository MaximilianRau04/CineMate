import React from "react";
import StarInput from "../../common/StarInput";
import { useTranslation } from "../../../i18n/I18nContext";

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
  renderStars,
}) => {
  const { t } = useTranslation();

  if (!userId) return null;

  // If the user has already reviewed, show their review details
  if (reviewed) {
    return (
      <div className="cm-panel cm-my-review">
        <div className="cm-eyebrow mb-2">{t("reviews.yourReview")}</div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="cm-stars">{renderStars(rating)}</span>
          <span className="cm-mono text-primary">{rating}/5</span>
        </div>
        {comment && <p className="mb-3">“{comment}”</p>}
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary" onClick={onEdit}>
            <i className="bi bi-pencil me-1" />
            {t("common.edit")}
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
            <i className="bi bi-trash me-1" />
            {t("common.delete")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cm-panel">
      <h2 className="cm-panel-title">{t("reviews.rateTitle")}</h2>
      <StarInput
        value={rating}
        onChange={onRatingChange}
        label={t("reviews.rating")}
      />

      <div className="mt-3 mb-3" style={{ maxWidth: "620px" }}>
        <label htmlFor="comment" className="form-label">
          {t("reviews.commentOptional")}
        </label>
        <textarea
          id="comment"
          className="form-control"
          rows="3"
          placeholder={t("reviews.commentPlaceholder")}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={onSubmitReview}
        disabled={submitting || rating === 0 || submitSuccess}
      >
        {submitting
          ? t("common.saving")
          : submitSuccess
            ? t("reviews.saved")
            : t("reviews.submit")}
      </button>
    </div>
  );
};

export default RatingSection;
