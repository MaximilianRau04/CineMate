import { FaUnlink, FaEdit } from "react-icons/fa";
import { useTranslation } from "../../../i18n/I18nContext";

const Filmography = ({
  person,
  personType,
  filmography,
  isLoading,
  onRemove,
  onChangeDirector,
}) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  const isDirector = personType === "director";

  return (
    <>
      <h5 className="mb-3">{t("common.movies")}</h5>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>{t("admin.fields.title")}</th>
              <th>{t("admin.fields.genre")}</th>
              <th>{t("admin.fields.releaseYear")}</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filmography.movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.genre}</td>
                <td>{new Date(movie.releaseDate).getFullYear()}</td>
                <td>
                  {isDirector ? (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onChangeDirector(movie)}
                      title={t("admin.cast.changeDirector")}
                    >
                      <FaEdit className="me-1" /> {t("admin.cast.change")}
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onRemove(movie.id, person.id, "movie")}
                      title={t("common.remove")}
                    >
                      <FaUnlink className="me-1" /> {t("common.remove")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filmography.movies.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  {t("admin.cast.noMovies")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h5 className="mt-4 mb-3">{t("common.seriesPlural")}</h5>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>{t("admin.fields.title")}</th>
              <th>{t("admin.fields.genre")}</th>
              <th>{t("admin.fields.releaseYear")}</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filmography.series.map((serie) => (
              <tr key={serie.id}>
                <td>{serie.title}</td>
                <td>{serie.genre}</td>
                <td>{new Date(serie.releaseDate).getFullYear()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onRemove(serie.id, person.id, "series")}
                    title={t("common.remove")}
                  >
                    <FaUnlink className="me-1" /> {t("common.remove")}
                  </button>
                </td>
              </tr>
            ))}
            {filmography.series.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  {t("admin.cast.noSeries")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Filmography;
