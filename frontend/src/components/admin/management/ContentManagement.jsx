import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPlayCircle,
} from "react-icons/fa";
import { formatDate } from "../utils/utils";
import ContentTable from "../tables/ContentTable";
import { useTranslation } from "../../../i18n/I18nContext";

{
  /* ContentManagement for movies and series*/
}
export const ContentManagement = ({
  data,
  onAdd,
  onEdit,
  onDelete,
  onSeriesSeasons,
  onManageStreaming,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{t("admin.tabs.content")}</h4>
        <button className="btn btn-primary" onClick={onAdd}>
          <FaPlus className="me-1" /> {t("admin.content.addContent")}
        </button>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header">
              <h5>{t("common.movies")}</h5>
            </div>
            <div className="card-body">
              <ContentTable
                items={data.movies}
                type="movie"
                onEdit={onEdit}
                onDelete={onDelete}
                onManageStreaming={onManageStreaming}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5>{t("common.seriesPlural")}</h5>
            </div>
            <div className="card-body">
              <ContentTable
                items={data.series}
                type="series"
                onEdit={onEdit}
                onDelete={onDelete}
                onSeriesSeasons={onSeriesSeasons}
                onManageStreaming={onManageStreaming}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /* EpisodesManagement */
}
export const EpisodesManagement = ({
  series,
  season,
  episodes,
  onAddEpisode,
  onEditEpisode,
  onDeleteEpisode,
  onBack,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-secondary me-3" onClick={onBack}>
            <FaArrowLeft className="me-1" /> {t("admin.content.backToSeasons")}
          </button>
          <h4>
            {t("admin.content.episodesOf", {
              title: series.title,
              season: season.seasonNumber,
            })}
          </h4>
        </div>
        <button className="btn btn-primary" onClick={onAddEpisode}>
          <FaPlus className="me-1" /> {t("admin.content.addEpisode")}
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("admin.content.episodeNo")}</th>
                  <th>{t("admin.fields.title")}</th>
                  <th>{t("admin.fields.duration")}</th>
                  <th>{t("admin.fields.releaseDate")}</th>
                  <th>{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {episodes.map((episode, index) => (
                  <tr key={`episode-${episode.episodeNumber}-${index}`}>
                    <td>{episode.episodeNumber}</td>
                    <td>{episode.title}</td>
                    <td>{episode.duration}</td>
                    <td>{formatDate(episode.releaseDate)}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => onEditEpisode(episode)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteEpisode(episode.episodeNumber)}
                      >
                        <FaTrash />
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

{
  /* SeasonManagement*/
}
export const SeasonsManagement = ({
  series,
  seasons,
  onAddSeason,
  onEditSeason,
  onDeleteSeason,
  onViewEpisodes,
  onBack,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-secondary me-3" onClick={onBack}>
            <FaArrowLeft className="me-1" /> {t("common.back")}
          </button>
          <h4>{t("admin.content.seasonsOf", { title: series.title })}</h4>
        </div>
        <button className="btn btn-primary" onClick={onAddSeason}>
          <FaPlus className="me-1" /> {t("admin.content.addSeason")}
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("admin.content.seasonNo")}</th>
                  <th>{t("common.episodes")}</th>
                  <th>{t("admin.fields.trailerUrl")}</th>
                  <th>{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((season, index) => (
                  <tr key={`season-${season.seasonNumber}-${index}`}>
                    <td>
                      {t("common.season")} {season.seasonNumber}
                    </td>
                    <td>
                      {t("admin.content.episodeCount", {
                        count: season.episodes?.length || 0,
                      })}
                    </td>
                    <td>
                      {season.trailerUrl ? (
                        <a
                          href={season.trailerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaPlayCircle /> Trailer
                        </a>
                      ) : (
                        t("admin.content.noTrailer")
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-info me-2"
                        onClick={() => onViewEpisodes(season)}
                      >
                        {t("common.episodes")}
                      </button>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => onEditSeason(season)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteSeason(season.seasonNumber)}
                      >
                        <FaTrash />
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
