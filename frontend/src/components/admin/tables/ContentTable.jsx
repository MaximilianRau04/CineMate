import { FaTrash, FaEdit } from "react-icons/fa";
import { formatDate } from "../utils/utils";
import { useTranslation } from "../../../i18n/I18nContext";

const ContentTable = ({
  items,
  type,
  onEdit,
  onDelete,
  onSeriesSeasons,
  onManageStreaming,
}) => {
  const { t } = useTranslation();
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>{t("admin.fields.title")}</th>
            <th>{t("admin.fields.genre")}</th>
            <th>{t("admin.fields.country")}</th>
            <th>{t("admin.fields.releaseDate")}</th>
            <th>{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {items
            .filter((item) => item && item.id)
            .map((item, index) => (
              <tr key={`${type}-${item.id}-${index}`}>
                <td>{item.title}</td>
                <td>{item.genre}</td>
                <td>{item.country || "N/A"}</td>
                <td>{formatDate(item.releaseDate)}</td>
                <td>
                  {type === "series" && (
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => onSeriesSeasons(item)}
                    >
                      {t("seasons.title")}
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => onManageStreaming(item, type)}
                    title={t("admin.content.manageStreaming")}
                    aria-label={t("admin.content.manageStreaming")}
                  >
                    <i className="bi bi-tv"></i>
                  </button>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => onEdit(item, type)}
                    title={t("common.edit")}
                    aria-label={t("common.edit")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(item.id, type)}
                    title={t("common.delete")}
                    aria-label={t("common.delete")}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;
