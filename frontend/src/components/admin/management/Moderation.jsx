import { FaTrash } from "react-icons/fa";
import { formatDate } from "../utils/utils";
import { useTranslation } from "../../../i18n/I18nContext";

const Moderation = ({ reviews, reviewUsers, onDeleteReview }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h4 className="mb-4">Moderation</h4>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">{t("admin.moderation.title")}</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("statistics.user")}</th>
                  <th>{t("reviews.rating")}</th>
                  <th>{t("admin.moderation.comment")}</th>
                  <th>{t("admin.fields.date")}</th>
                  <th>{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      {reviewUsers[review.id]?.username || t("common.loading")}
                    </td>
                    <td>
                      <span className="badge bg-warning">
                        {review.rating}/5 ⭐
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {review.comment}
                      </div>
                    </td>
                    <td>{formatDate(review.date)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteReview(review.id)}
                      >
                        <FaTrash className="me-1" /> {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moderation;
