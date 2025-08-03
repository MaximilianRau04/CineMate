import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";
import MediaCard from "../profile/MediaCard";
import AddContentModal from "./AddContentModal";
import EditListModal from "./EditListModal";

const ListDetailView = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();

  const [list, setList] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api";

  useEffect(() => {
    loadList();
    loadComments();
  }, [listId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * fetches the list details from the API.
   */
  const loadList = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setList(data);
      } else if (response.status === 404) {
        showError("Liste nicht gefunden");
        navigate("/lists");
      } else if (response.status === 403) {
        showError("Du hast keine Berechtigung, diese Liste zu sehen");
        navigate("/lists");
      }
    } catch (error) {
      console.error("Error loading list:", error);
      showError("Fehler beim Laden der Liste");
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
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/lists/${listId}/comments`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
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
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lists/${listId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const updatedList = await response.json();
        setList(updatedList);
      }
    } catch (error) {
      console.error("Error liking list:", error);
      showError("Fehler beim Liken der Liste");
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
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lists/${listId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
        success("Kommentar hinzugefügt!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      showError("Fehler beim Hinzufügen des Kommentars");
    }
  };

  /**
   * Handles the deletion of a comment from the list.
   * @param {*} commentId - The ID of the comment to delete.
   * @returns {Promise<void>}
   */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Kommentar wirklich löschen?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/lists/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        success("Kommentar gelöscht!");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showError("Fehler beim Löschen des Kommentars");
    }
  };

  /**
   * Handles the deletion of the list.
   * @returns {JSX.Element}
   */
  const handleDeleteList = async () => {
    if (
      !window.confirm(
        "Liste wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        success("Liste gelöscht!");
        navigate("/lists");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      showError("Fehler beim Löschen der Liste");
    }
  };

  /**
   * Handles the removal of content from the list.
   * @param {*} contentId - The ID of the content to remove.
   * @param {*} contentType - The type of content (e.g., movie or series).
   * @returns {Promise<void>}
   */
  const handleRemoveContent = async (contentId, contentType) => {
    if (!window.confirm("Inhalt aus Liste entfernen?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/lists/${listId}/${contentType}/${contentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const updatedList = await response.json();
        setList(updatedList);
        success("Inhalt entfernt!");
      }
    } catch (error) {
      console.error("Error removing content:", error);
      showError("Fehler beim Entfernen des Inhalts");
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/lists/${listId}/${contentType}/${contentId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const updatedList = await response.json();
        setList(updatedList);
        success("Inhalt hinzugefügt!");
        setShowAddContentModal(false);
      }
    } catch (error) {
      console.error("Error adding content:", error);
      showError("Fehler beim Hinzufügen des Inhalts");
    }
  };

  /**
   * Handles the update of the list.
   * @param {*} updatedData - The updated data for the list.
   * @returns {Promise<void>}
   */
  const handleUpdateList = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedList = await response.json();
        setList(updatedList);
        success("Liste aktualisiert!");
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating list:", error);
      showError("Fehler beim Aktualisieren der Liste");
    }
  };

  /**
   * Formats a date string into a more readable format.
   * @param {*} dateString - The date string to format.
   * @returns {string} - The formatted date string.
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwner = list && user && list.creator?.id === user.id;

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h3>Liste nicht gefunden</h3>
          <Link to="/lists" className="btn btn-primary">
            Zurück zu den Listen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/lists" className="text-decoration-none">
                  Listen
                </Link>
              </li>
              <li className="breadcrumb-item active">{list.title}</li>
            </ol>
          </nav>
        </div>
      </div>

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
                    e.target.src =
                      "https://via.placeholder.com/120x160?text=Liste";
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
                <h1 className="text-white mb-0 me-3">{list.title}</h1>
                <span
                  className={`badge ${
                    list.public ? "bg-success" : "bg-secondary"
                  }`}
                >
                  <i
                    className={`bi bi-${list.public ? "globe" : "lock"} me-1`}
                  ></i>
                  {list.public ? "Öffentlich" : "Privat"}
                </span>
              </div>

              {list.description && (
                <p className="text-light mb-3">{list.description}</p>
              )}

              <div className="d-flex align-items-center text-muted mb-3">
                <i className="bi bi-person me-1"></i>
                <span className="me-3">von {list.creator?.username}</span>
                <i className="bi bi-calendar me-1"></i>
                <span className="me-3">
                  Erstellt: {formatDate(list.createdAt)}
                </span>
                {list.updatedAt !== list.createdAt && (
                  <>
                    <i className="bi bi-pencil me-1"></i>
                    <span>Aktualisiert: {formatDate(list.updatedAt)}</span>
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
              <h5 className="card-title">{list.totalItemsCount}</h5>
              <p className="card-text text-muted">
                {list.totalItemsCount === 1 ? "Element" : "Elemente"}
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
                    {list.likesCount} {list.likesCount === 1 ? "Like" : "Likes"}
                  </button>
                )}

                {isOwner && (
                  <>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setShowAddContentModal(true)}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Inhalt hinzufügen
                    </button>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Liste bearbeiten
                    </button>

                    <button
                      className="btn btn-outline-danger"
                      onClick={handleDeleteList}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Liste löschen
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
              <h3 className="text-white mb-3">
                <i className="bi bi-film me-2"></i>
                Filme ({list.movies.length})
              </h3>
              <div className="row">
                {list.movies.map((movie) => (
                  <div
                    className="col-md-6 col-lg-4 col-xl-3 mb-3"
                    key={movie.id}
                  >
                    <div className="position-relative">
                      <MediaCard media={movie} type="movie" />
                      {isOwner && (
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                          onClick={() =>
                            handleRemoveContent(movie.id, "movies")
                          }
                          title="Aus Liste entfernen"
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
              <h3 className="text-white mb-3">
                <i className="bi bi-tv me-2"></i>
                Serien ({list.series.length})
              </h3>
              <div className="row">
                {list.series.map((series) => (
                  <div
                    className="col-md-6 col-lg-4 col-xl-3 mb-3"
                    key={series.id}
                  >
                    <div className="position-relative">
                      <MediaCard media={series} type="series" />
                      {isOwner && (
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                          onClick={() =>
                            handleRemoveContent(series.id, "series")
                          }
                          title="Aus Liste entfernen"
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
              <div className="text-center py-5">
                <i
                  className="bi bi-inbox"
                  style={{ fontSize: "4rem", opacity: 0.3 }}
                ></i>
                <h4 className="text-muted mt-3">Diese Liste ist noch leer</h4>
                {isOwner && (
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => setShowAddContentModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Ersten Inhalt hinzufügen
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
                Kommentare ({comments.length})
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
                      placeholder="Schreibe einen Kommentar..."
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
                    Kommentieren
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
                            title="Kommentar löschen"
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
                  Noch keine Kommentare vorhanden.
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
