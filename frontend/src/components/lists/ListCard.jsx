import React from "react";
import { Link } from "react-router-dom";

const ListCard = ({ list, onLike, onDelete, showOwnerActions = false }) => {
  /**
   * Get the preview image URL for the list.
   * @returns {string} - Returns the preview image URL for the list.
   */
  const getListPreviewImage = () => {
    if (list.coverImageUrl) {
      return list.coverImageUrl;
    }

    // Use first movie/series poster as preview
    if (list.movies && list.movies.length > 0) {
      return list.movies[0].posterUrl;
    }

    if (list.series && list.series.length > 0) {
      return list.series[0].posterUrl;
    }

    return "https://via.placeholder.com/300x400?text=Keine+Inhalte";
  };

  /**
   * Formats a date string to a more readable format.
   * @param {*} dateString - The date string to format.
   * @returns The formatted date string.
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="card custom-list-card h-100">
      <div className="position-relative">
        <Link to={`/lists/${list.id}`}>
          <img
            src={getListPreviewImage()}
            alt={list.title}
            className="card-img-top list-preview-image"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x400?text=Keine+Inhalte";
            }}
          />
        </Link>

        {/* Privacy indicator */}
        <div className="position-absolute top-0 start-0 m-2">
          <span
            className={`badge ${list.public ? "bg-success" : "bg-secondary"}`}
          >
            <i className={`bi bi-${list.public ? "globe" : "lock"} me-1`}></i>
            {list.public ? "Öffentlich" : "Privat"}
          </span>
        </div>

        {/* Items count */}
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-dark bg-opacity-75">
            {list.totalItemsCount}{" "}
            {list.totalItemsCount === 1 ? "Element" : "Elemente"}
          </span>
        </div>

        {/* Owner actions */}
        {showOwnerActions && onDelete && (
          <div className="position-absolute bottom-0 end-0 m-2">
            <button
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              title="Liste löschen"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-2">
          <Link to={`/lists/${list.id}`} className="text-decoration-none">
            {list.title}
          </Link>
        </h5>

        {list.description && (
          <p className="card-text text-muted small mb-2">
            {list.description.length > 100
              ? `${list.description.substring(0, 100)}...`
              : list.description}
          </p>
        )}

        <div className="mt-auto">
          {/* Creator info */}
          <div className="d-flex align-items-center mb-2">
            <small className="text-muted">
              <i className="bi bi-person me-1"></i>
              {list.creator?.username || "Unbekannter Nutzer"}
            </small>
          </div>

          {/* Tags */}
          {list.tags && list.tags.length > 0 && (
            <div className="mb-2">
              {list.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="badge bg-secondary me-1 mb-1">
                  #{tag}
                </span>
              ))}
              {list.tags.length > 3 && (
                <span className="badge bg-light text-dark">
                  +{list.tags.length - 3} weitere
                </span>
              )}
            </div>
          )}

          {/* Bottom row with date, likes, and actions */}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">{formatDate(list.updatedAt)}</small>

            <div className="d-flex align-items-center">
              {/* Like button */}
              {onLike && (
                <button
                  className={`btn btn-sm me-2 ${
                    list.likedByCurrentUser
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onLike();
                  }}
                  title={list.likedByCurrentUser ? "Unlike" : "Like"}
                >
                  <i
                    className={`bi bi-heart${
                      list.likedByCurrentUser ? "-fill" : ""
                    }`}
                  ></i>
                  <span className="ms-1">{list.likesCount}</span>
                </button>
              )}

              {/* View button */}
              <Link
                to={`/lists/${list.id}`}
                className="btn btn-outline-primary btn-sm"
                title="Liste ansehen"
              >
                <i className="bi bi-eye"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
