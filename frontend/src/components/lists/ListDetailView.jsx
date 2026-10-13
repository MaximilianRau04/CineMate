import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";
import MediaCard from "../profile/MediaCard";
import AddContentModal from "./AddContentModal";
import EditListModal from "./EditListModal";
import api from "../../utils/api";
import { useTranslation } from "../../i18n/I18nContext";

const ListDetailView = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const { t, formatDateTime } = useTranslation();

  const [list, setList] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadList();
    loadComments();
  }, [listId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * fetches the list details from the API.
   */
  const loadList = async () => {
    try {
      const { data } = await api.get(`/lists/${listId}`);
      setList(data);
    } catch (error) {
      if (error.response?.status === 404) {
        showError(t("lists.notFound"));
        navigate("/lists");
      } else if (error.response?.status === 403) {
        showError(t("lists.noPermission"));
        navigate("/lists");
      } else {
        console.error("Error loading list:", error);
        showError(t("lists.loadError"));
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * loads the comments for the list from the API.
   */
  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const { data } = await api.get(`/lists/${listId}/comments`);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  /**
   * Formats a date string to a more readable format.
   * @returns The formatted date string.
   */
  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      const { data } = await api.post(`/lists/${listId}/like`);
      setList(data);
    } catch (error) {
      console.error("Error liking list:", error);
      showError(t("lists.likeError"));
    }
  };

  /**
   * Handles the addition of a comment to the list.
   * @param {*} e - The event object.
   * @returns {Promise<void>}
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      const { data } = await api.post(`/lists/${listId}/comments`, {
        content: newComment,
      });
      setComments((prev) => [data, ...prev]);
      setNewComment("");
      success(t("lists.commentAdded"));
    } catch (error) {
      console.error("Error adding comment:", error);
      showError(t("lists.commentAddError"));
    }
  };

  /**
   * Handles the deletion of a comment from the list.
   * @param {*} commentId - The ID of the comment to delete.
   * @returns {Promise<void>}
   */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(t("lists.confirmDeleteComment"))) return;

    try {
      await api.delete(`/lists/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      success(t("lists.commentDeleted"));
    } catch (error) {
      console.error("Error deleting comment:", error);
      showError(t("lists.commentDeleteError"));
    }
  };

  /**
   * Handles the deletion of the list.
   * @returns {JSX.Element}
   */
  const handleDeleteList = async () => {
    if (!window.confirm(t("lists.confirmDeleteIrreversible"))) return;

    try {
      await api.delete(`/lists/${listId}`);
      success(t("lists.deleted"));
      navigate("/lists");
    } catch (error) {
      console.error("Error deleting list:", error);
      showError(t("lists.deleteError"));
    }
  };

  /**
   * Handles the removal of content from the list.
   * @param {*} contentId - The ID of the content to remove.
   * @param {*} contentType - The type of content (e.g., movie or series).
   * @returns {Promise<void>}
   */
  const handleRemoveContent = async (contentId, contentType) => {
    if (!window.confirm(t("lists.confirmRemoveContent"))) return;

    try {
      const { data } = await api.delete(
        `/lists/${listId}/${contentType}/${contentId}`,
      );
      setList(data);
      success(t("lists.contentRemoved"));
    } catch (error) {
      console.error("Error removing content:", error);
      showError(t("lists.contentRemoveError"));
    }
  };

  /**
   * Handles the addition of content to the list.
   * @param {*} contentId - The ID of the content to add.
   * @param {*} contentType - The type of content (e.g., movie or series).
   * @returns {Promise<void>}
   */
  const handleAddContent = async (contentId, contentType) => {
    try {
      const { data } = await api.post(
        `/lists/${listId}/${contentType}/${contentId}`,
      );
      setList(data);
      success(t("lists.contentAdded"));
      setShowAddContentModal(false);
    } catch (error) {
      console.error("Error adding content:", error);
      showError(t("lists.contentAddError"));
    }
  };

  /**
   * Handles the update of the list.
   * @param {*} updatedData - The updated data for the list.
   * @returns {Promise<void>}
   */
  const handleUpdateList = async (updatedData) => {
    try {
      const { data } = await api.put(`/lists/${listId}`, updatedData);
      setList(data);
      success(t("lists.updated"));
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating list:", error);
      showError(t("lists.updateError"));
    }
  };

  const formatDate = (dateString) =>
    formatDateTime(dateString, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isOwner = list && user && list.creator?.id === user.id;

  if (loading) {
    return (
      <div className="cm-spinner">
        <div className="cm-reel" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="container cm-page">
        <div className="cm-empty">
          <h3>{t("lists.notFound")}</h3>
          <Link to="/lists" className="btn btn-primary">
            {t("lists.backToLists")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl cm-page list-detail-container">
      <Link to="/lists" className="cm-back-link">
        <i className="bi bi-arrow-left" />
        {t("lists.backToLists")}
      </Link>

      {/* List Info */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="d-flex align-items-start">
            <div className="me-3">
              {list.coverImageUrl ? (
                <img
                  src={list.coverImageUrl}
                  alt={list.title}
                  className="rounded"
                  style={{
                    width: "120px",
                    height: "160px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center rounded bg-secondary text-white"
                  style={{ width: "120px", height: "160px" }}
                >
                  <i className="bi bi-list-ul" style={{ fontSize: "2rem" }}></i>
                </div>
              )}
            </div>

            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <h1 className="mb-0 me-3">{list.title}</h1>
                <span className="cm-tag">
                  <i
                    className={`bi bi-${list.public ? "globe" : "lock"} me-1`}
                  ></i>
                  {list.public ? t("common.public") : t("common.private")}
                </span>
              </div>

              {list.description && <p className="mb-3">{list.description}</p>}

              <div className="d-flex flex-wrap align-items-center text-muted small mb-3">
                <i className="bi bi-person me-1"></i>
                <span className="me-3">
                  {t("common.by", { name: list.creator?.username })}
                </span>
                <i className="bi bi-calendar me-1"></i>
                <span className="me-3">
                  {t("lists.createdAt", { date: formatDate(list.createdAt) })}
                </span>
                {list.updatedAt !== list.createdAt && (
                  <>
                    <i className="bi bi-pencil me-1"></i>
                    <span>
                      {t("lists.updatedAt", {
                        date: formatDate(list.updatedAt),
                      })}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              {list.tags && list.tags.length > 0 && (
                <div className="mb-3">
                  {list.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary me-1 mb-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="cm-big-number">{list.totalItemsCount}</div>
              <p className="card-text text-muted">
                {t("lists.itemsLabel", { count: list.totalItemsCount })}
              </p>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                {isAuthenticated && (
                  <button
                    className={`btn ${
                      list.likedByCurrentUser
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                    onClick={handleLike}
                  >
                    <i
                      className={`bi bi-heart${
                        list.likedByCurrentUser ? "-fill" : ""
                      } me-2`}
                    ></i>
                    {t("lists.likeCount", { count: list.likesCount })}
                  </button>
                )}

                {isOwner && (
                  <>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setShowAddContentModal(true)}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      {t("lists.addContent")}
                    </button>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      {t("lists.editList")}
                    </button>

                    <button
                      className="btn btn-outline-danger"
                      onClick={handleDeleteList}
                    >
                      <i className="bi bi-trash me-2"></i>
                      {t("lists.deleteList")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="row">
        <div className="col-lg-8">
          {/* Movies */}
          {list.movies && list.movies.length > 0 && (
            <div className="mb-5">
              <div className="cm-section-title mt-0">
                <h2>{t("common.movies")}</h2>
                <span className="cm-count">{list.movies.length}</span>
              </div>
              <div className="row">
                {list.movies.map((movie) => (
                  <div className="col-6 col-md-4 col-xl-3 mb-4" key={movie.id}>
                    <div className="position-relative">
                      <MediaCard media={movie} type="movie" />
                      {isOwner && (
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 start-0 m-2"
                          style={{ zIndex: 11 }}
                          onClick={() =>
                            handleRemoveContent(movie.id, "movies")
                          }
                          title={t("lists.removeFromList")}
                          aria-label={t("lists.removeFromList")}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Series */}
          {list.series && list.series.length > 0 && (
            <div className="mb-5">
              <div className="cm-section-title mt-0">
                <h2>{t("common.seriesPlural")}</h2>
                <span className="cm-count">{list.series.length}</span>
              </div>
              <div className="row">
                {list.series.map((series) => (
                  <div className="col-6 col-md-4 col-xl-3 mb-4" key={series.id}>
                    <div className="position-relative">
                      <MediaCard media={series} type="series" />
                      {isOwner && (
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 start-0 m-2"
                          style={{ zIndex: 11 }}
                          onClick={() =>
                            handleRemoveContent(series.id, "series")
                          }
                          title={t("lists.removeFromList")}
                          aria-label={t("lists.removeFromList")}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!list.movies || list.movies.length === 0) &&
            (!list.series || list.series.length === 0) && (
              <div className="cm-empty">
                <h3>{t("lists.emptyList")}</h3>
                {isOwner && (
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => setShowAddContentModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    {t("lists.addFirstContent")}
                  </button>
                )}
              </div>
            )}
        </div>

        {/* Comments */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-chat-dots me-2"></i>
                {t("lists.comments")} ({comments.length})
              </h5>
            </div>
            <div className="card-body">
              {/* Add comment form */}
              {isAuthenticated && list.public && (
                <form onSubmit={handleAddComment} className="mb-3">
                  <div className="mb-2">
                    <textarea
                      className="form-control form-control-sm"
                      rows="3"
                      placeholder={t("lists.commentPlaceholder")}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      maxLength="1000"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={!newComment.trim()}
                  >
                    <i className="bi bi-send me-1"></i>
                    {t("lists.postComment")}
                  </button>
                </form>
              )}

              {/* Comments list */}
              {commentsLoading ? (
                <div className="text-center py-3">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                </div>
              ) : comments.length > 0 ? (
                <div
                  className="comments-list"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-bottom pb-2 mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <strong className="text-primary">
                            {comment.author?.username}
                          </strong>
                          <small className="text-muted ms-2">
                            {formatDate(comment.createdAt)}
                          </small>
                        </div>
                        {(isOwner ||
                          (user && comment.author?.id === user.id)) && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            title={t("lists.deleteComment")}
                            aria-label={t("lists.deleteComment")}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                      <p className="mb-0 mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3">
                  {t("lists.noComments")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddContentModal && (
        <AddContentModal
          onClose={() => setShowAddContentModal(false)}
          onAddContent={handleAddContent}
          existingMovies={list.movies || []}
          existingSeries={list.series || []}
        />
      )}

      {showEditModal && (
        <EditListModal
          list={list}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateList}
        />
      )}
    </div>
  );
};

export default ListDetailView;
