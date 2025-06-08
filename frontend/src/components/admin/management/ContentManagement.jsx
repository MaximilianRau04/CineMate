import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaPlayCircle } from "react-icons/fa";
import { formatDate } from "../utils";
import ContentTable from "../content/ContentTable";

export const ContentManagement = ({ data, onAdd, onEdit, onDelete, onSeriesSeasons }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4>Content Management</h4>
      <button className="btn btn-primary" onClick={onAdd}>
        <FaPlus /> Inhalt hinzufügen
      </button>
    </div>

    <div className="row">
      <div className="col-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5>Filme</h5>
          </div>
          <div className="card-body">
            <ContentTable
              items={data.movies}
              type="movie"
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>Serien</h5>
          </div>
          <div className="card-body">
            <ContentTable
              items={data.series}
              type="series"
              onEdit={onEdit}
              onDelete={onDelete}
              onSeriesSeasons={onSeriesSeasons}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const EpisodesManagement = ({ series, season, episodes, onAddEpisode, onEditEpisode, onDeleteEpisode, onBack }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center">
        <button className="btn btn-outline-secondary me-3" onClick={onBack}>
          <FaArrowLeft /> Zurück zu Staffeln
        </button>
        <h4>Episoden - "{series.title}" Staffel {season.seasonNumber}</h4>
      </div>
      <button className="btn btn-primary" onClick={onAddEpisode}>
        <FaPlus /> Episode hinzufügen
      </button>
    </div>

    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Episode Nr.</th>
                <th>Titel</th>import { FaPlus } from "react-icons/fa";
                <th>Dauer</th>
                <th>Erscheinungsdatum</th>
                <th>Aktionen</th>
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
                      className="btn btn-sm btn-outline-primary me-2"
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

export const SeasonsManagement = ({ series, seasons, onAddSeason, onEditSeason, onDeleteSeason, onViewEpisodes, onBack }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center">
        <button className="btn btn-outline-secondary me-3" onClick={onBack}>
          <FaArrowLeft /> Zurück
        </button>
        <h4>Staffeln für "{series.title}"</h4>
      </div>
      <button className="btn btn-primary" onClick={onAddSeason}>
        <FaPlus /> Staffel hinzufügen
      </button>
    </div>

    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Staffel Nr.</th>
                <th>Episoden</th>
                <th>Trailer URL</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((season, index) => (
                <tr key={`season-${season.seasonNumber}-${index}`}>
                  <td>Staffel {season.seasonNumber}</td>
                  <td>{season.episodes?.length || 0} Episoden</td>
                  <td>
                    {season.trailerUrl ? (
                      <a href={season.trailerUrl} target="_blank" rel="noopener noreferrer">
                        <FaPlayCircle /> Trailer
                      </a>
                    ) : (
                      'Kein Trailer'
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => onViewEpisodes(season)}
                    >
                      Episoden
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
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