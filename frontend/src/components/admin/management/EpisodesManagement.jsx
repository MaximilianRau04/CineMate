import React from "react";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { formatDate } from "../utils/utils";

const EpisodesManagement = ({ series, season, episodes, onAddEpisode, onEditEpisode, onDeleteEpisode, onBack }) => (
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

export default EpisodesManagement;