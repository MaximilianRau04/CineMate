import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { MediaCard } from "../explore/MediaCard";
import { LoadingSpinner } from "../explore/FilterPanel";
import api from "../../utils/api";
import { useTranslation } from "../../i18n/I18nContext";

const Watchlist = () => {
  const { t } = useTranslation();
  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [seriesWatchlist, setSeriesWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("movies");

  /**
   * fetches the currently logged in user from the API
   * @returns {void}
   */
  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        const data = res.data;
        if (data?.id) setUserId(data.id);
      })
      .catch((err) => console.error("Fehler beim Abrufen des Benutzers:", err));
  }, []);

  /**
   * fetches the watchlist of the user from the API
   * @param {string} userId - ID of the user whose watchlist is to be fetched
   * @returns {void}
   */
  useEffect(() => {
    if (!userId) return;
    Promise.all([
      api.get(`/users/${userId}/watchlist/movies`).then((res) => res.data),
      api.get(`/users/${userId}/watchlist/series`).then((res) => res.data),
    ])
      .then(([movies, series]) => {
        setMovieWatchlist(movies);
        setSeriesWatchlist(series);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Watchlists:", err);
        setLoading(false);
      });
  }, [userId]);

  /**
   * removes a movie from the watchlist of the user
   * @param {*} movieId - ID of the movie to remove
   * @returns {void}
   */
  const removeMovieFromWatchlist = (movieId) => {
    if (!window.confirm(t("watchlist.confirmRemoveMovie"))) return;
    api
      .delete(`/users/${userId}/watchlist/movies/${movieId}`)
      .then(() =>
        setMovieWatchlist((prev) => prev.filter((m) => m.id !== movieId)),
      )
      .catch((err) => console.error("Fehler beim Entfernen des Films:", err));
  };

  /**
   * removes a series from the watchlist of the user
   * @param {*} seriesId - the ID of the series to remove
   * @returns {void}
   */
  const removeSeriesFromWatchlist = (seriesId) => {
    if (!window.confirm(t("watchlist.confirmRemoveSeries"))) return;
    api
      .delete(`/users/${userId}/watchlist/series/${seriesId}`)
      .then(() =>
        setSeriesWatchlist((prev) => prev.filter((s) => s.id !== seriesId)),
      )
      .catch((err) => console.error("Fehler beim Entfernen der Serie:", err));
  };

  if (loading) {
    return <LoadingSpinner message={t("watchlist.loading")} />;
  }

  const tabs = [
    { key: "movies", label: t("common.movies"), items: movieWatchlist },
    { key: "series", label: t("common.seriesPlural"), items: seriesWatchlist },
  ];
  const active = tabs.find((tab) => tab.key === activeTab);
  const isEmpty = movieWatchlist.length === 0 && seriesWatchlist.length === 0;

  return (
    <div className="container-xxl cm-page">
      <header className="cm-page-head">
        <div>
          <div className="cm-eyebrow">
            {t("watchlist.eyebrow", {
              count: movieWatchlist.length + seriesWatchlist.length,
            })}
          </div>
          <h1>{t("watchlist.title")}</h1>
        </div>
        {!isEmpty && (
          <div className="cm-segment" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={activeTab === tab.key ? "is-active" : ""}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label} · {tab.items.length}
              </button>
            ))}
          </div>
        )}
      </header>

      {isEmpty ? (
        <div className="cm-empty">
          <h3>{t("watchlist.empty")}</h3>
          <p>{t("watchlist.emptyHint")}</p>
          <Link to="/explore" className="btn btn-primary">
            {t("watchlist.discover")}
          </Link>
        </div>
      ) : active.items.length === 0 ? (
        <div className="cm-empty">
          <p className="mb-0">
            {activeTab === "movies"
              ? t("watchlist.noMovies")
              : t("watchlist.noSeries")}
          </p>
        </div>
      ) : (
        <div className="cm-poster-grid">
          {active.items.map((item) => (
            <div key={item.id} className="position-relative">
              <MediaCard
                item={{
                  ...item,
                  genreArray: item.genre ? item.genre.split(/,\s*/) : [],
                }}
                type={activeTab === "movies" ? "movie" : "series"}
              />
              <button
                type="button"
                className="cm-card-remove"
                onClick={() =>
                  activeTab === "movies"
                    ? removeMovieFromWatchlist(item.id)
                    : removeSeriesFromWatchlist(item.id)
                }
                title={t("watchlist.remove")}
                aria-label={t("watchlist.remove")}
              >
                <FaTrashAlt size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
