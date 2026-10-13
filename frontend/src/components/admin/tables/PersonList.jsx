import { FaEdit, FaTrash, FaLink, FaFilm } from "react-icons/fa";
import { formatDate } from "../utils/utils";
import { useTranslation } from "../../../i18n/I18nContext";

const PersonList = ({
  people,
  personType,
  onShowFilmography,
  onAssign,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const labels = {
    actor: {
      empty: t("admin.cast.noActors"),
      filmography: t("admin.cast.showFilmography"),
      assign: t("admin.cast.assignActor"),
    },
    director: {
      empty: t("admin.cast.noDirectors"),
      filmography: t("admin.cast.showFilmography"),
      assign: t("admin.cast.assignDirector"),
    },
  };

  const label = labels[personType] || labels.actor;

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th width="60px">{t("admin.fields.image")}</th>
                <th>{t("admin.fields.name")}</th>
                <th>{t("admin.fields.birthday")}</th>
                <th>{t("admin.fields.biography")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id}>
                  <td>
                    {person.image && (
                      <img
                        src={person.image}
                        alt={person.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        className="rounded"
                      />
                    )}
                  </td>
                  <td>{person.name}</td>
                  <td>{formatDate(person.birthday)}</td>
                  <td>
                    <div
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {person.biography}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => onShowFilmography(person)}
                      title={label.filmography}
                    >
                      <FaFilm />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info me-1"
                      onClick={() => onAssign(person)}
                      title={label.assign}
                    >
                      <FaLink />
                    </button>
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => onEdit(person)}
                      title={t("common.edit")}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(person.id)}
                      title={t("common.delete")}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {people.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    {label.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonList;
