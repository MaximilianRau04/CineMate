import { useEffect, useState } from "react";

const SeasonSection = ({ seriesId }) => {
  const [seasons, setSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(true);

  /**
   * Fetches seasons and episodes data for this series
   * @returns {Promise<void>}
   */
  const fetchSeasons = async () => {
    if (!seriesId) return;
    
    setSeasonsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/series/${seriesId}/seasons`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) {
        throw new Error("Staffeln konnten nicht geladen werden");
      }
      const data = await response.json();
      setSeasons(data);
      setSeasonsLoading(false);
    } catch (err) {
      console.error("Fehler beim Laden der Staffeln:", err);
      setSeasonsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, [seriesId]); // eslint-disable-line react-hooks/exhaustive-deps
  

  if (seasonsLoading) {
    return (
      <div className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Staffeln werden geladen...</p>
      </div>
    );
  }

  if (!seasons || seasons.length === 0) {
    return (
      <div className="alert alert-info mt-5">
        Keine Staffeln für diese Serie verfügbar.
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="mb-4 text-light">📺 Staffeln und Episoden</h3>
      <div className="accordion mb-3" id="seasonsAccordion">
        {seasons.map((season) => (
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
            >
              <div className="accordion-body">
                {season.episodes && season.episodes.map((episode) => (
                  <div
                    key={episode.episodeNumber}
                    className="row mb-4 align-items-center"
                  >
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

                    {/* episode Infos */}
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
  );
};

export default SeasonSection;