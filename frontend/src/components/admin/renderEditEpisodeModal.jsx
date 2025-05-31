

const renderEditEpisodeModal = () => (
    <div className={`modal ${showEditEpisodeModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Staffel bearbeiten</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {const renderSeasonsModal = () => (
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
                            type="bs and series can not beutton"
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
              type="bs and series can not beutton"
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

  export default renderEditEpisodeModal;