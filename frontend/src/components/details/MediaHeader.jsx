import {
  FaPlus,
  FaCheck,
  FaArrowLeft,
  FaEye,
  FaStar,
  FaPlay,
  FaListUl,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Poster from "../common/Poster";
import { useTranslation } from "../../i18n/I18nContext";

const STATUS_KEYS = {
  ongoing: "ongoing",
  laufend: "ongoing",
  finished: "finished",
  beendet: "finished",
  cancelled: "cancelled",
  abgesetzt: "cancelled",
  returning: "returning",
  zurückkehrend: "returning",
  in_production: "inProduction",
  "in production": "inProduction",
  "in produktion": "inProduction",
};

const MediaHeader = ({
  type = "movie",
  media,
  averageRating,
  reviewCount,
  userId,
  added,
  watched,
  favorite,
  adding,
  watching,
  favoriting,
  onAddToWatchlist,
  onMarkAsWatched,
  onAddToFavorites,
  onShowAddToListModal,
  renderStars,
}) => {
  const { t } = useTranslation();
  if (!media) return null;

  const statusKey = media.status
    ? STATUS_KEYS[media.status.toLowerCase()]
    : null;
  const year =
    media.releaseYear ||
    (media.releaseDate ? new Date(media.releaseDate).getFullYear() : null);
  const genres = media.genre ? media.genre.split(/,\s*/) : [];

  return (
    <section className="cm-hero">
      {media.posterUrl && (
        <div
          className="cm-hero-backdrop"
          style={{ backgroundImage: `url("${media.posterUrl}")` }}
          aria-hidden="true"
        />
      )}

      <div className="container-xxl cm-hero-inner">
        <Link to="/explore" className="cm-back-link">
          <FaArrowLeft size={12} />
          {t("details.backToExplore")}
        </Link>

        <div className="cm-hero-grid">
          <div className="cm-hero-poster">
            <Poster src={media.posterUrl} title={media.title} />
          </div>

          <div className="cm-hero-info">
            <div className="cm-hero-meta">
              <span
                className={`cm-tag${type === "movie" ? " cm-tag-brass" : ""}`}
              >
                {type === "movie" ? t("common.movie") : t("common.series")}
              </span>
              {year && <span>{year}</span>}
              {media.duration && <span>{media.duration}</span>}
              {media.country && <span>{media.country}</span>}
              {media.status && (
                <span className={`cm-status cm-status-${statusKey || "other"}`}>
                  {statusKey ? t(`details.status.${statusKey}`) : media.status}
                </span>
              )}
            </div>

            <h1 className="cm-hero-title">{media.title}</h1>

            {genres.length > 0 && (
              <div className="cm-chips mb-3">
                {genres.map((genre) => (
                  <span key={genre} className="cm-chip">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div className="cm-hero-rating">
              {averageRating > 0 && (
                <span className="cm-hero-score">
                  {averageRating.toFixed(1)}
                </span>
              )}
              <div>
                <div className="cm-stars">{renderStars(averageRating)}</div>
                <div className="cm-hero-rating-label">
                  {reviewCount > 0
                    ? t("details.reviewCount", { count: reviewCount })
                    : t("details.noRatingsYet")}
                </div>
              </div>
            </div>

            {media.description && (
              <p className="cm-hero-desc">{media.description}</p>
            )}

            <div className="cm-hero-actions">
              {media.trailerUrl && (
                <a
                  href={media.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <FaPlay className="me-2" size={12} />
                  {t("details.watchTrailer")}
                </a>
              )}

              {userId && (
                <button
                  className={`btn ${added ? "btn-outline-success" : "btn-outline-secondary"}`}
                  onClick={onAddToWatchlist}
                  disabled={adding || added}
                >
                  {added ? (
                    <FaCheck className="me-2" />
                  ) : (
                    <FaPlus className="me-2" />
                  )}
                  {adding
                    ? t("details.adding")
                    : added
                      ? t("details.inWatchlist")
                      : t("details.addToWatchlist")}
                </button>
              )}

              {userId && (
                <button
                  className={`btn ${watched ? "btn-outline-success" : "btn-outline-secondary"}`}
                  onClick={onMarkAsWatched}
                  disabled={watching || watched}
                >
                  {watched ? (
                    <FaCheck className="me-2" />
                  ) : (
                    <FaEye className="me-2" />
                  )}
                  {watching
                    ? t("details.marking")
                    : watched
                      ? t("details.watched")
                      : t("details.markWatched")}
                </button>
              )}

              {userId && (
                <button
                  className={`btn ${favorite ? "btn-outline-warning" : "btn-outline-secondary"}`}
                  onClick={onAddToFavorites}
                  disabled={favoriting || favorite}
                >
                  <FaStar className="me-2" />
                  {favoriting
                    ? t("details.adding")
                    : favorite
                      ? t("details.inFavorites")
                      : t("details.addToFavorites")}
                </button>
              )}

              {userId && onShowAddToListModal && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={onShowAddToListModal}
                >
                  <FaListUl className="me-2" />
                  {t("details.addToList")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaHeader;
