import React, { useState } from "react";
import { FaSearch, FaDownload, FaCheck, FaStar } from "react-icons/fa";
import api from "../../../utils/api";

const TmdbImport = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState({});
  const [imported, setImported] = useState({});
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const endpoint =
        type === "movie" ? "/tmdb/search/movies" : "/tmdb/search/series";
      const { data } = await api.get(endpoint, { params: { query } });
      setResults(data);
    } catch {
      setError("Suche fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (item) => {
    const id = item.tmdbId;
    setImporting((prev) => ({ ...prev, [id]: true }));

    try {
      const endpoint =
        type === "movie"
          ? `/tmdb/import/movie/${id}`
          : `/tmdb/import/series/${id}`;
      await api.post(endpoint);
      setImported((prev) => ({ ...prev, [id]: true }));
    } catch {
      setError(`Import fehlgeschlagen für "${item.title || item.name}".`);
    } finally {
      setImporting((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center gap-2">
        <img
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
          alt="TMDB"
          height="16"
        />
        <h5 className="mb-0">TMDB Import</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="row g-2 align-items-end">
            <div className="col-auto">
              <div className="btn-group" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  id="type-movie"
                  value="movie"
                  checked={type === "movie"}
                  onChange={() => {
                    setType("movie");
                    setResults([]);
                  }}
                />
                <label className="btn btn-outline-primary" htmlFor="type-movie">
                  Filme
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  id="type-series"
                  value="series"
                  checked={type === "series"}
                  onChange={() => {
                    setType("series");
                    setResults([]);
                  }}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="type-series"
                >
                  Serien
                </label>
              </div>
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder={`${type === "movie" ? "Film" : "Serie"} suchen...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                  />
                ) : (
                  <FaSearch className="me-1" />
                )}
                Suchen
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger alert-dismissible">
            {error}
            <button
              className="btn-close"
              onClick={() => setError(null)}
            />
          </div>
        )}

        {results.length > 0 && (
          <div className="row g-3">
            {results.map((item) => {
              const id = item.tmdbId;
              const title = item.title || item.name;
              const date = item.releaseDate || item.firstAirDate;
              const year = date ? date.substring(0, 4) : "—";

              return (
                <div key={id} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="row g-0 h-100">
                      {item.posterUrl ? (
                        <div className="col-4">
                          <img
                            src={item.posterUrl}
                            alt={title}
                            className="img-fluid rounded-start h-100"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <div
                          className="col-4 bg-secondary d-flex align-items-center justify-content-center rounded-start"
                          style={{ minHeight: "120px" }}
                        >
                          <FaSearch className="text-white opacity-50" />
                        </div>
                      )}
                      <div className="col-8">
                        <div className="card-body p-2 d-flex flex-column h-100">
                          <p className="card-title fw-semibold mb-1 small">
                            {title}
                          </p>
                          <p className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>
                            {year}
                          </p>
                          {item.voteAverage > 0 && (
                            <p className="mb-2" style={{ fontSize: "0.75rem" }}>
                              <FaStar className="text-warning me-1" />
                              {item.voteAverage.toFixed(1)}
                            </p>
                          )}
                          <div className="mt-auto">
                            <button
                              className={`btn btn-sm w-100 ${imported[id] ? "btn-success" : "btn-outline-primary"}`}
                              onClick={() => handleImport(item)}
                              disabled={importing[id] || imported[id]}
                            >
                              {importing[id] ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : imported[id] ? (
                                <>
                                  <FaCheck className="me-1" /> Importiert
                                </>
                              ) : (
                                <>
                                  <FaDownload className="me-1" /> Importieren
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <p className="text-muted text-center mt-3">Keine Ergebnisse gefunden.</p>
        )}

        {!query && !loading && (
          <p className="text-muted text-center mt-3">
            Suche nach einem Film oder einer Serie um Inhalte von TMDB zu importieren.
          </p>
        )}
      </div>
    </div>
  );
};

export default TmdbImport;
