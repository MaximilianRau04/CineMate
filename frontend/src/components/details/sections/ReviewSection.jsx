import { useTranslation } from "../../../i18n/I18nContext";

const ReviewSection = ({ reviews, renderStars, reviewUsers }) => {
  const { t, formatDate } = useTranslation();

  const getUserName = (reviewId) => {
    const user = reviewUsers[reviewId];
    if (user) {
      return user.name || user.username || user.displayName || "—";
    }
    return t("common.loading");
  };

  return (
    <section className="cm-detail-section">
      <div className="cm-section-title">
        <h2>{t("reviews.title")}</h2>
        <span className="cm-count">{reviews?.length || 0}</span>
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="cm-review-grid">
          {reviews.map((review) => (
            <article key={review.id} className="cm-review">
              <header className="d-flex justify-content-between align-items-start gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="cm-avatar">
                    {String(getUserName(review.id)).slice(0, 2).toUpperCase()}
                  </span>
                  <strong>{getUserName(review.id)}</strong>
                </div>
                <span className="cm-mono small text-muted">
                  {formatDate(review.date || review.createdAt)}
                </span>
              </header>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="cm-stars">{renderStars(review.rating)}</span>
                <span className="cm-mono small text-primary">
                  {review.rating}/5
                </span>
              </div>
              {review.comment && <p className="mb-0">{review.comment}</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="cm-empty py-4">
          <p className="mb-0">{t("reviews.empty")}</p>
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
