import React from "react";
import { Link } from "react-router-dom";
import Poster from "../common/Poster";
import { useTranslation } from "../../i18n/I18nContext";

const ListCard = ({ list, onLike, onDelete, showOwnerActions = false }) => {
  const { t, formatDate } = useTranslation();
  const previewImage =
    list.coverImageUrl ||
    list.movies?.[0]?.posterUrl ||
    list.series?.[0]?.posterUrl;

  return (
    <div className="card custom-list-card h-100">
      <div className="position-relative">
        <Link to={`/lists/${list.id}`}>
          <div className="list-preview-image overflow-hidden">
            <Poster
              src={previewImage}
              title={list.title}
              className="w-100 h-100 object-fit-cover"
            />
          </div>
        </Link>

        {/* Privacy indicator */}
        <div className="position-absolute top-0 start-0 m-2">
          <span className="cm-tag cm-tag-solid">
            <i className={`bi bi-${list.public ? "globe" : "lock"} me-1`}></i>
            {list.public ? t("common.public") : t("common.private")}
          </span>
        </div>

        {/* Items count */}
        <div className="position-absolute top-0 end-0 m-2">
          <span className="cm-tag cm-tag-solid">
            {t("lists.itemCount", { count: list.totalItemsCount || 0 })}
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
              title={t("lists.deleteList")}
              aria-label={t("lists.deleteList")}
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
              {list.creator?.username || t("lists.unknownUser")}
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
                  {t("lists.moreTags", { count: list.tags.length - 3 })}
                </span>
              )}
            </div>
          )}

          {/* Bottom row with date, likes, and actions */}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {formatDate(list.updatedAt, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </small>

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
                  title={
                    list.likedByCurrentUser
                      ? t("lists.unlike")
                      : t("lists.like")
                  }
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
                title={t("lists.viewList")}
                aria-label={t("lists.viewList")}
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
