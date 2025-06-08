import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaLink, FaUnlink, FaFilm, FaEye } from "react-icons/fa";
import { formatDate } from "../utils";
import PersonForm from "../content/PersonForm";
import Modal from "../modals/Modal";

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
  loadData
}) => {
  const [activeTab, setActiveTab] = useState("actors");
  const [modals, setModals] = useState({
    addActor: false,
    editActor: false,
    addDirector: false,
    editDirector: false,
    assignActor: false,
    assignDirector: false,
    viewActorMovies: false,
    viewDirectorMovies: false
  });

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [newActor, setNewActor] = useState({ name: "", birthday: null, image: "", biography: "" });
  const [newDirector, setNewDirector] = useState({ name: "", birthday: null, image: "", biography: "" });
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState('movie');
  const [actorFilmography, setActorFilmography] = useState({ movies: [], series: [] });
  const [directorFilmography, setDirectorFilmography] = useState({ movies: [], series: [] });
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
        api.get(`/actors/${actorId}/series`)
      ]);
      setActorFilmography({ movies, series });
    } catch (error) {
      console.error("Error fetching actor filmography:", error);
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
        api.get(`/directors/${directorId}/series`)
      ]);
      setDirectorFilmography({ movies, series });
    } catch (error) {
      console.error("Error fetching director filmography:", error);
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
      await api.post('/actors', newActor);
      await loadData();
      setModals(prev => ({ ...prev, addActor: false }));
      setNewActor({ name: "", birthday: null, image: "", biography: "" });
    } catch (error) {
      console.error("Error adding actor:", error);
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
      setModals(prev => ({ ...prev, editActor: false }));
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error updating actor:", error);
    }
  };

  /**
   * handles deleting an actor
   * @param {*} id 
   * @returns {Promise<void>}
   */
  const handleDeleteActor = async (id) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Schauspieler löschen möchten?")) return;

    try {
      await api.delete(`/actors/${id}`);
      await loadData();
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };

  /**
   * Handles adding a new director
   * @returns {Promise<void>}
   */
  const handleAddDirector = async () => {
    try {
      await api.post('/directors', newDirector);
      await loadData();
      setModals(prev => ({ ...prev, addDirector: false }));
      setNewDirector({ name: "", birthday: null, image: "", biography: "" });
    } catch (error) {
      console.error("Error adding director:", error);
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
      setModals(prev => ({ ...prev, editDirector: false }));
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error updating director:", error);
    }
  };

  /**
   * Handles deleting a director
   * @param {*} id 
   * @returns {Promise<void>} 
   */
  const handleDeleteDirector = async (id) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Regisseur löschen möchten?")) return;

    try {
      await api.delete(`/directors/${id}`);
      await loadData();
    } catch (error) {
      console.error("Error deleting director:", error);
    }
  };

  /**
   * assigns an actor to a movie or series
   * @returns {Promise<void>}
   */
  const handleAssignActor = async () => {
    if (!selectedPerson || !selectedContent) return;

    try {
      if (contentType === 'movie') {
        await assignActorToMovie(selectedContent.id, selectedPerson.id);
      } else {
        await assignActorToSeries(selectedContent.id, selectedPerson.id);
      }
      await loadData();
      setModals(prev => ({ ...prev, assignActor: false }));
      setSelectedPerson(null);
      setSelectedContent(null);
    } catch (error) {
      console.error("Error assigning actor:", error);
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
    if (!window.confirm("Möchten Sie diesen Schauspieler entfernen?")) return;

    try {
      if (type === 'movie') {
        await removeActorFromMovie(contentId, actorId);
      } else {
        await removeActorFromSeries(contentId, actorId);
      }
      await loadData();
    } catch (error) {
      console.error("Error removing actor:", error);
    }
  };

  /**
   * assigns a director to a movie or series
   * @returns {Promise<void>}
   */
  const handleAssignDirector = async () => {
    if (!selectedPerson || !selectedContent) return;

    try {
      if (contentType === 'movie') {
        await assignDirectorToMovie(selectedContent.id, selectedPerson.id);
      } else {
        await assignDirectorToSeries(selectedContent.id, selectedPerson.id);
      }
      await loadData();
      setModals(prev => ({ ...prev, assignDirector: false }));
      setSelectedPerson(null);
      setSelectedContent(null);
    } catch (error) {
      console.error("Error assigning director:", error);
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
    if (!window.confirm("Möchten Sie diesen Regisseur entfernen?")) return;

    try {
      if (type === 'movie') {
        await removeDirectorFromMovie(contentId, directorId);
      } else {
        await removeDirectorFromSeries(contentId, directorId);
      }
      await loadData();
    } catch (error) {
      console.error("Error removing director:", error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Schauspieler & Regisseure</h4>
        <div>
          {activeTab === "actors" && (
            <button
              className="btn btn-primary"
              onClick={() => setModals(prev => ({ ...prev, addActor: true }))}
            >
              <FaPlus /> Schauspieler hinzufügen
            </button>
          )}
          {activeTab === "directors" && (
            <button
              className="btn btn-primary"
              onClick={() => setModals(prev => ({ ...prev, addDirector: true }))}
            >
              <FaPlus /> Regisseur hinzufügen
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'actors' ? 'active' : ''}`}
            onClick={() => setActiveTab('actors')}
          >
            Schauspieler
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'directors' ? 'active' : ''}`}
            onClick={() => setActiveTab('directors')}
          >
            Regisseure
          </button>
        </li>
      </ul>

      {/* Actor List */}
      {activeTab === 'actors' && (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th width="60px">Bild</th>
                    <th>Name</th>
                    <th>Geburtsdatum</th>
                    <th>Biografie</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {actors.map(actor => (
                    <tr key={actor.id}>
                      <td>
                        {actor.image && (
                          <img
                            src={actor.image}
                            alt={actor.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        )}
                      </td>
                      <td>{actor.name}</td>
                      <td>{formatDate(actor.birthday)}</td>
                      <td>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {actor.biography}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => {
                            setSelectedPerson(actor);
                            fetchActorFilmography(actor.id);
                            setModals(prev => ({ ...prev, viewActorMovies: true }));
                          }}
                          title="Filmografie anzeigen"
                        >
                          <FaFilm />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info me-1"
                          onClick={() => {
                            setSelectedPerson(actor);
                            setModals(prev => ({ ...prev, assignActor: true }));
                          }}
                        >
                          <FaLink />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => {
                            setSelectedPerson(actor);
                            setModals(prev => ({ ...prev, editActor: true }));
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteActor(actor.id)}
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
      )}

      {/* Director List */}
      {activeTab === 'directors' && (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th width="60px">Bild</th>
                    <th>Name</th>
                    <th>Geburtsdatum</th>
                    <th>Biografie</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {directors.map(director => (
                    <tr key={director.id}>
                      <td>
                        {director.image && (
                          <img
                            src={director.image}
                            alt={director.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        )}
                      </td>
                      <td>{director.name}</td>
                      <td>{formatDate(director.birthday)}</td>
                      <td>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {director.biography}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => {
                            setSelectedPerson(director);
                            fetchDirectorFilmography(director.id);
                            setModals(prev => ({ ...prev, viewDirectorMovies: true }));
                          }}
                          title="Filmografie anzeigen"
                        >
                          <FaFilm />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info me-1"
                          onClick={() => {
                            setSelectedPerson(director);
                            setModals(prev => ({ ...prev, assignDirector: true }));
                          }}
                        >
                          <FaLink />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => {
                            setSelectedPerson(director);
                            setModals(prev => ({ ...prev, editDirector: true }));
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteDirector(director.id)}
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
      )}

      {/* Modals */}
      {/* Add Actor Modal */}
      <Modal
        show={modals.addActor}
        title="Neuen Schauspieler hinzufügen"
        onClose={() => setModals(prev => ({ ...prev, addActor: false }))}
        onSave={handleAddActor}
      >
        <PersonForm person={newActor} onChange={setNewActor} />
      </Modal>

      {/* Edit Actor Modal */}
      <Modal
        show={modals.editActor}
        title="Schauspieler bearbeiten"
        onClose={() => {
          setModals(prev => ({ ...prev, editActor: false }));
          setSelectedPerson(null);
        }}
        onSave={() => handleEditActor(selectedPerson)}
      >
        {selectedPerson && (
          <PersonForm
            person={selectedPerson}
            onChange={setSelectedPerson}
          />
        )}
      </Modal>

      {/* Add Director Modal */}
      <Modal
        show={modals.addDirector}
        title="Neuen Regisseur hinzufügen"
        onClose={() => setModals(prev => ({ ...prev, addDirector: false }))}
        onSave={handleAddDirector}
      >
        <PersonForm person={newDirector} onChange={setNewDirector} />
      </Modal>

      {/* Edit Director Modal */}
      <Modal
        show={modals.editDirector}
        title="Regisseur bearbeiten"
        onClose={() => {
          setModals(prev => ({ ...prev, editDirector: false }));
          setSelectedPerson(null);
        }}
        onSave={() => handleEditDirector(selectedPerson)}
      >
        {selectedPerson && (
          <PersonForm
            person={selectedPerson}
            onChange={setSelectedPerson}
          />
        )}
      </Modal>

      {/* Assign Actor Modal */}
      <Modal
        show={modals.assignActor}
        title="Schauspieler zuweisen"
        onClose={() => {
          setModals(prev => ({ ...prev, assignActor: false }));
          setSelectedPerson(null);
          setSelectedContent(null);
        }}
        onSave={handleAssignActor}
      >
        <div className="mb-3">
          <label className="form-label">Medientyp</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="contentType"
                id="movieType"
                value="movie"
                checked={contentType === 'movie'}
                onChange={() => setContentType('movie')}
              />
              <label className="form-check-label" htmlFor="movieType">Film</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="contentType"
                id="seriesType"
                value="series"
                checked={contentType === 'series'}
                onChange={() => setContentType('series')}
              />
              <label className="form-check-label" htmlFor="seriesType">Serie</label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">
            {contentType === 'movie' ? 'Film auswählen' : 'Serie auswählen'}
          </label>
          <select
            className="form-control"
            value={selectedContent?.id || ''}
            onChange={(e) => {
              const id = e.target.value;
              const content = contentType === 'movie'
                ? movies.find(m => m.id === id)
                : series.find(s => s.id === id);
              setSelectedContent(content);
            }}
          >
            <option value="">Bitte auswählen</option>
            {(contentType === 'movie' ? movies : series).map(item => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Assign Director Modal */}
      <Modal
        show={modals.assignDirector}
        title="Regisseur zuweisen"
        onClose={() => {
          setModals(prev => ({ ...prev, assignDirector: false }));
          setSelectedPerson(null);
          setSelectedContent(null);
        }}
        onSave={handleAssignDirector}
      >
        <div className="mb-3">
          <label className="form-label">Medientyp</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="contentType"
                id="movieTypeDir"
                value="movie"
                checked={contentType === 'movie'}
                onChange={() => setContentType('movie')}
              />
              <label className="form-check-label" htmlFor="movieTypeDir">Film</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="contentType"
                id="seriesTypeDir"
                value="series"
                checked={contentType === 'series'}
                onChange={() => setContentType('series')}
              />
              <label className="form-check-label" htmlFor="seriesTypeDir">Serie</label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">
            {contentType === 'movie' ? 'Film auswählen' : 'Serie auswählen'}
          </label>
          <select
            className="form-control"
            value={selectedContent?.id || ''}
            onChange={(e) => {
              const id = e.target.value;
              const content = contentType === 'movie'
                ? movies.find(m => m.id === id)
                : series.find(s => s.id === id);
              setSelectedContent(content);
            }}
          >
            <option value="">Bitte auswählen</option>
            {(contentType === 'movie' ? movies : series).map(item => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Actor Filmography Modal */}
      <Modal
        show={modals.viewActorMovies}
        title={`Filmografie von ${selectedPerson?.name || ''}`}
        onClose={() => {
          setModals(prev => ({ ...prev, viewActorMovies: false }));
          setSelectedPerson(null);
          setActorFilmography({ movies: [], series: [] });
        }}
      >
        {selectedPerson && (
          <div>
            {filmographyLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <h5 className="mb-3">Filme</h5>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Titel</th>
                        <th>Genre</th>
                        <th>Erscheinungsjahr</th>
                        <th>Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actorFilmography.movies.map(movie => (
                        <tr key={movie.id}>
                          <td>{movie.title}</td>
                          <td>{movie.genre}</td>
                          <td>{new Date(parseInt(movie.releaseDate)).getFullYear()}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveActor(movie.id, selectedPerson.id, 'movie')}
                            >
                              <FaUnlink /> Entfernen
                            </button>
                          </td>
                        </tr>
                      ))}
                      {actorFilmography.movies.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">Keine Filme gefunden</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <h5 className="mt-4 mb-3">Serien</h5>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Titel</th>
                        <th>Genre</th>
                        <th>Erscheinungsjahr</th>
                        <th>Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actorFilmography.series.map(serie => (
                        <tr key={serie.id}>
                          <td>{serie.title}</td>
                          <td>{serie.genre}</td>
                          <td>{new Date(parseInt(serie.releaseDate)).getFullYear()}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveActor(serie.id, selectedPerson.id, 'series')}
                            >
                              <FaUnlink /> Entfernen
                            </button>
                          </td>
                        </tr>
                      ))}
                      {actorFilmography.series.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">Keine Serien gefunden</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Director Filmography Modal */}
      <Modal
        show={modals.viewDirectorMovies}
        title={`Filmografie von ${selectedPerson?.name || ''}`}
        onClose={() => {
          setModals(prev => ({ ...prev, viewDirectorMovies: false }));
          setSelectedPerson(null);
          setDirectorFilmography({ movies: [], series: [] });
        }}
      >
        {selectedPerson && (
          <div>
            {filmographyLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <h5 className="mb-3">Filme</h5>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Titel</th>
                        <th>Genre</th>
                        <th>Erscheinungsjahr</th>
                        <th>Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {directorFilmography.movies.map(movie => (
                        <tr key={movie.id}>
                          <td>{movie.title}</td>
                          <td>{movie.genre}</td>
                          <td>{new Date(parseInt(movie.releaseDate)).getFullYear()}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveDirector(movie.id, selectedPerson.id, 'movie')}
                            >
                              <FaUnlink /> Entfernen
                            </button>
                          </td>
                        </tr>
                      ))}
                      {directorFilmography.movies.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">Keine Filme gefunden</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <h5 className="mt-4 mb-3">Serien</h5>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Titel</th>
                        <th>Genre</th>
                        <th>Erscheinungsjahr</th>
                        <th>Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {directorFilmography.series.map(serie => (
                        <tr key={serie.id}>
                          <td>{serie.title}</td>
                          <td>{serie.genre}</td>
                          <td>{new Date(parseInt(serie.releaseDate)).getFullYear()}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveDirector(serie.id, selectedPerson.id, 'series')}
                            >
                              <FaUnlink /> Entfernen
                            </button>
                          </td>
                        </tr>
                      ))}
                      {directorFilmography.series.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">Keine Serien gefunden</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CastManagement;