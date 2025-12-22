{
  /* ContentForm for movies and series*/
}
export const ContentForm = ({ content, onChange, genres }) => (
  <div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Typ</label>
        <select
          className="form-control"
          value={content.type || "movie"}
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
          value={content.title || ""}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Beschreibung</label>
      <textarea
        className="form-control"
        rows="3"
        value={content.description || ""}
        onChange={(e) => onChange({ ...content, description: e.target.value })}
      />
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Genre</label>
        <select
          className="form-control"
          value={content.genre || ""}
          onChange={(e) => onChange({ ...content, genre: e.target.value })}
        >
          <option value="">Genre auswählen</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Land</label>
        <input
          type="text"
          className="form-control"
          value={content.country || ""}
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
          value={content.releaseDate || ""}
          onChange={(e) =>
            onChange({ ...content, releaseDate: e.target.value })
          }
        />
      </div>
      {content.type === "series" && (
        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            value={content.status || ""}
            onChange={(e) => onChange({ ...content, status: e.target.value })}
          >
            <option value="">Status auswählen</option>
            <option value="ONGOING">Laufend</option>
            <option value="FINISHED">Beendet</option>
            <option value="IN_PRODUCTION">In Produktion</option>
            <option value="CANCELLED">Abgebrochen</option>
            <option value="RETURNING">Wiederkehrend</option>
          </select>
        </div>
      )}
      {content.type === "movie" && (
        <div className="col-md-6 mb-3">
          <label className="form-label">Dauer (z.B. 120m)</label>
          <input
            type="text"
            className="form-control"
            value={content.duration || ""}
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
          value={content.posterUrl || ""}
          onChange={(e) => onChange({ ...content, posterUrl: e.target.value })}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Trailer URL</label>
        <input
          type="url"
          className="form-control"
          value={content.trailerUrl || ""}
          onChange={(e) => onChange({ ...content, trailerUrl: e.target.value })}
        />
      </div>
    </div>
  </div>
);

{
  /* SeasonForm*/
}
export const SeasonForm = ({ season, onChange }) => (
  <div>
    <div className="mb-3">
      <label className="form-label">Staffel Nummer</label>
      <input
        type="number"
        className="form-control"
        value={season.seasonNumber || ""}
        onChange={(e) =>
          onChange({ ...season, seasonNumber: parseInt(e.target.value) || "" })
        }
        min="1"
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Trailer URL</label>
      <input
        type="url"
        className="form-control"
        value={season.trailerUrl || ""}
        onChange={(e) => onChange({ ...season, trailerUrl: e.target.value })}
      />
    </div>
  </div>
);

{
  /* EpisodeForm */
}
export const EpisodeForm = ({ episode, onChange }) => (
  <div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Episode Nummer</label>
        <input
          type="number"
          className="form-control"
          value={episode.episodeNumber || ""}
          onChange={(e) =>
            onChange({
              ...episode,
              episodeNumber: parseInt(e.target.value) || "",
            })
          }
          min="1"
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Titel</label>
        <input
          type="text"
          className="form-control"
          value={episode.title || ""}
          onChange={(e) => onChange({ ...episode, title: e.target.value })}
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Beschreibung</label>
      <textarea
        className="form-control"
        rows="3"
        value={episode.description || ""}
        onChange={(e) => onChange({ ...episode, description: e.target.value })}
      />
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Dauer (z.B. 45m)</label>
        <input
          type="text"
          className="form-control"
          value={episode.duration || ""}
          onChange={(e) => onChange({ ...episode, duration: e.target.value })}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Erscheinungsdatum</label>
        <input
          type="date"
          className="form-control"
          value={episode.releaseDate || ""}
          onChange={(e) =>
            onChange({ ...episode, releaseDate: e.target.value })
          }
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Poster URL</label>
      <input
        type="url"
        className="form-control"
        value={episode.posterUrl || ""}
        onChange={(e) => onChange({ ...episode, posterUrl: e.target.value })}
      />
    </div>
  </div>
);
