import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CalendarItem = ({ item }) => {
  const isMovie = item.contentType === "movie";
  const linkPath = isMovie ? `/movies/${item.id}` : `/series/${item.id}`;
  const releaseDate = isMovie ? item.releaseDate : item.nextEpisodeDate;

  /**
   * formats a date string to "DD.MM.YYYY" format
   * @param {*} dateString
   * @returns {string} - Formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return "Datum unbekannt";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Link
      to={linkPath}
      className="list-group-item list-group-item-action d-flex align-items-center p-3"
    >
      <div className="d-flex align-items-center" style={{ width: "100%" }}>
        <div className="me-3" style={{ minWidth: "90px" }}>
          <span className="badge bg-info text-dark">
            {formatDate(releaseDate)}
          </span>
          <span className="ms-2 badge bg-primary">
            {isMovie ? "Film" : "Serie"}
          </span>
        </div>

        <div className="d-flex align-items-center" style={{ flex: 1 }}>
          {item.posterUrl && (
            <img
              src={item.posterUrl}
              alt={item.title}
              className="me-3 rounded shadow-sm"
              style={{
                width: "50px",
                height: "75px",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/50x75?text=No+Image";
              }}
            />
          )}

          <div>
            <h5 className="mb-1">{item.title}</h5>
            <div>
              {item.genreArray &&
                item.genreArray.map((genre, index) => (
                  <span key={index} className="badge bg-secondary me-2">
                    {genre}
                  </span>
                ))}

              {isMovie && item.duration && (
                <span className="badge bg-light text-dark border me-2">
                  {item.duration}
                </span>
              )}

              {!isMovie && item.seasons && (
                <span className="badge bg-light text-dark border me-2">
                  {item.seasons.length} Staffel
                  {item.seasons.length !== 1 ? "n" : ""}
                </span>
              )}

              {item.releaseYear && (
                <span className="badge bg-light text-dark border">
                  {item.releaseYear}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="ms-auto">
          <FaArrowRight className="text-muted" />
        </div>
      </div>
    </Link>
  );
};

export default CalendarItem;
