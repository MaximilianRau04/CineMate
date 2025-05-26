import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUsers, FaFilm, FaTv, FaComments, FaChartBar, FaTrash, FaEdit, FaPlus, FaBan, FaCheck, FaTimes } from "react-icons/fa";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    genre: "",
    releaseDate: "",
    streamingPlatform: "",
    type: "movie"
  });

  const token = localStorage.getItem("token");

  const getUserRole = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (error) {
      return null;
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMovies(),
        loadTvShows(),
        loadUsers(),
        loadReviews(),
        loadAnalytics()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const loadMovies = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/movies", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(response.data);
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  };

  const loadTvShows = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/tvshows", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTvShows(response.data);
    } catch (error) {
      console.error("Error loading TV shows:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const handleAddContent = async () => {
    try {
      const endpoint = newContent.type === "movie" ? "movies" : "tvshows";
      await axios.post(`http://localhost:8080/api/admin/${endpoint}`, newContent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (newContent.type === "movie") {
        loadMovies();
      } else {
        loadTvShows();
      }
      
      setShowAddModal(false);
      setNewContent({
        title: "",
        description: "",
        genre: "",
        releaseDate: "",
        streamingPlatform: "",
        type: "movie"
      });
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };

  const handleDeleteContent = async (id, type) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Inhalt löschen möchten?")) return;
    
    try {
      const endpoint = type === "movie" ? "movies" : "tvshows";
      await axios.delete(`http://localhost:8080/api/admin/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (type === "movie") {
        loadMovies();
      } else {
        loadTvShows();
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${userId}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadUsers();
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const renderDashboard = () => (
    <div className="row">
      <div className="col-md-3 mb-4">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{analytics.totalUsers || 0}</h4>
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
                <h4>{analytics.totalMovies || 0}</h4>
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
                <h4>{analytics.totalTvShows || 0}</h4>
                <p>TV-Shows gesamt</p>
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
                <h4>{analytics.totalReviews || 0}</h4>
                <p>Bewertungen gesamt</p>
              </div>
              <FaComments size={40} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5>Beliebte Inhalte</h5>
          </div>
          <div className="card-body">
            <h6>Meistgesehene Filme:</h6>
            <ul className="list-unstyled">
              {analytics.popularMovies?.slice(0, 5).map((movie, index) => (
                <li key={index}>{movie.title} - {movie.views} Aufrufe</li>
              ))}
            </ul>
            <h6 className="mt-3">Meistgesehene TV-Shows:</h6>
            <ul className="list-unstyled">
              {analytics.popularTvShows?.slice(0, 5).map((show, index) => (
                <li key={index}>{show.title} - {show.views} Aufrufe</li>
              ))}
            </ul>
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
                      <th>Erscheinungsdatum</th>
                      <th>Plattform</th>
                      <th>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map(movie => (
                      <tr key={movie.id}>
                        <td>{movie.title}</td>
                        <td>{movie.genre}</td>
                        <td>{movie.releaseDate}</td>
                        <td>{movie.streamingPlatform}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => setEditingItem(movie)}
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
              <h5>TV-Shows</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Titel</th>
                      <th>Genre</th>
                      <th>Erscheinungsdatum</th>
                      <th>Plattform</th>
                      <th>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tvShows.map(show => (
                      <tr key={show.id}>
                        <td>{show.title}</td>
                        <td>{show.genre}</td>
                        <td>{show.releaseDate}</td>
                        <td>{show.streamingPlatform}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => setEditingItem(show)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteContent(show.id, "tvshow")}
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
                  <th>Status</th>
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
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${user.banned ? 'bg-danger' : 'bg-success'}`}>
                        {user.banned ? 'Gesperrt' : 'Aktiv'}
                      </span>
                    </td>
                    <td>
                      {!user.banned ? (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleBanUser(user.id)}
                        >
                          <FaBan /> Sperren
                        </button>
                      ) : (
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleBanUser(user.id)}
                        >
                          <FaCheck /> Entsperren
                        </button>
                      )}
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
                  <th>Inhalt</th>
                  <th>Bewertung</th>
                  <th>Kommentar</th>
                  <th>Datum</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id}>
                    <td>{review.username}</td>
                    <td>{review.contentTitle}</td>
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
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
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
      <div className="modal-dialog">
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
              <div className="mb-3">
                <label className="form-label">Typ</label>
                <select 
                  className="form-control"
                  value={newContent.type}
                  onChange={(e) => setNewContent({...newContent, type: e.target.value})}
                >
                  <option value="movie">Film</option>
                  <option value="tvshow">TV-Show</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Titel</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={newContent.title}
                  onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Beschreibung</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  value={newContent.description}
                  onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Genre</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={newContent.genre}
                  onChange={(e) => setNewContent({...newContent, genre: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Erscheinungsdatum</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={newContent.releaseDate}
                  onChange={(e) => setNewContent({...newContent, releaseDate: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Streaming-Plattform</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={newContent.streamingPlatform}
                  onChange={(e) => setNewContent({...newContent, streamingPlatform: e.target.value})}
                />
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
    </div>
  );
};

export default AdminPanel;