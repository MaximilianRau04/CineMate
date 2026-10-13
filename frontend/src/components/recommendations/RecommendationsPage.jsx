import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./RecommendationsPage.css";
import { MediaCard } from "../explore/MediaCard";
import { LoadingSpinner } from "../explore/FilterPanel";
import { localizeReason } from "./localizeReason";
import api from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";
import { useTranslation } from "../../i18n/I18nContext";

const RecommendationsPage = () => {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const { t } = useTranslation();
  const userId = user?.id ?? null;
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [error, setError] = useState(null);

  const genres = [
    "Action",
    "Drama",
    "Comedy",
    "Thriller",
    "Horror",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Crime",
    "Adventure",
    "Animation",
  ];

  useEffect(() => {
    if (userId) {
      loadPersonalRecommendations();
    }
    loadTrendingRecommendations();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * fetches the personal recommendations for the current user
   * @returns personal recommendations
   */
  const loadPersonalRecommendations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data } = await api.get(`/recommendations/user/${userId}`);
      setRecommendations(data);
      setError(null);
    } catch (error) {
      console.error("Fehler beim Laden der Empfehlungen:", error);
      setError(t("recommendations.loadError"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * fetches the trending recommendations
   * @returns trending recommendations
   */
  const loadTrendingRecommendations = async () => {
    try {
      const { data } = await api.get("/recommendations/trending");
      setTrending(data);
    } catch (error) {
      console.error("Fehler beim Laden der Trending-Empfehlungen:", error);
      showError(t("recommendations.trendingError"));
    }
  };

  /**
   * fetches the genre recommendations based on the selected genre
   * @param {*} genre
   * @return {Promise<void>}
   */
  const loadGenreRecommendations = async (genre) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/recommendations/genre/${encodeURIComponent(genre)}`,
      );
      setGenreRecommendations(data);
      setError(null);
    } catch (error) {
      console.error("Fehler beim Laden der Genre-Empfehlungen:", error);
      setError(t("recommendations.genreError"));
    } finally {
      setLoading(false);
    }
  };

  // Handle genre selection change
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    if (genre) {
      loadGenreRecommendations(genre);
    } else {
      setGenreRecommendations([]);
    }
  };

  const RecommendationCard = ({ recommendation }) => (
    <div className="cm-rec">
      <MediaCard
        item={{
          ...recommendation,
          currentRating: recommendation.rating,
          genreArray: recommendation.genre
            ? recommendation.genre.split(/,\s*/)
            : [],
        }}
        type={recommendation.type === "movie" ? "movie" : "series"}
      />
      {recommendation.reason && (
        <p className="cm-rec-reason">
          {localizeReason(recommendation.reason, t)}
        </p>
      )}
    </div>
  );

  const renderGrid = (items) => (
    <div className="cm-poster-grid">
      {items.map((recommendation) => (
        <RecommendationCard
          key={`${recommendation.type}-${recommendation.id}`}
          recommendation={recommendation}
        />
      ))}
    </div>
  );

  if (loading && activeTab === "personal" && recommendations.length === 0) {
    return <LoadingSpinner message={t("recommendations.loading")} />;
  }

  const tabs = [
    { key: "personal", label: t("recommendations.tabs.personal") },
    { key: "trending", label: t("recommendations.tabs.trending") },
    { key: "genre", label: t("recommendations.tabs.genre") },
  ];

  return (
    <div className="container-xxl cm-page recommendations-page">
      <header className="cm-page-head">
        <div>
          <div className="cm-eyebrow">{t("recommendations.eyebrow")}</div>
          <h1>{t("recommendations.title")}</h1>
        </div>
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
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="alert alert-warning mb-4" role="alert">
          {error}
        </div>
      )}

      {activeTab === "personal" &&
        (recommendations.length === 0 ? (
          <div className="cm-empty">
            <h3>{t("recommendations.emptyTitle")}</h3>
            <p>{t("recommendations.emptyHint")}</p>
            <Link to="/explore" className="btn btn-outline-primary">
              {t("recommendations.discover")}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">
              {t("recommendations.personalIntro")}
            </p>
            {renderGrid(recommendations)}
          </>
        ))}

      {activeTab === "trending" && (
        <>
          <p className="text-muted mb-4">
            {t("recommendations.trendingIntro")}
          </p>
          {trending.length > 0 ? (
            renderGrid(trending)
          ) : (
            <p className="text-muted">{t("recommendations.noTrending")}</p>
          )}
        </>
      )}

      {activeTab === "genre" && (
        <>
          <div className="cm-chips mb-4">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`cm-chip${selectedGenre === genre ? " is-active" : ""}`}
                aria-pressed={selectedGenre === genre}
                onClick={() =>
                  handleGenreChange(selectedGenre === genre ? "" : genre)
                }
              >
                {genre}
              </button>
            ))}
          </div>

          {!selectedGenre ? (
            <p className="text-muted">{t("recommendations.pickGenre")}</p>
          ) : loading ? (
            <LoadingSpinner />
          ) : genreRecommendations.length > 0 ? (
            <>
              <div className="cm-section-title mt-0">
                <h2>{t("recommendations.bestOf", { genre: selectedGenre })}</h2>
              </div>
              {renderGrid(genreRecommendations)}
            </>
          ) : (
            <p className="text-muted">{t("recommendations.noGenreResults")}</p>
          )}
        </>
      )}
    </div>
  );
};

export default RecommendationsPage;
