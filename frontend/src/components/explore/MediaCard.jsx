import React from "react";
import { Link } from "react-router-dom";

const MediaList = ({ title, items, type }) => {
  if (items.length === 0) return null;
  
  return (
    <>
      <h2 className="mt-5 mb-3">{title}</h2>
      <div className="row">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </>
  );
};

export default MediaList;

const MediaCard = ({ item, type }) => {
  const detailsPath = type === "movie" ? `/movies/${item.id}` : `/series/${item.id}`;
  
  return (
    <div className="col-md-6 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="row g-0">
          <div className="col-auto">
            <img
              src={item.posterUrl}
              alt={item.title}
              width="100"
              height="150"
              className="img-fluid rounded-start"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100x150?text=No+Image";
              }}
            />
          </div>
          <div className="col">
            <div className="card-body d-flex flex-column justify-content-between h-100">
              <div>
                <h5 className="card-title mb-1">{item.title}</h5>
                <div className="mb-1">
                  {item.genreArray && item.genreArray.map((genre, index) => (
                    <span key={index} className="badge bg-secondary me-1">
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="card-text mb-1">
                  ⭐ <strong>{formatRating(item)}</strong>
                </p>
                <p className="card-text mb-1">
                  📅{" "}
                  {item.releaseDate
                    ? new Date(item.releaseDate).toLocaleDateString("de-DE")
                    : "Unbekannt"}
                </p>
              </div>
              <Link
                to={detailsPath}
                className="btn btn-primary btn-sm mt-2 align-self-start"
              >
                Details ansehen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * formats the rating of a media item
 * @param {*} item 
 * @returns {string} - Formatted rating string 
 */
const formatRating = (item) => {
  const rating = item.currentRating !== undefined ? item.currentRating : item.rating;
  
  if (rating === null || rating === undefined) return "N/A";
  
  const numRating = Number(rating);
  
  if (isNaN(numRating)) return "N/A";
  
  return numRating.toFixed(1);
};
