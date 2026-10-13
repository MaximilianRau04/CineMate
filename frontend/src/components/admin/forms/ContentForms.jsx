import { useTranslation } from "../../../i18n/I18nContext";
{
  /* ContentForm for movies and series*/
}
export const ContentForm = ({ content, onChange, genres }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.type")}</label>
          <select
            className="form-control"
            value={content.type || "movie"}
            onChange={(e) => onChange({ ...content, type: e.target.value })}
          >
            <option value="movie">{t("common.movie")}</option>
            <option value="series">{t("common.series")}</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.title")}</label>
          <input
            type="text"
            className="form-control"
            value={content.title || ""}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">{t("admin.fields.description")}</label>
        <textarea
          className="form-control"
          rows="3"
          value={content.description || ""}
          onChange={(e) =>
            onChange({ ...content, description: e.target.value })
          }
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.genre")}</label>
          <select
            className="form-control"
            value={content.genre || ""}
            onChange={(e) => onChange({ ...content, genre: e.target.value })}
          >
            <option value="">{t("admin.fields.selectGenre")}</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.country")}</label>
          <input
            type="text"
            className="form-control"
            value={content.country || ""}
            onChange={(e) => onChange({ ...content, country: e.target.value })}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.releaseDate")}</label>
          <input
            type="date"
            className="form-control"
            value={content.releaseDate || ""}
            onChange={(e) =>
              onChange({ ...content, releaseDate: e.target.value })
            }
          />
        </div>
        {content.type === "series" && (
          <div className="col-md-6 mb-3">
            <label className="form-label">{t("admin.fields.status")}</label>
            <select
              className="form-control"
              value={content.status || ""}
              onChange={(e) => onChange({ ...content, status: e.target.value })}
            >
              <option value="">{t("admin.fields.selectStatus")}</option>
              <option value="ONGOING">{t("details.status.ongoing")}</option>
              <option value="FINISHED">{t("details.status.finished")}</option>
              <option value="IN_PRODUCTION">
                {t("details.status.inProduction")}
              </option>
              <option value="CANCELLED">{t("details.status.cancelled")}</option>
              <option value="RETURNING">{t("details.status.returning")}</option>
            </select>
          </div>
        )}
        {content.type === "movie" && (
          <div className="col-md-6 mb-3">
            <label className="form-label">
              {t("admin.fields.durationMovie")}
            </label>
            <input
              type="text"
              className="form-control"
              value={content.duration || ""}
              onChange={(e) =>
                onChange({ ...content, duration: e.target.value })
              }
            />
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.posterUrl")}</label>
          <input
            type="url"
            className="form-control"
            value={content.posterUrl || ""}
            onChange={(e) =>
              onChange({ ...content, posterUrl: e.target.value })
            }
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.trailerUrl")}</label>
          <input
            type="url"
            className="form-control"
            value={content.trailerUrl || ""}
            onChange={(e) =>
              onChange({ ...content, trailerUrl: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

{
  /* SeasonForm*/
}
export const SeasonForm = ({ season, onChange }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-3">
        <label className="form-label">{t("admin.fields.seasonNumber")}</label>
        <input
          type="number"
          className="form-control"
          value={season.seasonNumber || ""}
          onChange={(e) =>
            onChange({
              ...season,
              seasonNumber: parseInt(e.target.value) || "",
            })
          }
          min="1"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">{t("admin.fields.trailerUrl")}</label>
        <input
          type="url"
          className="form-control"
          value={season.trailerUrl || ""}
          onChange={(e) => onChange({ ...season, trailerUrl: e.target.value })}
        />
      </div>
    </div>
  );
};

{
  /* EpisodeForm */
}
export const EpisodeForm = ({ episode, onChange }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            {t("admin.fields.episodeNumber")}
          </label>
          <input
            type="number"
            className="form-control"
            value={episode.episodeNumber || ""}
            onChange={(e) =>
              onChange({
                ...episode,
                episodeNumber: parseInt(e.target.value) || "",
              })
            }
            min="1"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.title")}</label>
          <input
            type="text"
            className="form-control"
            value={episode.title || ""}
            onChange={(e) => onChange({ ...episode, title: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">{t("admin.fields.description")}</label>
        <textarea
          className="form-control"
          rows="3"
          value={episode.description || ""}
          onChange={(e) =>
            onChange({ ...episode, description: e.target.value })
          }
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            {t("admin.fields.durationEpisode")}
          </label>
          <input
            type="text"
            className="form-control"
            value={episode.duration || ""}
            onChange={(e) => onChange({ ...episode, duration: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">{t("admin.fields.releaseDate")}</label>
          <input
            type="date"
            className="form-control"
            value={episode.releaseDate || ""}
            onChange={(e) =>
              onChange({ ...episode, releaseDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">{t("admin.fields.posterUrl")}</label>
        <input
          type="url"
          className="form-control"
          value={episode.posterUrl || ""}
          onChange={(e) => onChange({ ...episode, posterUrl: e.target.value })}
        />
      </div>
    </div>
  );
};
