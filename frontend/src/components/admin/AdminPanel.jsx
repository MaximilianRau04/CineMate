import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChartBar, FaFilm, FaUsers, FaComments, FaUserTie, FaBell } from "react-icons/fa";

import { useAppData, formatDateForInput, genres as GENRES } from "./utils/utils";
import Dashboard from "./Dashboard";
import Moderation from "./management/Moderation";
import Modal from "./modals/Modal";
import { ContentManagement, SeasonsManagement, EpisodesManagement } from "./management/ContentManagement";
import UserManagement from "./management/UserManagement";
import CastManagement from "./management/CastManagement";
import StreamingProviderManagement from "./management/StreamingProviderManagement";
import AdminNotificationPanel from "./AdminNotificationPanel";

import { SeasonForm, EpisodeForm, ContentForm } from "./forms/ContentForms";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const {
    data,
    setData,
    loading,
    loadData,
    loadSeasons,
    loadEpisodes,
    api,
    assignActorToMovie,
    removeActorFromMovie,
    assignActorToSeries,
    removeActorFromSeries,
    assignDirectorToMovie,
    assignDirectorToSeries,
    removeDirectorFromSeries,
    deleteUser
  } = useAppData();

  // Modal states
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    addSeason: false,
    editSeason: false,
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

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Handles adding new content (movie or series).
   * @returns {Promise<void>}
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
   * @returns {void}
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
   * @returns {Promise<void>}
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
   * @returns {Promise<void>}
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
   * @returns {Promise<void>} 
   */
  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);

      setData(prev => {
        const newReviewUsers = { ...prev.reviewUsers };
        delete newReviewUsers[reviewId];
        return { ...prev, reviewUsers: newReviewUsers };
      });

      await loadData();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Series management handlers
  const handleSeriesSeasons = (series) => {
    setForms(prev => ({ ...prev, selectedSeries: series }));
    loadSeasons(series.id);
    setViewMode('seasons');
  };

  /**
   * Handles adding a new season to a series.
   * @return {Promise<void>}
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

  /**
   * Handles editing an existing season.
   * @param {*} season 
   * @return {void}
   */
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
   * @returns {Promise<void>}
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

  // Episode management handlers
  const handleViewEpisodes = (season) => {
    setForms(prev => ({ ...prev, selectedSeason: season }));
    loadEpisodes(forms.selectedSeries.id, season.seasonNumber);
    setViewMode('episodes');
  };

  /**
   * Handles adding a new episode to a season.
   * @returns {Promise<void>}
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
   * @returns {void} 
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
   * Handles updating an existing episode
   * @returns {Promise<void>}
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
   * @returns {Promise<void>}
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

  const handleDeleteUser = async (userId) => {
    deleteUser(userId);
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
                { key: 'moderation', icon: FaComments, label: 'Moderation' },
                { key: 'cast', icon: FaUserTie, label: 'Schauspieler & Regisseure' },
                { key: 'streaming', icon: FaFilm, label: 'Streaming-Anbieter' },
                { key: 'notifications', icon: FaBell, label: 'Benachrichtigungen' }
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

          {activeTab === 'users' &&
            <UserManagement
              users={data.users}
              onDeleteUser={handleDeleteUser}
            />}

          {activeTab === 'moderation' && (
            <Moderation
              reviews={data.reviews}
              reviewUsers={data.reviewUsers}
              onDeleteReview={handleDeleteReview}
            />
          )}

          {activeTab === 'cast' && (
            <CastManagement
              actors={data.actors}
              directors={data.directors}
              movies={data.movies}
              series={data.series}
              api={api}
              assignActorToMovie={assignActorToMovie}
              removeActorFromMovie={removeActorFromMovie}
              assignActorToSeries={assignActorToSeries}
              removeActorFromSeries={removeActorFromSeries}
              assignDirectorToMovie={assignDirectorToMovie}
              assignDirectorToSeries={assignDirectorToSeries}
              removeDirectorFromSeries={removeDirectorFromSeries}
              loadData={loadData}
            />
          )}

          {activeTab === 'streaming' && <StreamingProviderManagement />}

          {activeTab === 'notifications' && <AdminNotificationPanel />}
        </div>
      </div>

      {/* Modals for adding/editing movies, series, seasons and episodes */}
      <Modal
        show={modals.add}
        title="Neuen Inhalt hinzufügen"
        onClose={() => setModals(prev => ({ ...prev, add: false }))}
        onSave={handleAddContent}
        saveText="Hinzufügen"
      >
        <ContentForm
          content={forms.newContent}
          onChange={(content) => setForms(prev => ({ ...prev, newContent: content }))}
          genres={GENRES}
        />
      </Modal>

      <Modal
        show={modals.edit}
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
            genres={GENRES}
          />
        )}
      </Modal>

      <Modal
        show={modals.addSeason}
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
        show={modals.editSeason}
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

      <Modal
        show={modals.addEpisode}
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
        show={modals.editEpisode}
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