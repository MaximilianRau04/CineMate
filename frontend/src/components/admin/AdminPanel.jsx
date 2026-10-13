import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaChartBar,
  FaFilm,
  FaUsers,
  FaComments,
  FaUserTie,
  FaBell,
  FaCloudDownloadAlt,
} from "react-icons/fa";

import {
  useAppData,
  formatDateForInput,
  genres as GENRES,
} from "./utils/utils";
import Dashboard from "./Dashboard";
import Moderation from "./management/Moderation";
import Modal from "./modals/Modal";
import { LoadingSpinner } from "../explore/FilterPanel";
import {
  ContentManagement,
  SeasonsManagement,
  EpisodesManagement,
} from "./management/ContentManagement";
import UserManagement from "./management/UserManagement";
import CastManagement from "./management/CastManagement";
import StreamingProviderManagement from "./management/StreamingProviderManagement";
import StreamingAvailabilityManagement from "./management/StreamingAvailabilityManagement";
import AdminNotificationPanel from "./management/NotificationManagement";
import TmdbImport from "./management/TmdbImport";

import { SeasonForm, EpisodeForm, ContentForm } from "./forms/ContentForms";
import { useToast } from "../toasts";
import { useTranslation } from "../../i18n/I18nContext";

const AdminPanel = () => {
  const { error: showError } = useToast();
  const { t } = useTranslation();
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
    removeDirectorFromMovie,
    removeDirectorFromSeries,
    deleteUser,
  } = useAppData();

  // Modal states
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    addSeason: false,
    editSeason: false,
    addEpisode: false,
    editEpisode: false,
    manageStreaming: false,
  });

  // Form states
  const [forms, setForms] = useState({
    newContent: {
      title: "",
      description: "",
      genre: "",
      releaseDate: "",
      type: "movie",
      duration: "",
      posterUrl: "",
      country: "",
      trailerUrl: "",
    },
    editingContent: null,
    selectedSeries: null,
    selectedSeason: null,
    newSeason: { seasonNumber: "", trailerUrl: "" },
    editingSeason: null,
    newEpisode: {
      episodeNumber: "",
      title: "",
      description: "",
      duration: "",
      releaseDate: "",
      posterUrl: "",
    },
    editingEpisode: null,
    streamingManagementItem: null,
  });

  const [viewMode, setViewMode] = useState("content");

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

      setModals((prev) => ({ ...prev, add: false }));
      setForms((prev) => ({
        ...prev,
        newContent: {
          title: "",
          description: "",
          genre: "",
          releaseDate: "",
          type: "movie",
          duration: "",
          posterUrl: "",
          country: "",
          trailerUrl: "",
        },
      }));
    } catch (error) {
      console.error("Error adding content:", error);
      showError(t("admin.errors.addContent"));
    }
  };

  /**
   * Handles editing existing content (movie or series).
   * @param {*} content
   * @param {*} type
   * @returns {void}
   */
  const handleEditContent = (content, type) => {
    setForms((prev) => ({
      ...prev,
      editingContent: {
        ...content,
        type,
        releaseDate: formatDateForInput(content.releaseDate),
      },
    }));
    setModals((prev) => ({ ...prev, edit: true }));
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

      setModals((prev) => ({ ...prev, edit: false }));
      setForms((prev) => ({ ...prev, editingContent: null }));
    } catch (error) {
      console.error("Error updating content:", error);
      showError(t("admin.errors.updateContent"));
    }
  };

  /**
   * Handles deleting content (movie or series).
   * @param {*} id
   * @param {*} type
   * @returns {Promise<void>}
   */
  const handleDeleteContent = async (id, type) => {
    if (!window.confirm(t("admin.confirm.deleteContent"))) return;

    try {
      const endpoint = type === "movie" ? "movies" : "series";
      await api.delete(`/${endpoint}/${id}`);
      await loadData();
    } catch (error) {
      console.error("Error deleting content:", error);
      showError(t("admin.errors.deleteContent"));
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

      setData((prev) => {
        const newReviewUsers = { ...prev.reviewUsers };
        delete newReviewUsers[reviewId];
        return { ...prev, reviewUsers: newReviewUsers };
      });

      await loadData();
    } catch (error) {
      console.error("Error deleting review:", error);
      showError(t("admin.errors.deleteReview"));
    }
  };

  // Series management handlers
  const handleSeriesSeasons = (series) => {
    setForms((prev) => ({ ...prev, selectedSeries: series }));
    loadSeasons(series.id);
    setViewMode("seasons");
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

      setModals((prev) => ({ ...prev, addSeason: false }));
      setForms((prev) => ({
        ...prev,
        newSeason: { seasonNumber: "", trailerUrl: "" },
      }));
    } catch (error) {
      console.error("Error adding season:", error);
      showError(t("admin.errors.addSeason"));
    }
  };

  /**
   * Handles editing an existing season.
   * @param {*} season
   * @return {void}
   */
  const handleEditSeason = (season) => {
    setForms((prev) => ({ ...prev, editingSeason: { ...season } }));
    setModals((prev) => ({ ...prev, editSeason: true }));
  };

  /**
   * Handles updating an existing season.
   */
  const handleUpdateSeason = async () => {
    try {
      const { editingSeason } = forms;
      await api.put(
        `/series/${forms.selectedSeries.id}/seasons/${editingSeason.seasonNumber}`,
        editingSeason,
      );
      await loadSeasons(forms.selectedSeries.id);

      setModals((prev) => ({ ...prev, editSeason: false }));
      setForms((prev) => ({ ...prev, editingSeason: null }));
    } catch (error) {
      console.error("Error updating season:", error);
      showError(t("admin.errors.updateSeason"));
    }
  };

  /**
   * Handles deleting a season.
   * @param {*} seasonNumber
   * @returns {Promise<void>}
   */
  const handleDeleteSeason = async (seasonNumber) => {
    if (!window.confirm(t("admin.confirm.deleteSeason"))) return;

    try {
      await api.delete(
        `/series/${forms.selectedSeries.id}/seasons/${seasonNumber}`,
      );
      await loadSeasons(forms.selectedSeries.id);
    } catch (error) {
      console.error("Error deleting season:", error);
      showError(t("admin.errors.deleteSeason"));
    }
  };

  // Episode management handlers
  const handleViewEpisodes = (season) => {
    setForms((prev) => ({ ...prev, selectedSeason: season }));
    loadEpisodes(forms.selectedSeries.id, season.seasonNumber);
    setViewMode("episodes");
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

      await api.post(
        `/series/${forms.selectedSeries.id}/seasons/${forms.selectedSeason.seasonNumber}/episodes`,
        episodeData,
      );
      await loadEpisodes(
        forms.selectedSeries.id,
        forms.selectedSeason.seasonNumber,
      );

      setModals((prev) => ({ ...prev, addEpisode: false }));
      setForms((prev) => ({
        ...prev,
        newEpisode: {
          episodeNumber: "",
          title: "",
          description: "",
          duration: "",
          releaseDate: "",
          posterUrl: "",
        },
      }));
    } catch (error) {
      console.error("Error adding episode:", error);
      showError(t("admin.errors.addEpisode"));
    }
  };

  /**
   * Handles editing an existing episode.
   * @param {*} episode
   * @returns {void}
   */
  const handleEditEpisode = (episode) => {
    setForms((prev) => ({
      ...prev,
      editingEpisode: {
        ...episode,
        releaseDate: formatDateForInput(episode.releaseDate),
      },
    }));
    setModals((prev) => ({ ...prev, editEpisode: true }));
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

      await api.put(
        `/series/${forms.selectedSeries.id}/seasons/${forms.selectedSeason.seasonNumber}/episodes/${editingEpisode.episodeNumber}`,
        episodeData,
      );
      await loadEpisodes(
        forms.selectedSeries.id,
        forms.selectedSeason.seasonNumber,
      );

      setModals((prev) => ({ ...prev, editEpisode: false }));
      setForms((prev) => ({ ...prev, editingEpisode: null }));
    } catch (error) {
      console.error("Error updating episode:", error);
      showError(t("admin.errors.updateEpisode"));
    }
  };

  /**
   * Handles deleting an episode.
   * @param {*} episodeNumber
   * @returns {Promise<void>}
   */
  const handleDeleteEpisode = async (episodeNumber) => {
    if (!window.confirm(t("admin.confirm.deleteEpisode"))) return;

    try {
      await api.delete(
        `/series/${forms.selectedSeries.id}/seasons/${forms.selectedSeason.seasonNumber}/episodes/${episodeNumber}`,
      );
      await loadEpisodes(
        forms.selectedSeries.id,
        forms.selectedSeason.seasonNumber,
      );
    } catch (error) {
      console.error("Error deleting episode:", error);
      showError(t("admin.errors.deleteEpisode"));
    }
  };

  const handleDeleteUser = async (userId) => {
    const deleted = await deleteUser(userId);
    if (!deleted) {
      showError(t("admin.errors.deleteUser"));
    }
  };

  /**
   * Handles opening the streaming availability management for a media item
   * @param {*} item
   * @param {*} type
   */
  const handleManageStreaming = (item, type) => {
    setForms((prev) => ({
      ...prev,
      streamingManagementItem: {
        ...item,
        type: type === "series" ? "series" : "movie",
      },
    }));
    setModals((prev) => ({ ...prev, manageStreaming: true }));
  };

  if (loading) {
    return <LoadingSpinner message={t("admin.loading")} />;
  }

  return (
    <div className="container-fluid cm-page px-3 px-lg-4">
      <header className="cm-page-head">
        <div>
          <div className="cm-eyebrow">{t("admin.eyebrow")}</div>
          <h1>{t("admin.title")}</h1>
        </div>
      </header>
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card cm-admin-nav">
            <div className="list-group list-group-flush">
              {[
                {
                  key: "dashboard",
                  icon: FaChartBar,
                  label: t("admin.tabs.dashboard"),
                },
                {
                  key: "content",
                  icon: FaFilm,
                  label: t("admin.tabs.content"),
                },
                { key: "users", icon: FaUsers, label: t("admin.tabs.users") },
                {
                  key: "moderation",
                  icon: FaComments,
                  label: t("admin.tabs.moderation"),
                },
                {
                  key: "cast",
                  icon: FaUserTie,
                  label: t("admin.tabs.cast"),
                },
                {
                  key: "streaming",
                  icon: FaFilm,
                  label: t("admin.tabs.streaming"),
                },
                {
                  key: "notifications",
                  icon: FaBell,
                  label: t("admin.tabs.notifications"),
                },
                {
                  key: "tmdb",
                  icon: FaCloudDownloadAlt,
                  label: t("admin.tabs.tmdb"),
                },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  className={`list-group-item list-group-item-action ${activeTab === key ? "active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon className="me-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          {activeTab === "dashboard" && <Dashboard data={data} />}

          {activeTab === "content" && viewMode === "content" && (
            <ContentManagement
              data={data}
              onAdd={() => setModals((prev) => ({ ...prev, add: true }))}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
              onSeriesSeasons={handleSeriesSeasons}
              onManageStreaming={handleManageStreaming}
            />
          )}

          {activeTab === "content" && viewMode === "seasons" && (
            <SeasonsManagement
              series={forms.selectedSeries}
              seasons={data.seasons}
              onAddSeason={() =>
                setModals((prev) => ({ ...prev, addSeason: true }))
              }
              onEditSeason={handleEditSeason}
              onDeleteSeason={handleDeleteSeason}
              onViewEpisodes={handleViewEpisodes}
              onBack={() => setViewMode("content")}
            />
          )}

          {activeTab === "content" && viewMode === "episodes" && (
            <EpisodesManagement
              series={forms.selectedSeries}
              season={forms.selectedSeason}
              episodes={data.episodes}
              onAddEpisode={() =>
                setModals((prev) => ({ ...prev, addEpisode: true }))
              }
              onEditEpisode={handleEditEpisode}
              onDeleteEpisode={handleDeleteEpisode}
              onBack={() => setViewMode("seasons")}
            />
          )}

          {activeTab === "users" && (
            <UserManagement
              users={data.users}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === "moderation" && (
            <Moderation
              reviews={data.reviews}
              reviewUsers={data.reviewUsers}
              onDeleteReview={handleDeleteReview}
            />
          )}

          {activeTab === "cast" && (
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
              removeDirectorFromMovie={removeDirectorFromMovie}
              removeDirectorFromSeries={removeDirectorFromSeries}
              loadData={loadData}
            />
          )}

          {activeTab === "streaming" && <StreamingProviderManagement />}

          {activeTab === "notifications" && <AdminNotificationPanel />}

          {activeTab === "tmdb" && <TmdbImport />}
        </div>
      </div>

      {/* Modals for adding/editing movies, series, seasons and episodes */}
      <Modal
        show={modals.add}
        title={t("admin.modals.addContent")}
        onClose={() => setModals((prev) => ({ ...prev, add: false }))}
        onSave={handleAddContent}
        saveText={t("common.add")}
      >
        <ContentForm
          content={forms.newContent}
          onChange={(content) =>
            setForms((prev) => ({ ...prev, newContent: content }))
          }
          genres={GENRES}
        />
      </Modal>

      <Modal
        show={modals.edit}
        title={
          forms.editingContent?.type === "movie"
            ? t("admin.modals.editMovie")
            : t("admin.modals.editSeries")
        }
        onClose={() => {
          setModals((prev) => ({ ...prev, edit: false }));
          setForms((prev) => ({ ...prev, editingContent: null }));
        }}
        onSave={handleUpdateContent}
      >
        {forms.editingContent && (
          <ContentForm
            content={forms.editingContent}
            onChange={(content) =>
              setForms((prev) => ({ ...prev, editingContent: content }))
            }
            genres={GENRES}
          />
        )}
      </Modal>

      <Modal
        show={modals.addSeason}
        title={t("admin.modals.addSeason")}
        onClose={() => setModals((prev) => ({ ...prev, addSeason: false }))}
        onSave={handleAddSeason}
        saveText={t("common.add")}
      >
        <SeasonForm
          season={forms.newSeason}
          onChange={(season) =>
            setForms((prev) => ({ ...prev, newSeason: season }))
          }
        />
      </Modal>

      <Modal
        show={modals.editSeason}
        title={t("admin.modals.editSeason")}
        onClose={() => {
          setModals((prev) => ({ ...prev, editSeason: false }));
          setForms((prev) => ({ ...prev, editingSeason: null }));
        }}
        onSave={handleUpdateSeason}
      >
        {forms.editingSeason && (
          <SeasonForm
            season={forms.editingSeason}
            onChange={(season) =>
              setForms((prev) => ({ ...prev, editingSeason: season }))
            }
          />
        )}
      </Modal>

      <Modal
        show={modals.addEpisode}
        title={t("admin.modals.addEpisode")}
        onClose={() => setModals((prev) => ({ ...prev, addEpisode: false }))}
        onSave={handleAddEpisode}
        saveText={t("common.add")}
      >
        <EpisodeForm
          episode={forms.newEpisode}
          onChange={(episode) =>
            setForms((prev) => ({ ...prev, newEpisode: episode }))
          }
        />
      </Modal>

      <Modal
        show={modals.editEpisode}
        title={t("admin.modals.editEpisode")}
        onClose={() => {
          setModals((prev) => ({ ...prev, editEpisode: false }));
          setForms((prev) => ({ ...prev, editingEpisode: null }));
        }}
        onSave={handleUpdateEpisode}
      >
        {forms.editingEpisode && (
          <EpisodeForm
            episode={forms.editingEpisode}
            onChange={(episode) =>
              setForms((prev) => ({ ...prev, editingEpisode: episode }))
            }
          />
        )}
      </Modal>

      {/* Streaming Availability Management Modal */}
      {modals.manageStreaming && forms.streamingManagementItem && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <StreamingAvailabilityManagement
                mediaId={forms.streamingManagementItem.id}
                mediaType={forms.streamingManagementItem.type}
                mediaTitle={forms.streamingManagementItem.title}
                onClose={() => {
                  setModals((prev) => ({ ...prev, manageStreaming: false }));
                  setForms((prev) => ({
                    ...prev,
                    streamingManagementItem: null,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
