import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useToast } from "../../toasts";
import { useTranslation } from "../../../i18n/I18nContext";

const SeasonSection = ({ seriesId }) => {
  const { error: showError } = useToast();
  const [seasons, setSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState(null);
  const { t, formatDate } = useTranslation();

  /**
   * Fetches seasons and episodes data for this series
   * @returns {Promise<void>}
   */
  const fetchSeasons = async () => {
    if (!seriesId) return;

    setSeasonsLoading(true);
    try {
      const { data } = await api.get(`/series/${seriesId}/seasons`);
      setSeasons(data);
      setSeasonsLoading(false);
    } catch (err) {
      console.error("Fehler beim Laden der Staffeln:", err);
      showError(t("seasons.loadError"));
      setSeasonsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, [seriesId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (seasonsLoading) {
    return (
      <section className="cm-detail-section text-muted">
        <span className="spinner-border spinner-border-sm me-2" />
        {t("seasons.loading")}
      </section>
    );
  }

  if (!seasons || seasons.length === 0) {
    return (
      <section className="cm-detail-section">
        <div className="cm-section-title">
          <h2>{t("seasons.title")}</h2>
        </div>
        <p className="text-muted">{t("seasons.empty")}</p>
      </section>
    );
  }

  const season =
    seasons.find((s) => s.seasonNumber === activeSeason) || seasons[0];

  return (
    <section className="cm-detail-section">
      <div className="cm-section-title">
        <h2>{t("seasons.title")}</h2>
        <span className="cm-count">
          {t("calendar.seasonCount", { count: seasons.length })}
        </span>
      </div>

      <div className="cm-chips mb-3" role="tablist">
        {seasons.map((s) => (
          <button
            key={s.seasonNumber}
            type="button"
            role="tab"
            aria-selected={s.seasonNumber === season.seasonNumber}
            className={`cm-chip${s.seasonNumber === season.seasonNumber ? " is-active" : ""}`}
            onClick={() => setActiveSeason(s.seasonNumber)}
          >
            {t("common.season")} {s.seasonNumber}
          </button>
        ))}
      </div>

      <ol className="cm-episodes">
        {(season.episodes || []).map((episode) => (
          <li key={episode.episodeNumber} className="cm-episode">
            <span className="cm-episode-no">
              {String(episode.episodeNumber).padStart(2, "0")}
            </span>
            {episode.posterUrl && (
              <img
                src={episode.posterUrl}
                alt=""
                loading="lazy"
                className="cm-episode-still"
              />
            )}
            <div className="min-w-0">
              <h3 className="cm-episode-title">{episode.title}</h3>
              <div className="cm-episode-meta">
                {episode.duration && <span>{episode.duration}</span>}
                {episode.releaseDate && (
                  <span>{formatDate(episode.releaseDate)}</span>
                )}
              </div>
              {episode.description && (
                <p className="cm-episode-desc">{episode.description}</p>
              )}
            </div>
          </li>
        ))}
        {(!season.episodes || season.episodes.length === 0) && (
          <li className="text-muted">{t("seasons.noEpisodes")}</li>
        )}
      </ol>
    </section>
  );
};

export default SeasonSection;
