import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; import { FaUsers, FaFilm, FaTv, FaComments, FaChartBar, FaTrash, FaPlus, FaEdit, FaPlayCircle, FaArrowLeft } from "react-icons/fa";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [movies, setMovies] = useState([]);
  const [Series, setSeries] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSeasonsModal, setShowSeasonsModal] = useState(false);
  const [showAddSeasonModal, setShowAddSeasonModal] = useState(false);
  const [showEditSeasonModal, setShowEditSeasonModal] = useState(false);
  const [showAddEpisodeModal, setShowAddEpisodeModal] = useState(false);
  const [showEditEpisodeModal, setShowEditEpisodeModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [editingSeason, setEditingSeason] = useState(null);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    genre: "",
    releaseDate: "",
    type: "movie",
    duration: "",
    posterUrl: "",
    country: "",
    trailerUrl: ""
  });
  const [newSeason, setNewSeason] = useState({
    seasonNumber: "",
    trailerUrl: ""
  });
  const [newEpisode, setNewEpisode] = useState({
    title: "",
    episodeNumber: "",
    duration: "",
    releaseDate: "",
    description: "",
    posterUrl: ""
  });

  const token = localStorage.getItem("token");
  const [reviewUsers, setReviewUsers] = useState({});

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
    "Romance", "Science Fiction", "Thriller", "War", "Western"
  ];

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(parseInt(timestamp));
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(parseInt(timestamp));
    return date.toISOString().split('T')[0];
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMovies(),
        loadSeries(),
        loadUsers(),
        loadReviews(),
        loadSeasons(),
        loadEpisodes(),
        loadReviewUsers()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lade Benutzerdaten für alle Reviews
  const loadReviewUsers = async () => {
    const userPromises = reviews.map(async (review) => {
      if (!reviewUsers[review.id]) {
        const userData = await fetchReviewUser(review.id);
        return { reviewId: review.id, userData };
      }
      return null;
    });

    const results = await Promise.all(userPromises);
    const newUsers = {};

    results.forEach(result => {
      if (result && result.userData) {
        newUsers[result.reviewId] = result.userData;
      }
    });

    if (Object.keys(newUsers).length > 0) {
      setReviewUsers(prev => ({ ...prev, ...newUsers }));
    }

    if (reviews.length > 0) {
      loadReviewUsers();
    }
  };

  const loadMovies = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/movies", {
      });
      setMovies(response.data);
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  };

  const loadSeries = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/series", {
      });
      setSeries(response.data);
    } catch (error) {
      console.error("Error loading series:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users", {
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/reviews", {
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const loadSeasons = async (seriesId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/series/${seriesId}/seasons`);
      setSeasons(response.data);
    } catch (error) {
      console.error("Error loading seasons:", error);
    }
  };

  const loadEpisodes = async (seriesId, seasonNumber) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/series/${seriesId}/seasons/${seasonNumber}/episodes`);
      setEpisodes(response.data);
    } catch (error) {
      console.error("Error loading episodes:", error);
    }
  };

  /**
   * fetches user data for a specific review.
   * @param {*} reviewId 
   */
  const fetchReviewUser = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}/user`);

      if (!response.ok) {
        console.error(`API Fehler für Review ${reviewId}: ${response.status}`);
        return null;
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(`Fehler beim Laden des Benutzers für Review ${reviewId}:`, error);
      return null;
    }
  };

  const handleAddContent = async () => {
    try {
      const endpoint = newContent.type === "movie" ? "movies" : "series";
      const contentData = { ...newContent };

      // Konvertiere das Datum zu einem Timestamp wenn vorhanden
      if (contentData.releaseDate) {
        contentData.releaseDate = new Date(contentData.releaseDate).getTime();
      }

      await axios.post(`http://localhost:8080/api/${endpoint}`, contentData, {
      });

      if (newContent.type === "movie") {
        loadMovies();
      } else {
        loadSeries();
      }

      setShowAddModal(false);
      setNewContent({
        title: "",
        description: "",
        genre: "",
        releaseDate: "",
        type: "movie",
        duration: "",
        posterUrl: "",
        country: "",
        trailerUrl: ""
      });
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };

  const handleEditContent = (content, type) => {
    setEditingContent({
      ...content,
      type: type,
      releaseDate: formatDateForInput(content.releaseDate)
    });
    setShowEditModal(true);
  };

  const handleUpdateContent = async () => {
    try {
      const endpoint = editingContent.type === "movie" ? "movies" : "series";
      const contentData = { ...editingContent };

      // Konvertiere das Datum zu einem Timestamp wenn vorhanden
      if (contentData.releaseDate) {
        contentData.releaseDate = new Date(contentData.releaseDate).getTime();
      }

      await axios.put(`http://localhost:8080/api/${endpoint}/${editingContent.id}`, contentData, {
      });

      if (editingContent.type === "movie") {
        loadMovies();
      } else {
        loadSeries();
      }

      setShowEditModal(false);
      setEditingContent(null);
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleDeleteContent = async (id, type) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Inhalt löschen möchten?")) return;

    try {
      const endpoint = type === "movie" ? "movies" : "series";
      await axios.delete(`http://localhost:8080/api/${endpoint}/${id}`, {
      });

      if (type === "movie") {
        loadMovies();
      } else {
        loadSeries();
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };



  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleShowSeasons = (series) => {
    setSelectedSeries(series);
    loadSeasons(series.id);
    setShowSeasonsModal(true);
  };

  const handleShowEpisodes = (season) => {
    setSelectedSeason(season);
    loadEpisodes(selectedSeries.id, season.seasonNumber);
    setShowAddEpisodeModal(true);
    setShowEditSeasonModal(false);
  };

  const handleAddSeason = async () => {
    try {
      const seasonData = {
        ...newSeason,
        seasonNumber: parseInt(newSeason.seasonNumber)
      };

      await axios.post(`http://localhost:8080/api/series/${selectedSeries.id}/seasons`, seasonData);
      loadSeasons(selectedSeries.id);
      setShowAddSeasonModal(false);
      setNewSeason({ seasonNumber: "", trailerUrl: "" });
    } catch (error) {
      console.error("Error adding season:", error);
    }
  };

  const handleEditSeason = async (season) => {
    try {
      const seasonData = {
        ...season,
        seasonNumber: season.seasonNumber.toString(),
        trailerUrl: season.trailerUrl || ""
      };

      await axios.put(`http://localhost:8080/api/series/${selectedSeries.id}/seasons`, seasonData);
      loadSeasons(selectedSeries.id);
      setShowEditSeasonModal(false);
      setNewSeason({ seasonNumber: "", trailerUrl: "" });
    } catch (error) {
      console.error("Error adding season:", error);
    }
  };

  const handleDeleteSeason = async (seasonId) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diese Staffel löschen möchten?")) return;
    const seasonNumber = seasons.find(season => season.id === seasonId).seasonNumber;
    try {
      await axios.delete(`http://localhost:8080/api/series/${selectedSeries.id}/seasons/${seasonNumber}`,);
      loadSeasons(selectedSeries.id);
      setSeasons(seasons.filter(season => season.id !== seasonId));
    } catch (error) {
      console.error("Error deleting season:", error);
    }
  };

  const handleAddEpisode = async () => {
    try {
      const episodeData = {
        ...newEpisode,
        episodeNumber: parseInt(newEpisode.episodeNumber),
        releaseDate: newEpisode.releaseDate ? new Date(newEpisode.releaseDate).getTime() : null
      };

      await axios.post(`http://localhost:8080/api/series/${selectedSeries.id}/seasons/${selectedSeason.seasonNumber}/episodes/${episodeData.episodeNumber}`, episodeData);
      loadEpisodes(selectedSeries.id, selectedSeason.seasonNumber);
      setShowAddEpisodeModal(false);
      setNewEpisode({
        title: "",
        episodeNumber: "",
        duration: "",
        releaseDate: "",
        description: "",
        posterUrl: ""
      });
    } catch (error) {
      console.error("Error adding episode:", error);
    }
  };

  const handleEditEpisode = async (episode) => {
    try {
      const episodeData = {
        ...episode,
        episodeNumber: episode.episodeNumber.toString(),
        releaseDate: episode.releaseDate ? formatDateForInput(episode.releaseDate) : ""
      };
      await axios.put(`http://localhost:8080/api/series/${selectedSeries.id}/seasons/${selectedSeason.seasonNumber}/episodes/${episode.episodeNumber}`, episodeData);
      loadEpisodes(selectedSeries.id, selectedSeason.seasonNumber);
      setShowEditSeasonModal(false);
      setNewEpisode({
        title: "",
        episodeNumber: "",
        duration: "",
        releaseDate: "",
        description: "",
        posterUrl: ""
      });
    } catch (error) {
      console.error("Error editing episode:", error);
    }
  };

  const handleDeleteEpisode = async (episodeNumber) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diese Episode löschen möchten?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/series/${selectedSeries.id}/seasons/${selectedSeason.seasonNumber}/episodes/${episodeNumber}`,);
      loadEpisodes(selectedSeries.id, selectedSeason.seasonNumber);
      setEpisodes(episodes.filter(ep => ep.episodeNumber !== episodeNumber));
    } catch (error) {
      console.error("Error deleting episode:", error);
    }
  };

  const getUserName = (reviewId) => {
    const user = reviewUsers[reviewId];
    if (user) {
      return user.username || user.name || `Benutzer ${reviewId}`;
    }
    return "Lädt...";
  };

  const renderDashboard = () => (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{users.length}</h4>
                <p>Benutzer gesamt</p>
              </div>
              <FaUsers size={40} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card bg-success text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{movies.length}</h4>
                <p>Filme gesamt</p>
              </div>
              <FaFilm size={40} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card bg-info text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{Series.length}</h4>
                <p>Serien gesamt</p>
              </div>
              <FaTv size={40} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-4">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{reviews.length}</h4>
                <p>Bewertungen gesamt</p>
              </div>
              <FaComments size={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Content Management</h4>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
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
                    {movies.map(movie => (
                      <tr key={movie.id}>
                        <td>{movie.title}</td>
                        <td>{movie.genre}</td>
                        <td>{movie.country || 'N/A'}</td>
                        <td>{formatDate(movie.releaseDate)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditContent(movie, "movie")}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteContent(movie.id, "movie")}
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

          <div className="card">
            <div className="card-header">
              <h5>Serien</h5>
            </div>
            <div className="card-body">
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
                    {Series.map(series => (
                      <tr key={series.id}>
                        <td>{series.title}</td>
                        <td>{series.genre}</td>
                        <td>{series.country || 'N/A'}</td>
                        <td>{formatDate(series.releaseDate)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => handleShowSeasons(series)}
                          >
                            Staffeln
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditContent(series, "series")}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteContent(series.id, "series")}
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
      </div>
    </div>
  );

  const renderUserManagement = () => (
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
                  <th>Aktionen</th>
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

  const renderModeration = () => (
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
                    <td>{getUserName(review.id)}</td>
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
                        onClick={() => handleDeleteReview(review.id)}
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

  const renderAddModal = () => (
    <div className={`modal ${showAddModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Neuen Inhalt hinzufügen</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAddModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Typ</label>
                  <select
                    className="form-control"
                    value={newContent.type}
                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
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
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Beschreibung</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Genre</label>
                  <select
                    className="form-control"
                    value={newContent.genre}
                    onChange={(e) => setNewContent({ ...newContent, genre: e.target.value })}
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
                    value={newContent.country}
                    onChange={(e) => setNewContent({ ...newContent, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Erscheinungsdatum</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newContent.releaseDate}
                    onChange={(e) => setNewContent({ ...newContent, releaseDate: e.target.value })}
                  />
                </div>
                {newContent.type === "movie" && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Dauer (z.B. 120m)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newContent.duration}
                      onChange={(e) => setNewContent({ ...newContent, duration: e.target.value })}
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
                    value={newContent.posterUrl}
                    onChange={(e) => setNewContent({ ...newContent, posterUrl: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Trailer URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={newContent.trailerUrl}
                    onChange={(e) => setNewContent({ ...newContent, trailerUrl: e.target.value })}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddContent}
            >
              Hinzufügen
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditModal = () => (
    <div className={`modal ${showEditModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingContent?.type === "movie" ? "Film" : "Serie"} bearbeiten
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setShowEditModal(false);
                setEditingContent(null);
              }}
            ></button>
          </div>
          <div className="modal-body">
            {editingContent && (
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Titel</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingContent.title || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Land</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingContent.country || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, country: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Beschreibung</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editingContent.description || ""}
                    onChange={(e) => setEditingContent({ ...editingContent, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Genre</label>
                    <select
                      className="form-control"
                      value={editingContent.genre || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, genre: e.target.value })}
                    >
                      <option value="">Genre auswählen</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Erscheinungsdatum</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editingContent.releaseDate || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, releaseDate: e.target.value })}
                    />
                  </div>
                </div>

                {editingContent.type === "movie" && (
                  <div className="mb-3">
                    <label className="form-label">Dauer (z.B. 120m)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingContent.duration || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, duration: e.target.value })}
                    />
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Poster URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={editingContent.posterUrl || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, posterUrl: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Trailer URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={editingContent.trailerUrl || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, trailerUrl: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowEditModal(false);
                setEditingContent(null);
              }}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateContent}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeasonsModal = () => (
    <div className={`modal ${showSeasonsModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Staffeln verwalten - {selectedSeries?.title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setShowSeasonsModal(false);
                setSelectedSeries(null);
                setSeasons([]);
              }}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6>Staffeln</h6>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddSeasonModal(true)}
              >
                <FaPlus /> Staffel hinzufügen
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Staffel Nr.</th>
                    <th>Episoden</th>
                    <th>Trailer</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map(season => (
                    <tr key={season.id}>
                      <td>Staffel {season.seasonNumber}</td>
                      <td>
                        <span className="badge bg-info">
                          {season.episodes ? season.episodes.length : 0} Episoden
                        </span>
                      </td>
                      <td>
                        {season.trailerUrl && (
                          <a href={season.trailerUrl} target="_blank" rel="noopener noreferrer">
                            <FaPlayCircle className="text-primary" />
                          </a>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => {
                            setSelectedSeason(season);
                            loadEpisodes(selectedSeries.id, season.seasonNumber);
                          }}
                        >
                          Episoden
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditSeason(season)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteSeason(season.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedSeason && (
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>
                    <FaArrowLeft
                      className="me-2 text-primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedSeason(null)}
                    />
                    Episoden - Staffel {selectedSeason.seasonNumber}
                  </h6>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => setShowAddEpisodeModal(true)}
                  >
                    <FaPlus /> Episode hinzufügen
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Episode</th>
                        <th>Titel</th>
                        <th>Dauer</th>
                        <th>Erscheinungsdatum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {episodes.map(episode => (
                        <tr key={episode.episodeNumber}>
                          <td>E{episode.episodeNumber}</td>
                          <td>{episode.title}</td>
                          <td>{episode.duration}</td>
                          <td>{formatDate(episode.releaseDate)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEditEpisode(episode)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteEpisode(episode.id)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddSeasonModal = () => (
    <div className={`modal ${showAddSeasonModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Neue Staffel hinzufügen</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setShowAddSeasonModal(false);
                setNewSeason({ seasonNumber: "", trailerUrl: "" });
              }}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Staffel Nummer</label>
                <input
                  type="number"
                  className="form-control"
                  value={newSeason.seasonNumber}
                  onChange={(e) => setNewSeason({ ...newSeason, seasonNumber: e.target.value })}
                  min="1"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Trailer URL (optional)</label>
                <input
                  type="url"
                  className="form-control"
                  value={newSeason.trailerUrl}
                  onChange={(e) => setNewSeason({ ...newSeason, trailerUrl: e.target.value })}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowAddSeasonModal(false);
                setNewSeason({ seasonNumber: "", trailerUrl: "" });
              }}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddSeason}
            >
              Hinzufügen
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditSeasonModal = () => (
    <div className={`modal ${showEditSeasonModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Staffel bearbeiten</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setShowEditSeasonModal(false);
                setEditingSeason(null);
              }}
            ></button>
          </div>
          <div className="modal-body">
            {editingSeason && (
              <form>
                <div className="mb-3">
                  <label className="form-label">Staffel Nummer</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingSeason.seasonNumber}
                    onChange={(e) => setEditingSeason({ ...editingSeason, seasonNumber: e.target.value })}
                    min="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Trailer URL (optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    value={editingSeason.trailerUrl}
                    onChange={(e) => setEditingSeason({ ...editingSeason, trailerUrl: e.target.value })}
                  />
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowEditSeasonModal(false);
                setEditingSeason(null);
              }}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEditSeason}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddEpisodeModal = () => (
    <div className={`modal ${showAddEpisodeModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Neue Episode hinzufügen</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setShowAddEpisodeModal(false);
                setNewEpisode({ episodeNumber: "", title: "", duration: "", releaseDate: "", description: "", posterUrl: ""});
              }}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Episoden Nummer</label>
                <input
                  type="number"
                  className="form-control"
                  value={newEpisode.episodeNumber}
                  onChange={(e) => setNewEpisode({ ...newEpisode, episodeNumber: e.target.value })}
                  min="1"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Titel</label>
                <input
                  type="url"
                  className="form-control"
                  value={newEpisode.title}
                  onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Dauer</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEpisode.duration}
                  onChange={(e) => setNewEpisode({ ...newEpisode, duration: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Erscheinungsdatum</label>
                <input
                  type="date"
                  className="form-control"
                  value={newEpisode.releaseDate}
                  onChange={(e) => setNewEpisode({ ...newEpisode, releaseDate: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Beschreibung</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEpisode.description}
                  onChange={(e) => setNewEpisode({ ...newEpisode, description: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Poster URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={newEpisode.posterUrl}
                  onChange={(e) => setNewEpisode({ ...newEpisode, posterUrl: e.target.value })}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowAddEpisodeModal(false);
                setNewEpisode({ episodeNumber: "", title: "", duration: "", releaseDate: "", description: "", posterUrl: ""});
              }}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddEpisode}
            >
              Hinzufügen
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditEpisodeModal = () => (
    <div className={`modal ${showEditEpisodeModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Staffel bearbeiten</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                showEditEpisodeModal(false);
                setEditingEpisode(null);
              }}
            ></button>
          </div>
          <div className="modal-body">
            {editingEpisode && (
              <form>
                <div className="mb-3">
                  <label className="form-label">Episoden Nummer</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingEpisode.episodeNumber}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, episodeNumber: e.target.value })}
                    min="1"
                  />
                </div>
                <div className="mb-3">
                <label className="form-label">Titel</label>
                <input
                  type="url"
                  className="form-control"
                  value={editingEpisode.title}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Dauer</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingEpisode.duration}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, duration: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Erscheinungsdatum</label>
                <input
                  type="date"
                  className="form-control"
                  value={editingEpisode.releaseDate}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, releaseDate: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Beschreibung</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingEpisode.description}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, description: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Poster URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={editingEpisode.posterUrl}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, posterUrl: e.target.value })}
                />
              </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowEditEpisodeModal(false);
                setEditingEpisode(null);
              }}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEditEpisode}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <FaChartBar className="me-2" />
                Dashboard
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                <FaFilm className="me-2" />
                Content Management
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <FaUsers className="me-2" />
                Benutzerverwaltung
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'moderation' ? 'active' : ''}`}
                onClick={() => setActiveTab('moderation')}
              >
                <FaComments className="me-2" />
                Moderation
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'content' && renderContentManagement()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'moderation' && renderModeration()}
        </div>
      </div>

      {showAddModal && renderAddModal()}
      {showEditModal && renderEditModal()}
      {showSeasonsModal && renderSeasonsModal()}
      {showAddSeasonModal && renderAddSeasonModal()}
      {showEditSeasonModal && renderEditSeasonModal()}
      {showAddEpisodeModal && renderAddEpisodeModal()}
      {showEditEpisodeModal && renderEditEpisodeModal()}
    </div>
  );
};

export default AdminPanel;