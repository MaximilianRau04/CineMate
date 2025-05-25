import { FaPlus, FaCheck, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const MediaHeader = ({
  media,
  averageRating,
  reviewCount,
  userId,
  added,
  error,
  adding,
  onAddToWatchlist,
  renderStars
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
        </div>

        <p className="text-muted mb-2">
          <strong>Bewertung:</strong>{" "}
          <span className="d-inline-flex align-items-center">
            {renderStars(averageRating)}
            <span className="ms-2">({averageRating.toFixed(1)}/5)</span>
            {reviewCount > 0 && (
              <span className="ms-2 text-muted">
                ({reviewCount} Bewertung{reviewCount !== 1 ? 'en' : ''})
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

        {userId && !added && (
          <button
            className="btn btn-success me-2"
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
            className="alert alert-success d-inline-flex align-items-center px-3 py-2 mt-2"
            role="alert"
          >
            <FaCheck className="me-2" />
            In deiner Watchlist!
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaHeader;