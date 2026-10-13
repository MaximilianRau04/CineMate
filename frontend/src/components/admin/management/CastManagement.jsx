import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import PersonForm from "../forms/PersonForm";
import Modal from "../modals/Modal";
import PersonList from "../tables/PersonList";
import Filmography from "./Filmography";
import AssignmentForm from "../forms/AssignmentForm";
import { useToast } from "../../toasts";
import { useTranslation } from "../../../i18n/I18nContext";

const CastManagement = ({
  actors,
  directors,
  movies,
  series,
  api,
  assignActorToMovie,
  removeActorFromMovie,
  assignActorToSeries,
  removeActorFromSeries,
  assignDirectorToMovie,
  removeDirectorFromMovie,
  assignDirectorToSeries,
  removeDirectorFromSeries,
  loadData,
}) => {
  const { error: showError } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("actors");
  const [modals, setModals] = useState({
    addActor: false,
    editActor: false,
    addDirector: false,
    editDirector: false,
    assignActor: false,
    assignDirector: false,
    viewActorMovies: false,
    viewDirectorMovies: false,
  });

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [newActor, setNewActor] = useState({
    name: "",
    birthday: null,
    image: "",
    biography: "",
  });
  const [newDirector, setNewDirector] = useState({
    name: "",
    birthday: null,
    image: "",
    biography: "",
  });
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState("movie");
  const [actorFilmography, setActorFilmography] = useState({
    movies: [],
    series: [],
  });
  const [directorFilmography, setDirectorFilmography] = useState({
    movies: [],
    series: [],
  });
  const [filmographyLoading, setFilmographyLoading] = useState(false);

  /**
   * Fetches an actor's filmography (movies and series) from the API
   * @param {string} actorId
   */
  const fetchActorFilmography = async (actorId) => {
    try {
      setFilmographyLoading(true);
      const [movies, series] = await Promise.all([
        api.get(`/actors/${actorId}/movies`),
        api.get(`/actors/${actorId}/series`),
      ]);
      setActorFilmography({ movies, series });
    } catch (error) {
      console.error("Error fetching actor filmography:", error);
      showError(t("admin.cast.errors.filmography"));
      setActorFilmography({ movies: [], series: [] });
    } finally {
      setFilmographyLoading(false);
    }
  };

  /**
   * Fetches a director's filmography (movies and series) from the API
   * @param {string} directorId
   */
  const fetchDirectorFilmography = async (directorId) => {
    try {
      setFilmographyLoading(true);
      const [movies, series] = await Promise.all([
        api.get(`/directors/${directorId}/movies`),
        api.get(`/directors/${directorId}/series`),
      ]);
      setDirectorFilmography({ movies, series });
    } catch (error) {
      console.error("Error fetching director filmography:", error);
      showError(t("admin.cast.errors.filmography"));
      setDirectorFilmography({ movies: [], series: [] });
    } finally {
      setFilmographyLoading(false);
    }
  };

  /**
   * Handles adding a new actor
   * @returns {Promise<void>}
   */
  const handleAddActor = async () => {
    try {
      await api.post("/actors", newActor);
      await loadData();
      setModals((prev) => ({ ...prev, addActor: false }));
      setNewActor({ name: "", birthday: null, image: "", biography: "" });
    } catch (error) {
      console.error("Error adding actor:", error);
      showError(t("admin.cast.errors.addActor"));
    }
  };

  /**
   * Handles editing an existing actor
   * @param {*} actor
   * @returns {Promise<void>}
   */
  const handleEditActor = async (actor) => {
    try {
      await api.put(`/actors/${actor.id}`, actor);
      await loadData();
      setModals((prev) => ({ ...prev, editActor: false }));
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error updating actor:", error);
      showError(t("admin.cast.errors.updateActor"));
    }
  };

  /**
   * handles deleting an actor
   * @param {*} id
   * @returns {Promise<void>}
   */
  const handleDeleteActor = async (id) => {
    if (!window.confirm(t("admin.cast.confirmDeleteActor"))) return;

    try {
      await api.delete(`/actors/${id}`);
      await loadData();
    } catch (error) {
      console.error("Error deleting actor:", error);
      showError(t("admin.cast.errors.deleteActor"));
    }
  };

  /**
   * Handles adding a new director
   * @returns {Promise<void>}
   */
  const handleAddDirector = async () => {
    try {
      await api.post("/directors", newDirector);
      await loadData();
      setModals((prev) => ({ ...prev, addDirector: false }));
      setNewDirector({ name: "", birthday: null, image: "", biography: "" });
    } catch (error) {
      console.error("Error adding director:", error);
      showError(t("admin.cast.errors.addDirector"));
    }
  };

  /**
   * Handles editing an existing director
   * @param {*} director
   * @returns {Promise<void>}
   */
  const handleEditDirector = async (director) => {
    try {
      await api.put(`/directors/${director.id}`, director);
      await loadData();
      setModals((prev) => ({ ...prev, editDirector: false }));
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error updating director:", error);
      showError(t("admin.cast.errors.updateDirector"));
    }
  };

  /**
   * Handles deleting a director
   * @param {*} id
   * @returns {Promise<void>}
   */
  const handleDeleteDirector = async (id) => {
    if (!window.confirm(t("admin.cast.confirmDeleteDirector"))) return;

    try {
      await api.delete(`/directors/${id}`);
      await loadData();
    } catch (error) {
      console.error("Error deleting director:", error);
      showError(t("admin.cast.errors.deleteDirector"));
    }
  };

  /**
   * assigns an actor to a movie or series
   * @returns {Promise<void>}
   */
  const handleAssignActor = async () => {
    if (!selectedPerson || !selectedContent) return;

    try {
      const assigned =
        contentType === "movie"
          ? await assignActorToMovie(selectedContent.id, selectedPerson.id)
          : await assignActorToSeries(selectedContent.id, selectedPerson.id);

      if (!assigned) {
        showError(t("admin.cast.errors.assignActor"));
        return;
      }

      await loadData();
      setModals((prev) => ({ ...prev, assignActor: false }));
      setSelectedPerson(null);
      setSelectedContent(null);
    } catch (error) {
      console.error("Error assigning actor:", error);
      showError(t("admin.cast.errors.assignActor"));
    }
  };

  /**
   * removes an actor from a movie or series
   * @param {*} contentId
   * @param {*} actorId
   * @param {*} type
   * @returns {Promise<void>}
   */
  const handleRemoveActor = async (contentId, actorId, type) => {
    if (!window.confirm(t("admin.cast.confirmRemoveActor"))) return;

    try {
      const removed =
        type === "movie"
          ? await removeActorFromMovie(contentId, actorId)
          : await removeActorFromSeries(contentId, actorId);

      if (!removed) {
        showError(t("admin.cast.errors.removeActor"));
        return;
      }

      await loadData();
    } catch (error) {
      console.error("Error removing actor:", error);
      showError(t("admin.cast.errors.removeActor"));
    }
  };

  /**
   * assigns a director to a movie or series
   * @returns {Promise<void>}
   */
  const handleAssignDirector = async () => {
    if (!selectedPerson || !selectedContent) return;

    try {
      const assigned =
        contentType === "movie"
          ? await assignDirectorToMovie(selectedContent.id, selectedPerson.id)
          : await assignDirectorToSeries(selectedContent.id, selectedPerson.id);

      if (!assigned) {
        showError(t("admin.cast.errors.assignDirector"));
        return;
      }

      await loadData();
      setModals((prev) => ({ ...prev, assignDirector: false }));
      setSelectedPerson(null);
      setSelectedContent(null);
    } catch (error) {
      console.error("Error assigning director:", error);
      showError(t("admin.cast.errors.assignDirector"));
    }
  };
  /**
   * removes a director from a movie or series
   * @param {*} contentId
   * @param {*} directorId
   * @param {*} type
   * @returns {Promise<void>}
   */
  const handleRemoveDirector = async (contentId, directorId, type) => {
    if (!window.confirm(t("admin.cast.confirmRemoveDirector"))) return;

    try {
      const removed =
        type === "movie"
          ? await removeDirectorFromMovie(contentId, directorId)
          : await removeDirectorFromSeries(contentId, directorId);

      if (!removed) {
        showError(t("admin.cast.errors.removeDirector"));
        return;
      }

      await loadData();
    } catch (error) {
      console.error("Error removing director:", error);
      showError(t("admin.cast.errors.removeDirector"));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{t("admin.tabs.cast")}</h4>
        <div>
          {activeTab === "actors" && (
            <button
              className="btn btn-primary"
              onClick={() => setModals((prev) => ({ ...prev, addActor: true }))}
            >
              <FaPlus className="me-1" /> {t("admin.cast.addActor")}
            </button>
          )}
          {activeTab === "directors" && (
            <button
              className="btn btn-primary"
              onClick={() =>
                setModals((prev) => ({ ...prev, addDirector: true }))
              }
            >
              <FaPlus className="me-1" /> {t("admin.cast.addDirector")}
            </button>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "actors" ? "active" : ""}`}
            onClick={() => setActiveTab("actors")}
          >
            {t("admin.cast.actors")}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "directors" ? "active" : ""}`}
            onClick={() => setActiveTab("directors")}
          >
            {t("admin.cast.directors")}
          </button>
        </li>
      </ul>

      {/* Render actor or director list based on active tab */}
      {activeTab === "actors" && (
        <PersonList
          people={actors}
          personType="actor"
          onShowFilmography={(actor) => {
            setSelectedPerson(actor);
            fetchActorFilmography(actor.id);
            setModals((prev) => ({ ...prev, viewActorMovies: true }));
          }}
          onAssign={(actor) => {
            setSelectedPerson(actor);
            setModals((prev) => ({ ...prev, assignActor: true }));
          }}
          onEdit={(actor) => {
            setSelectedPerson(actor);
            setModals((prev) => ({ ...prev, editActor: true }));
          }}
          onDelete={handleDeleteActor}
        />
      )}

      {activeTab === "directors" && (
        <PersonList
          people={directors}
          personType="director"
          onShowFilmography={(director) => {
            setSelectedPerson(director);
            fetchDirectorFilmography(director.id);
            setModals((prev) => ({ ...prev, viewDirectorMovies: true }));
          }}
          onAssign={(director) => {
            setSelectedPerson(director);
            setModals((prev) => ({ ...prev, assignDirector: true }));
          }}
          onEdit={(director) => {
            setSelectedPerson(director);
            setModals((prev) => ({ ...prev, editDirector: true }));
          }}
          onDelete={handleDeleteDirector}
        />
      )}

      {/* Modals for adding/editing actors and directors, viewing filmography, and assigning */}
      <Modal
        show={modals.viewActorMovies}
        title={t("admin.cast.filmographyOf", {
          name: selectedPerson?.name || "",
        })}
        onClose={() => {
          setModals((prev) => ({ ...prev, viewActorMovies: false }));
          setSelectedPerson(null);
          setActorFilmography({ movies: [], series: [] });
        }}
      >
        {selectedPerson && (
          <Filmography
            person={selectedPerson}
            personType="actor"
            filmography={actorFilmography}
            isLoading={filmographyLoading}
            onRemove={handleRemoveActor}
          />
        )}
      </Modal>

      <Modal
        show={modals.viewDirectorMovies}
        title={t("admin.cast.filmographyOf", {
          name: selectedPerson?.name || "",
        })}
        onClose={() => {
          setModals((prev) => ({ ...prev, viewDirectorMovies: false }));
          setSelectedPerson(null);
          setDirectorFilmography({ movies: [], series: [] });
        }}
      >
        {selectedPerson && (
          <Filmography
            person={selectedPerson}
            personType="director"
            filmography={directorFilmography}
            isLoading={filmographyLoading}
            onRemove={handleRemoveDirector}
            onChangeDirector={(movie) => {
              setSelectedContent(movie);
              setContentType("movie");
              setModals((prev) => ({
                ...prev,
                viewDirectorMovies: false,
                assignDirector: true,
              }));
            }}
          />
        )}
      </Modal>

      <Modal
        show={modals.addActor}
        title={t("admin.cast.addActor")}
        onClose={() => setModals((prev) => ({ ...prev, addActor: false }))}
        onSave={handleAddActor}
      >
        <PersonForm person={newActor} onChange={setNewActor} />
      </Modal>

      <Modal
        show={modals.editActor}
        title={t("admin.cast.editActor")}
        onClose={() => {
          setModals((prev) => ({ ...prev, editActor: false }));
          setSelectedPerson(null);
        }}
        onSave={() => handleEditActor(selectedPerson)}
      >
        {selectedPerson && (
          <PersonForm person={selectedPerson} onChange={setSelectedPerson} />
        )}
      </Modal>

      <Modal
        show={modals.addDirector}
        title={t("admin.cast.addDirector")}
        onClose={() => setModals((prev) => ({ ...prev, addDirector: false }))}
        onSave={handleAddDirector}
      >
        <PersonForm person={newDirector} onChange={setNewDirector} />
      </Modal>

      <Modal
        show={modals.editDirector}
        title={t("admin.cast.editDirector")}
        onClose={() => {
          setModals((prev) => ({ ...prev, editDirector: false }));
          setSelectedPerson(null);
        }}
        onSave={() => handleEditDirector(selectedPerson)}
      >
        {selectedPerson && (
          <PersonForm person={selectedPerson} onChange={setSelectedPerson} />
        )}
      </Modal>

      <Modal
        show={modals.assignActor}
        title={t("admin.cast.assignActor")}
        onClose={() => {
          setModals((prev) => ({ ...prev, assignActor: false }));
          setSelectedPerson(null);
          setSelectedContent(null);
        }}
        onSave={handleAssignActor}
      >
        <AssignmentForm
          contentType={contentType}
          setContentType={setContentType}
          selectedContent={selectedContent}
          setSelectedContent={setSelectedContent}
          contents={contentType === "movie" ? movies : series}
          person={selectedPerson}
          personType="actor"
        />
      </Modal>

      <Modal
        show={modals.assignDirector}
        title={t("admin.cast.assignDirector")}
        onClose={() => {
          setModals((prev) => ({ ...prev, assignDirector: false }));
          setSelectedPerson(null);
          setSelectedContent(null);
        }}
        onSave={handleAssignDirector}
      >
        <AssignmentForm
          contentType={contentType}
          setContentType={setContentType}
          selectedContent={selectedContent}
          setSelectedContent={setSelectedContent}
          contents={contentType === "movie" ? movies : series}
          person={selectedPerson}
          personType="director"
        />
      </Modal>
    </div>
  );
};

export default CastManagement;
