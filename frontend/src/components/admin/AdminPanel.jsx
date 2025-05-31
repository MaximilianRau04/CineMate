import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUsers, FaFilm, FaTv, FaComments, FaChartBar,
  FaTrash, FaPlus, FaEdit, FaPlayCircle, FaArrowLeft
} from "react-icons/fa";

/**
 * A custom hook to handle API calls with token-based authentication.
 * It provides methods for GET, POST, PUT, and DELETE requests.
 * @returns 
 */
const useApi = () => {
  const token = localStorage.getItem("token");
  const baseURL = "http://localhost:8080/api";

  const apiCall = async (endpoint, options = {}) => {
    const url = `${baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };

  return {
    get: (endpoint) => apiCall(endpoint),
    post: (endpoint, data) => apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    put: (endpoint, data) => apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' })
  };
};

/**
 * A custom hook to manage application data.
 * @returns 
 */
const useAppData = () => {
  const [data, setData] = useState({
    movies: [],
    series: [],
    users: [],
    reviews: [],
    seasons: [],
    episodes: [],
    reviewUsers: {}
  });
  const [loading, setLoading] = useState(false);
  const api = useApi();

  // Load initial data from the API
  const loadData = async () => {
    setLoading(true);
    try {
      const [movies, series, users, reviews] = await Promise.all([
        api.get('/movies'),
        api.get('/series'),
        api.get('/users'),
        api.get('/reviews')
      ]);

      setData(prev => ({ ...prev, movies, series, users, reviews }));
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  /**
   * fetches seasons for a given series ID.
   * @param {*} seriesId 
   */
  const loadSeasons = async (seriesId) => {
    try {
      const seasons = await api.get(`/series/${seriesId}/seasons`);
      setData(prev => ({ ...prev, seasons }));
    } catch (error) {
      console.error("Error loading seasons:", error);
    }
  };

  /**
   * loads episodes for a given series ID and season number.
   * @param {*} seriesId 
   * @param {*} seasonNumber 
   */
  const loadEpisodes = async (seriesId, seasonNumber) => {
    try {
      const episodes = await api.get(`/series/${seriesId}/seasons/${seasonNumber}/episodes`);
      setData(prev => ({ ...prev, episodes }));
    } catch (error) {
      console.error("Error loading episodes:", error);
    }
  };

  return { data, setData, loading, loadData, loadSeasons, loadEpisodes, api };
};

// Formats a timestamp to a human-readable date string
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString('de-DE');
};

// Formats a timestamp for use in an input field
const formatDateForInput = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp));
  return date.toISOString().split('T')[0];
};

// Dashboard component to display summary statistics
const Dashboard = ({ data }) => (
  <div className="row">
    {[
      { title: "Benutzer gesamt", count: data.users.length, color: "primary", icon: FaUsers },
      { title: "Filme gesamt", count: data.movies.length, color: "success", icon: FaFilm },
      { title: "Serien gesamt", count: data.series.length, color: "info", icon: FaTv },
      { title: "Bewertungen gesamt", count: data.reviews.length, color: "warning", icon: FaComments }
    ].map(({ title, count, color, icon: Icon }, index) => (
      <div key={index} className="col-md-3 mb-4">
        <div className={`card bg-${color} text-white`}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{count}</h4>
                <p>{title}</p>
              </div>
              <Icon size={40} />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Table component to display content items (movies or series)
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

// Main content management component
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

// User management component to display and manage users
const UserManagement = ({ users }) => (
  <div>
    <h4 className="mb-4">Benutzerverwaltung</h4>
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Benutzername</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th>Registriert am</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{formatDate(user.joinedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// Moderation component to display and manage reviews
const Moderation = ({ reviews, reviewUsers, onDeleteReview }) => (
  <div>
    <h4 className="mb-4">Moderation</h4>
    <div className="card">
      <div className="card-header">
        <h5>Bewertungen & Kommentare</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Benutzer</th>
                <th>Bewertung</th>
                <th>Kommentar</th>
                <th>Datum</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id}>
                  <td>{reviewUsers[review.id]?.username || "Lädt..."}</td>
                  <td>
                    <span className="badge bg-warning">
                      {review.rating}/5 ⭐
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {review.comment}
                    </div>
                  </td>
                  <td>{formatDate(review.date)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteReview(review.id)}
                    >
                      <FaTrash /> Löschen
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

// Modal component for displaying forms and confirmation dialogs
const Modal = ({ series, title, children, onClose, onSave, saveText = "Speichern" }) => {
  if (!series) return null;

  return (
    <div className="modal series d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Abbrechen
            </button>
            {onSave && (
              <button type="button" className="btn btn-primary" onClick={onSave}>
                {saveText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Seasons management component to display and manage seasons of a series
const SeasonsManagement = ({ series, seasons, onAddSeason, onEditSeason, onDeleteSeason, onViewEpisodes, onBack }) => (
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

// Episodes management component to display and manage episodes of a season
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

// Form components for adding/editing content, seasons, and episodes
const SeasonForm = ({ season, onChange }) => (
  <div>
    <div className="mb-3">
      <label className="form-label">Staffel Nummer</label>
      <input
        type="number"
        className="form-control"
        value={season.seasonNumber || ''}
        onChange={(e) => onChange({ ...season, seasonNumber: parseInt(e.target.value) || '' })}
        min="1"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Trailer URL</label>
      <input
        type="url"
        className="form-control"
        value={season.trailerUrl || ''}
        onChange={(e) => onChange({ ...season, trailerUrl: e.target.value })}
      />
    </div>
  </div>
);

// Episode form component for adding/editing episodes
const EpisodeForm = ({ episode, onChange }) => (
  <div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Episode Nummer</label>
        <input
          type="number"
          className="form-control"
          value={episode.episodeNumber || ''}
          onChange={(e) => onChange({ ...episode, episodeNumber: parseInt(e.target.value) || '' })}
          min="1"
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Titel</label>
        <input
          type="text"
          className="form-control"
          value={episode.title || ''}
          onChange={(e) => onChange({ ...episode, title: e.target.value })}
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Beschreibung</label>
      <textarea
        className="form-control"
        rows="3"
        value={episode.description || ''}
        onChange={(e) => onChange({ ...episode, description: e.target.value })}
      />
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Dauer (z.B. 45m)</label>
        <input
          type="text"
          className="form-control"
          value={episode.duration || ''}
          onChange={(e) => onChange({ ...episode, duration: e.target.value })}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Erscheinungsdatum</label>
        <input
          type="date"
          className="form-control"
          value={episode.releaseDate || ''}
          onChange={(e) => onChange({ ...episode, releaseDate: e.target.value })}
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Poster URL</label>
      <input
        type="url"
        className="form-control"
        value={episode.posterUrl || ''}
        onChange={(e) => onChange({ ...episode, posterUrl: e.target.value })}
      />
    </div>
  </div>
);

// Content form component for adding/editing movies or series
const ContentForm = ({ content, onChange, genres }) => (
  <div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Typ</label>
        <select
          className="form-control"
          value={content.type || 'movie'}
          onChange={(e) => onChange({ ...content, type: e.target.value })}
        >
          <option value="movie">Film</option>
          <option value="series">Serie</option>
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Titel</label>
        <input
          type="text"
          className="form-control"
          value={content.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Beschreibung</label>
      <textarea
        className="form-control"
        rows="3"
        value={content.description || ''}
        onChange={(e) => onChange({ ...content, description: e.target.value })}
      />
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Genre</label>
        <select
          className="form-control"
          value={content.genre || ''}
          onChange={(e) => onChange({ ...content, genre: e.target.value })}
        >
          <option value="">Genre auswählen</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Land</label>
        <input
          type="text"
          className="form-control"
          value={content.country || ''}
          onChange={(e) => onChange({ ...content, country: e.target.value })}
        />
      </div>
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Erscheinungsdatum</label>
        <input
          type="date"
          className="form-control"
          value={content.releaseDate || ''}
          onChange={(e) => onChange({ ...content, releaseDate: e.target.value })}
        />
      </div>
      {content.type === "movie" && (
        <div className="col-md-6 mb-3">
          <label className="form-label">Dauer (z.B. 120m)</label>
          <input
            type="text"
            className="form-control"
            value={content.duration || ''}
            onChange={(e) => onChange({ ...content, duration: e.target.value })}
          />
        </div>
      )}
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Poster URL</label>
        <input
          type="url"
          className="form-control"
          value={content.posterUrl || ''}
          onChange={(e) => onChange({ ...content, posterUrl: e.target.value })}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Trailer URL</label>
        <input
          type="url"
          className="form-control"
          value={content.trailerUrl || ''}
          onChange={(e) => onChange({ ...content, trailerUrl: e.target.value })}
        />
      </div>
    </div>
  </div>
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data, setData, loading, loadData, loadSeasons, loadEpisodes, api } = useAppData();

  // Modal states
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    seasons: false,
    addSeason: false,
    editSeason: false,
    episodes: false,
    addEpisode: false,
    editEpisode: false
  });

  // Form states
  const [forms, setForms] = useState({
    newContent: {
      title: "", description: "", genre: "", releaseDate: "",
      type: "movie", duration: "", posterUrl: "", country: "", trailerUrl: ""
    },
    editingContent: null,
    selectedSeries: null,
    selectedSeason: null,
    newSeason: { seasonNumber: "", trailerUrl: "" },
    editingSeason: null,
    newEpisode: { episodeNumber: "", title: "", description: "", duration: "", releaseDate: "", posterUrl: "" },
    editingEpisode: null
  });

  const [viewMode, setViewMode] = useState('content'); 

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
    "Romance", "Science Fiction", "Thriller", "War", "Western"
  ];

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Handles adding new content (movie or series).
   */
  const handleAddContent = async () => {
    try {
      const endpoint = forms.newContent.type === "movie" ? "movies" : "series";
      const contentData = { ...forms.newContent };

      if (contentData.releaseDate) {
        contentData.releaseDate = new Date(contentData.releaseDate).getTime();
      }

      await api.post(`/${endpoint}`, contentData);
      await loadData();

      setModals(prev => ({ ...prev, add: false }));
      setForms(prev => ({
        ...prev,
        newContent: {
          title: "", description: "", genre: "", releaseDate: "",
          type: "movie", duration: "", posterUrl: "", country: "", trailerUrl: ""
        }
      }));
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };

  /**
   * Handles editing existing content (movie or series).
   * @param {*} content 
   * @param {*} type 
   */
  const handleEditContent = (content, type) => {
    setForms(prev => ({
      ...prev,
      editingContent: {
        ...content,
        type,
        releaseDate: formatDateForInput(content.releaseDate)
      }
    }));
    setModals(prev => ({ ...prev, edit: true }));
  };

  /**
   * Handles updating existing content (movie or series).
   */
  const handleUpdateContent = async () => {
    try {
      const { editingContent } = forms;
      const endpoint = editingContent.type === "movie" ? "movies" : "series";
      const contentData = { ...editingContent };

      if (contentData.releaseDate) {
        contentData.releaseDate = new Date(contentData.releaseDate).getTime();
      }

      await api.put(`/${endpoint}/${editingContent.id}`, contentData);
      await loadData();

      setModals(prev => ({ ...prev, edit: false }));
      setForms(prev => ({ ...prev, editingContent: null }));
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  /**
   * Handles deleting content (movie or series).
   * @param {*} id 
   * @param {*} type 
   */
  const handleDeleteContent = async (id, type) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Inhalt löschen möchten?")) return;

    try {
      const endpoint = type === "movie" ? "movies" : "series";
      await api.delete(`/${endpoint}/${id}`);
      await loadData();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  /**
   * Handles deleting a review.
   * @param {*} reviewId 
   */
  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      await loadData();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  /**
   * Handles viewing seasons of a series.
   * @param {*} series 
   */
  const handleSeriesSeasons = (series) => {
    setForms(prev => ({ ...prev, selectedSeries: series }));
    loadSeasons(series.id);
    setViewMode('seasons');
  };

  /**
   * Handles adding a new season to a series.
   */
  const handleAddSeason = async () => {
    try {
      const seasonData = { ...forms.newSeason };
      await api.post(`/series/${forms.selectedSeries.id}/seasons`, seasonData);
      await loadSeasons(forms.selectedSeries.id);

      setModals(prev => ({ ...prev, addSeason: false }));
      setForms(prev => ({ ...prev, newSeason: { seasonNumber: "", trailerUrl: "" } }));
    } catch (error) {
      console.error("Error adding season:", error);
    }
  };

  const handleEditSeason = (season) => {
    setForms(prev => ({ ...prev, editingSeason: { ...season } }));
    setModals(prev => ({ ...prev, editSeason: true }));
  };

  /**
   * Handles updating an existing season.
   */
  const handleUpdateSeason = async () => {
    try {
      const { editingSeason } = forms;
      await api.put(`/series/${forms.selectedSeries.id}/seasons/${editingSeason.seasonNumber}`, editingSeason);
      await loadSeasons(forms.selectedSeries.id);

      setModals(prev => ({ ...prev, editSeason: false }));
      setForms(prev => ({ ...prev, editingSeason: null }));
    } catch (error) {
      console.error("Error updating season:", error);
    }
  };

  /**
   * Handles deleting a season.
   * @param {*} seasonNumber 
   */
  const handleDeleteSeason = async (seasonNumber) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diese Staffel löschen möchten?")) return;

    try {
      await api.delete(`/series/${forms.selectedSeries.id}/seasons/${seasonNumber}`);
      await loadSeasons(forms.selectedSeries.id);
    } catch (error) {
      console.error("Error deleting season:", error);
    }
  };

  /**
   * handles viewing episodes of a season.
   * @param {*} season 
   */
  const handleViewEpisodes = (season) => {
    setForms(prev => ({ ...prev, selectedSeason: season }));
    loadEpisodes(forms.selectedSeries.id, season.seasonNumber);
    setViewMode('episodes');
  };

  /**
   * Handles adding a new episode to a season.
   */
  const handleAddEpisode = async () => {
    try {
      const episodeData = { ...forms.newEpisode };
      if (episodeData.releaseDate) {
        episodeData.releaseDate = new Date(episodeData.releaseDate).getTime();
      }

      await api.post(`/series/${forms.selectedSeries.id}/seasons/${forms.selectedSeason.seasonNumber}/episodes`, episodeData);
      await loadEpisodes(forms.selectedSeries.id, forms.selectedSeason.seasonNumber);

      setModals(prev => ({ ...prev, addEpisode: false }));
      setForms(prev => ({
        ...prev,
        newEpisode: { episodeNumber: "", title: "", description: "", duration: "", releaseDate: "", posterUrl: "" }
      }));
    } catch (error) {
      console.error("Error adding episode:", error);
    }
  };

  /**
   * Handles editing an existing episode.
   * @param {*} episode 
   */
  const handleEditEpisode = (episode) => {
    setForms(prev => ({
      ...prev,
      editingEpisode: {
        ...episode,
        releaseDate: formatDateForInput(episode.releaseDate)
      }
    }));
    setModals(prev => ({ ...prev, editEpisode: true }));
  };

  /**
   * Handles updating an existing episode.
   */
  const handleUpdateEpisode = async () => {
    try {
      const { editingEpisode } = forms;
      const episodeData = { ...editingEpisode };
      if (episodeData.releaseDate) {
        episodeData.releaseDate = new Date(episodeData.releaseDate).getTime();
      }

      await api.put(`/series/${forms.selectedSeries.id}/seasons/${forms.selectedSeason.seasonNumber}/episodes/${editingEpisode.episodeNumber}`, episodeData);
      await loadEpisodes(forms.selectedSeries.id, forms.selectedSeason.seasonNumber);

      setModals(prev => ({ ...prev, editEpisode: false }));
      setForms(prev => ({ ...prev, editingEpisode: null }));
    } catch (error) {
      console.error("Error updating episode:", error);
    }
  };

  /**
   * Handles deleting an episode.
   * @param {*} episodeNumber 
   */
  const handleDeleteEpisode = async (episodeNumber) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diese Episode löschen möchten?")) return;

    try {
      await api.delete(`/series/${forms.selectedSeries.id}/seasons/${forms.selectedSeason.seasonNumber}/episodes/${episodeNumber}`);
      await loadEpisodes(forms.selectedSeries.id, forms.selectedSeason.seasonNumber);
    } catch (error) {
      console.error("Error deleting episode:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5>Admin Panel</h5>
            </div>
            <div className="list-group list-group-flush">
              {[
                { key: 'dashboard', icon: FaChartBar, label: 'Dashboard' },
                { key: 'content', icon: FaFilm, label: 'Content Management' },
                { key: 'users', icon: FaUsers, label: 'Benutzerverwaltung' },
                { key: 'moderation', icon: FaComments, label: 'Moderation' }
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  className={`list-group-item list-group-item-action ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon className="me-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {activeTab === 'dashboard' && <Dashboard data={data} />}
          {activeTab === 'content' && viewMode === 'content' && (
            <ContentManagement
              data={data}
              onAdd={() => setModals(prev => ({ ...prev, add: true }))}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
              onSeriesSeasons={handleSeriesSeasons}
            />
          )}
          {activeTab === 'content' && viewMode === 'seasons' && (
            <SeasonsManagement
              series={forms.selectedSeries}
              seasons={data.seasons}
              onAddSeason={() => setModals(prev => ({ ...prev, addSeason: true }))}
              onEditSeason={handleEditSeason}
              onDeleteSeason={handleDeleteSeason}
              onViewEpisodes={handleViewEpisodes}
              onBack={() => setViewMode('content')}
            />
          )}
          {activeTab === 'content' && viewMode === 'episodes' && (
            <EpisodesManagement
              series={forms.selectedSeries}
              season={forms.selectedSeason}
              episodes={data.episodes}
              onAddEpisode={() => setModals(prev => ({ ...prev, addEpisode: true }))}
              onEditEpisode={handleEditEpisode}
              onDeleteEpisode={handleDeleteEpisode}
              onBack={() => setViewMode('seasons')}
            />
          )}
          {activeTab === 'users' && <UserManagement users={data.users} />}
          {activeTab === 'moderation' && (
            <Moderation
              reviews={data.reviews}
              reviewUsers={data.reviewUsers}
              onDeleteReview={handleDeleteReview}
            />
          )}
        </div>
      </div>

      {/* Modals for movies/series */}
      <Modal
        series={modals.add}
        title="Neuen Inhalt hinzufügen"
        onClose={() => setModals(prev => ({ ...prev, add: false }))}
        onSave={handleAddContent}
        saveText="Hinzufügen"
      >
        <ContentForm
          content={forms.newContent}
          onChange={(content) => setForms(prev => ({ ...prev, newContent: content }))}
          genres={genres}
        />
      </Modal>

      <Modal
        series={modals.edit}
        title={`${forms.editingContent?.type === "movie" ? "Film" : "Serie"} bearbeiten`}
        onClose={() => {
          setModals(prev => ({ ...prev, edit: false }));
          setForms(prev => ({ ...prev, editingContent: null }));
        }}
        onSave={handleUpdateContent}
      >
        {forms.editingContent && (
          <ContentForm
            content={forms.editingContent}
            onChange={(content) => setForms(prev => ({ ...prev, editingContent: content }))}
            genres={genres}
          />
        )}
      </Modal>

      {/* Season Modals */}
      <Modal
        series={modals.addSeason}
        title="Neue Staffel hinzufügen"
        onClose={() => setModals(prev => ({ ...prev, addSeason: false }))}
        onSave={handleAddSeason}
        saveText="Hinzufügen"
      >
        <SeasonForm
          season={forms.newSeason}
          onChange={(season) => setForms(prev => ({ ...prev, newSeason: season }))}
        />
      </Modal>

      <Modal
        series={modals.editSeason}
        title="Staffel bearbeiten"
        onClose={() => {
          setModals(prev => ({ ...prev, editSeason: false }));
          setForms(prev => ({ ...prev, editingSeason: null }));
        }}
        onSave={handleUpdateSeason}
      >
        {forms.editingSeason && (
          <SeasonForm
            season={forms.editingSeason}
            onChange={(season) => setForms(prev => ({ ...prev, editingSeason: season }))}
          />
        )}
      </Modal>

      {/* Episode Modals */}
      <Modal
        series={modals.addEpisode}
        title="Neue Episode hinzufügen"
        onClose={() => setModals(prev => ({ ...prev, addEpisode: false }))}
        onSave={handleAddEpisode}
        saveText="Hinzufügen"
      >
        <EpisodeForm
          episode={forms.newEpisode}
          onChange={(episode) => setForms(prev => ({ ...prev, newEpisode: episode }))}
        />
      </Modal>

      <Modal
        series={modals.editEpisode}
        title="Episode bearbeiten"
        onClose={() => {
          setModals(prev => ({ ...prev, editEpisode: false }));
          setForms(prev => ({ ...prev, editingEpisode: null }));
        }}
        onSave={handleUpdateEpisode}
      >
        {forms.editingEpisode && (
          <EpisodeForm
            episode={forms.editingEpisode}
            onChange={(episode) => setForms(prev => ({ ...prev, editingEpisode: episode }))}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminPanel;