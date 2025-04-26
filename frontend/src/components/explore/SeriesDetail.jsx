import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPlus, FaCheck, FaArrowLeft } from "react-icons/fa";

const SeriesDetail = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  /**
   * fetches the currently logged in user from the API
   */
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) setUserId(data.id);
      })
      .catch((err) => console.error("Fehler beim Laden des Users:", err));
  }, []);

  /**
   * fetches the series details from the API
   */
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/series/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Serie konnte nicht geladen werden");
        return res.json();
      })
      .then((data) => {
        setSeries(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Serie:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  /**
   * checks if the series is already in the user's watchlist
   */
  useEffect(() => {
    if (!userId || !id) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/series`, {})
      .then((res) => res.json())
      .then((data) => {
        const alreadyInWatchlist = data.some((m) => m.id.toString() === id);
        setAdded(alreadyInWatchlist);
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));
  }, [userId, id]);

  /**
   * adds the series to the user's watchlist
   * @returns {Promise<void>}
   */
  const handleAddToWatchlist = () => {
    if (!userId || added) return;

    setAdding(true);
    fetch(`http://localhost:8080/api/users/${userId}/watchlist/series/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Hinzufügen zur Watchlist");
        return res.json();
      })
      .then(() => {
        setAdded(true);
        setAdding(false);
      })
      .catch((err) => {
        console.error(err);
        setAdding(false);
      });
  };

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Serie wird geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <Link to="/explore" className="btn btn-outline-secondary mt-3">
            <FaArrowLeft className="me-2" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  if (!series) return null;

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-4 text-center bg-dark text-white p-4">
            <img
              src={series.posterUrl}
              alt={series.title}
              className="img-fluid rounded shadow-sm mb-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
            <div className="small text-muted">Serienposter</div>
          </div>

          <div className="col-md-8 p-4">
            <h2 className="mb-3">{series.title}</h2>

            <div className="mb-3">
              {series.genre && (
                <span className="badge bg-primary me-2">{series.genre}</span>
              )}
              {series.releaseDate && (
                <span className="badge bg-info text-dark">
                  {new Date(series.releaseDate).getFullYear()}
                </span>
              )}
            </div>

            <p className="text-muted mb-2">
              <strong>Bewertung:</strong> ⭐ {series.rating}/10
            </p>

            {series.description && (
              <div className="mb-4">
                <h5>📝 Beschreibung</h5>
                <p className="text-secondary">{series.description}</p>
              </div>
            )}

            {userId && !added && (
              <button
                className="btn btn-success me-2"
                onClick={handleAddToWatchlist}
                disabled={adding}
              >
                {adding ? (
                  "Wird hinzugefügt..."
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Zur Watchlist hinzufügen
                  </>
                )}
              </button>
            )}

            {added && (
              <div
                className="alert alert-success d-inline-flex align-items-center px-3 py-2 mt-2"
                role="alert"
              >
                <FaCheck className="me-2" />
                In deiner Watchlist!
              </div>
            )}

            <div className="mt-4">
              <Link to="/explore" className="btn btn-outline-primary">
                <FaArrowLeft className="me-2" />
                Zurück zur Übersicht
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* seasons and episodes */}
      {series.seasons && series.seasons.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4 text-light">📺 Staffeln und Episoden</h3>
          <div className="accordion" id="seasonsAccordion">
            {series.seasons.map((season, index) => (
              <div
                className="accordion-item bg-dark text-light"
                key={season.seasonNumber}
              >
                <h2
                  className="accordion-header"
                  id={`heading-${season.seasonNumber}`}
                >
                  <button
                    className="accordion-button collapsed bg-dark text-light"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${season.seasonNumber}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${season.seasonNumber}`}
                  >
                    Staffel {season.seasonNumber}
                  </button>
                </h2>
                <div
                  id={`collapse-${season.seasonNumber}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${season.seasonNumber}`}
                  data-bs-parent="#seasonsAccordion"
                >
                  <div className="accordion-body">
                    {season.episodes.map((episode) => (
                      <div
                        key={episode.episodeNumber}
                        className="row mb-4 align-items-center"
                      >
                        {/* Folgen-Poster */}
                        <div className="col-md-3 text-center">
                          <img
                            src={
                              episode.posterUrl ||
                              "https://via.placeholder.com/200x300?text=No+Image"
                            }
                            alt={episode.title}
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                          />
                        </div>

                        {/* Folgen-Infos */}
                        <div className="col-md-9">
                          <h5 className="text-white">
                            Episode {episode.episodeNumber}: {episode.title}
                          </h5>
                          <p className="small text-light mb-1">
                            ⏱️ {episode.duration} | 📅{" "}
                            {new Date(episode.releaseDate).toLocaleDateString()}
                          </p>
                          <p className="text-secondary">
                            {episode.description}
                          </p>
                        </div>

                        <hr className="border-secondary my-3" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesDetail;
