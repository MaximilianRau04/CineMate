import { Link } from "react-router-dom";

const MediaCard = ({ media, type }) => {
  const year = media.releaseDate
    ? new Date(parseInt(media.releaseDate)).getFullYear()
    : "N/A";

  if (!media) return null;

  return (
    <div className="card h-100 shadow-sm">
      <Link
        to={`/${type === "movie" ? "movies" : "series"}/${media.id}`}
        className="text-decoration-none"
      >
        <div className="position-relative">
          <img
            src={
              media.posterUrl ||
              "https://via.placeholder.com/160x240?text=Kein+Bild"
            }
            className="card-img-top"
            alt={media.title}
            style={{
              height: "160px",
              width: "100%",
              objectFit: "contain",
              backgroundColor: "#f8f9fa",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/200x300?text=Kein+Bild";
            }}
          />
          <div className="position-absolute bottom-0 end-0 p-2">
            <span className="badge bg-dark">{year}</span>
          </div>
        </div>
        <div className="card-body">
          <h6 className="card-title text-truncate mb-0">{media.title}</h6>
          <small className="text-muted">{media.genre}</small>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;
