import {
  FaPlus,
  FaCheck,
  FaArrowLeft,
  FaEye,
  FaStar,
  FaCircle,
  FaPlay,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const MediaHeader = ({
  media,
  averageRating,
  reviewCount,
  userId,
  added,
  watched,
  favorite,
  error,
  adding,
  watching,
  favoriting,
  onAddToWatchlist,
  onMarkAsWatched,
  onAddToFavorites,
  renderStars,
}) => {
  if (!media) return null;

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

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
      case "laufend":
        return "bg-success";
      case "finished":
      case "beendet":
        return "bg-secondary";
      case "cancelled":
      case "abgesetzt":
        return "bg-danger";
      case "returning":
      case "zurückkehrend":
        return "bg-warning text-dark";
      case "in_production":
      case "in production":
      case "in produktion":
        return "bg-info text-dark";
      default:
        return "bg-light text-dark";
    }
  };

  // Helper function to translate status for German display
  const formatStatus = (status) => {
    if (!status) return "";

    const statusMap = {
      ONGOING: "Laufend",
      ongoing: "Laufend",
      FINISHED: "Beendet",
      finished: "Beendet",
      CANCELLED: "Abgesetzt",
      cancelled: "Abgesetzt",
      RETURNING: "Zurückkehrend",
      returning: "Zurückkehrend",
      IN_PRODUCTION: "In Produktion",
      in_production: "In Produktion",
      "in production": "In Produktion",
    };

    return statusMap[status] || statusMap[status.toLowerCase()] || status;
  };

  return (
    <div className="row g-0">
      <div className="col-md-4 text-center bg-dark text-white p-4">
        <img
          src={media.posterUrl}
          alt={media.title}
          className="img-fluid rounded shadow-sm mb-3"
          style={{ maxHeight: "400px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
        <div className="small text-muted">Poster</div>
      </div>

      <div className="col-md-8 p-4">
        <div className="mt-4 justify-content-end d-flex">
          <Link to="/explore" className="btn btn-outline-primary">
            <FaArrowLeft className="me-2" />
            Zurück zur Übersicht
          </Link>
        </div>

        <h2 className="mb-3">{media.title}</h2>

        <div className="mb-3">
          {media.genre && (
            <span className="badge bg-primary me-2">{media.genre}</span>
          )}
          {media.duration && (
            <span className="badge bg-secondary me-2">{media.duration}</span>
          )}
          {media.releaseYear && (
            <span className="badge bg-info text-dark">{media.releaseYear}</span>
          )}
          {media.status && (
            <span className={`badge ${getStatusBadgeStyle(media.status)} me-2`}>
              <FaCircle size={8} className="me-1" />
              {formatStatus(media.status)}
            </span>
          )}
        </div>

        <p className="text-muted mb-2">
          <strong>Bewertung:</strong>{" "}
          <span className="d-inline-flex align-items-center">
            {renderStars(averageRating)}
            <span className="ms-2">({averageRating.toFixed(1)}/5)</span>
            {reviewCount > 0 && (
              <span className="ms-2 text-muted">
                ({reviewCount} Bewertung{reviewCount !== 1 ? "en" : ""})
              </span>
            )}
          </span>
        </p>

        {media.description && (
          <div className="mb-4">
            <h5>📝 Beschreibung</h5>
            <p className="text-secondary">{media.description}</p>
          </div>
        )}

        {media.trailerUrl && (
          <div className="mb-4">
            <a
              href={media.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-danger"
              style={{ backgroundColor: "#ff0000", borderColor: "#ff0000" }}
            >
              <FaPlay className="me-2" />
              🎬 Trailer ansehen
            </a>
          </div>
        )}

        <div className="d-flex flex-wrap gap-2 align-items-center">
          {userId && !added && (
            <button
              className="btn btn-success"
              onClick={onAddToWatchlist}
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
              className="alert alert-success d-inline-flex align-items-center px-3 py-2 mb-0"
              role="alert"
              style={{ color: "black" }}
            >
              <FaCheck className="me-2" />
              In deiner Watchlist!
            </div>
          )}

          {userId && !favorite && (
            <button
              className="btn btn-warning"
              onClick={onAddToFavorites}
              disabled={favoriting}
            >
              {favoriting ? (
                "Wird hinzugefügt..."
              ) : (
                <>
                  <FaStar className="me-2" />
                  Zu Favoriten hinzufügen
                </>
              )}
            </button>
          )}

          {favorite && (
            <div
              className="alert alert-warning d-inline-flex align-items-center px-3 py-2 mb-0"
              role="alert"
              style={{ color: "black" }}
            >
              <FaStar className="me-2" />
              In deinen Favoriten!
            </div>
          )}

          {userId && !watched && (
            <button
              className="btn btn-info text-white"
              onClick={onMarkAsWatched}
              disabled={watching}
            >
              {watching ? (
                "Wird markiert..."
              ) : (
                <>
                  <FaEye className="me-2" />
                  Als gesehen markieren
                </>
              )}
            </button>
          )}

          {watched && (
            <div
              className="alert alert-info d-inline-flex align-items-center px-3 py-2 mb-0"
              role="alert"
              style={{ color: "black" }}
            >
              <FaEye className="me-2" />
              Als gesehen markiert
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaHeader;
