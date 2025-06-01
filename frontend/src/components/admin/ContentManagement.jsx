import React from "react";
import { FaPlus, FaEdit, FaTrash, FaPlayCircle, FaArrowLeft } from "react-icons/fa";
import { formatDate } from "./adminConstants";

/**
 * Haupt-Content-Management-Komponente
 */
const ContentManagement = ({ data, onAdd, onEdit, onDelete, onSeriesSeasons }) => (
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

/**
 * Tabellen-Komponente für Content-Anzeige
 */
const ContentTable = ({ items, type, onEdit, onDelete, onSeriesSeasons }) => (
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          <th>Titel</th>
          <th>Genre</th>
          <th>Land</th>
          <th>Erscheinungsdatum</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {items
          .filter(item => item && item.id)
          .map((item, index) => (
            <tr key={`${type}-${item.id}-${index}`}>
              <td>{item.title}</td>
              <td>{item.genre}</td>
              <td>{item.country || 'N/A'}</td>
              <td>{formatDate(item.releaseDate)}</td>
              <td>
                {type === "series" && (
                  <button
                    className="btn btn-sm btn-outline-info me-2"
                    onClick={() => onSeriesSeasons(item)}
                  >
                    Staffeln
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEdit(item, type)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(item.id, type)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

/**
 * Staffeln-Management-Komponente
 */
const SeasonsManagement = ({ 
  series, 
  seasons, 
  onAddSeason, 
  onEditSeason, 
  onDeleteSeason, 
  onViewEpisodes, 
  onBack 
}) => (
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

/**
 * Episoden-Management-Komponente
 */
const EpisodesManagement = ({ 
  series, 
  season, 
  episodes, 
  onAddEpisode, 
  onEditEpisode, 
  onDeleteEpisode, 
  onBack 
}) => (
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
                <th>Titel</th>
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

/**
 * Hauptkomponente für die gesamte Content-Sektion
 * Verwaltet die Navigation zwischen Content, Seasons und Episodes
 */
const ContentSection = ({ 
  data, 
  viewMode, 
  setViewMode,
  forms,
  onContentAdd,
  onContentEdit,
  onContentDelete,
  onSeriesSeasons,
  onSeasonAdd,
  onSeasonEdit,
  onSeasonDelete,
  onEpisodesView,
  onEpisodeAdd,
  onEpisodeEdit,
  onEpisodeDelete
}) => {
  
  const handleBack = () => {
    if (viewMode === 'episodes') {
      setViewMode('seasons');
    } else if (viewMode === 'seasons') {
      setViewMode('content');
    }
    }
   return (
    <div className="content-section">
      {viewMode === 'content' && (
        <ContentManagement
          data={data}
          onAdd={onContentAdd}
          onEdit={onContentEdit}
          onDelete={onContentDelete}
          onSeriesSeasons={onSeriesSeasons}
        />
      )}
      {viewMode === 'seasons' && (
        <SeasonsManagement
          series={data.series.find(s => s.id === forms.currentSeriesId)}
          seasons={data.seasons}
          onAddSeason={onSeasonAdd}
          onEditSeason={onSeasonEdit}
          onDeleteSeason={onSeasonDelete}
          onViewEpisodes={onEpisodesView}
          onBack={handleBack}
        />
      )}
      {viewMode === 'episodes' && (
        <EpisodesManagement
          series={data.series.find(s => s.id === forms.currentSeriesId)}
          season={data.seasons.find(s => s.seasonNumber === forms.currentSeasonNumber)}
          episodes={data.episodes}
          onAddEpisode={onEpisodeAdd}
          onEditEpisode={onEpisodeEdit}
          onDeleteEpisode={onEpisodeDelete}
          onBack={handleBack}
        />
      )}
    </div>
    );
}

export default ContentSection;
