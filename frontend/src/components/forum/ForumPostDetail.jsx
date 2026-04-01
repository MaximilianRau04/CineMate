import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../toasts";
import "./css/ForumPostDetail.css";
import api from "../../utils/api";

const ForumPostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    subscriberCount: 0,
  });
  const [replyContent, setReplyContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [mediaInfo, setMediaInfo] = useState(null);

  useEffect(() => {
    fetchPost();
    fetchReplies();
    fetchSubscriptionStatus();
    fetchCurrentUser();
  }, [postId, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch media info when post is loaded
  useEffect(() => {
    if (post) {
      fetchMediaInfo();
    }
  }, [post]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Fetches the forum post details
   * @return {Promise<void>} - Resolves when the post data is fetched
   * @throws {Error} - If fetching post data fails
   */
  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/forum/posts/${postId}`);
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Beitrag konnte nicht geladen werden");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches replies for the post
   * @returns {Promise<void>} - Resolves when replies are fetched
   * @throws {Error} - If fetching replies fails
   */
  const fetchReplies = async () => {
    try {
      const { data } = await api.get(
        `/forum/posts/${postId}/replies?page=${currentPage}&size=10`,
      );
      setReplies(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  /**
   * Fetches subscription status
   * @return {Promise<void>} - Resolves when subscription status is fetched
   * @throws {Error} - If fetching subscription status fails
   */
  const fetchSubscriptionStatus = async () => {
    try {
      const { data } = await api.get(
        `/forum/posts/${postId}/subscription-status`,
      );

      // Handle different possible field names from backend
      const normalizedData = {
        isSubscribed: data.isSubscribed ?? data.subscribed ?? false,
        subscriberCount: data.subscriberCount ?? data.subscriber_count ?? 0,
      };

      setSubscriptionStatus(normalizedData);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  /**
   * Fetches current user information
   * @return {Promise<void>} - Resolves when current user data is fetched
   * @throws {Error} - If fetching current user fails
   */
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data: userData } = await api.get("/users/me");
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  /**
   * Fetches media information for the post
   * @return {Promise<void>} - Resolves when media data is fetched
   */
  const fetchMediaInfo = async () => {
    if (!post) return;

    try {
      if (post.movieId) {
        const { data: movie } = await api.get(`/movies/${post.movieId}`);
        setMediaInfo({ type: "movie", data: movie });
      } else if (post.seriesId) {
        const { data: series } = await api.get(`/series/${post.seriesId}`);
        setMediaInfo({ type: "series", data: series });
      } else {
        setMediaInfo(null);
      }
    } catch (error) {
      console.error("Error fetching media info:", error);
      setMediaInfo(null);
    }
  };

  /**
   * Handles subscription toggle
   * @returns {Promise<void>} - Resolves when subscription status is toggled
   * @throws {Error} - If toggling subscription fails
   */
  const handleSubscribe = async () => {
    try {
      const wasSubscribed = subscriptionStatus.isSubscribed;

      if (wasSubscribed) {
        await api.delete(`/forum/posts/${postId}/unsubscribe`);
      } else {
        await api.post(`/forum/posts/${postId}/subscribe`);
      }

      const action = wasSubscribed ? "abbestellt" : "abonniert";
      success(`Beitrag erfolgreich ${action}!`);
      await fetchSubscriptionStatus();
    } catch (error) {
      console.error("Error toggling subscription:", error);
      showError("Fehler beim Ändern des Abonnement-Status");
    }
  };

  /**
   * Handles reply submission
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>} - Resolves when the reply is submitted
   */
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      await api.post(`/forum/posts/${postId}/replies`, {
        content: replyContent.trim(),
      });
      setReplyContent("");
      fetchReplies();
      fetchPost();
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setSubmittingReply(false);
    }
  };

  /**
   * Handles like toggle
   * @returns {Promise<void>} - Resolves when like status is toggled
   * @throws {Error} - If toggling like fails
   */
  const handleLike = async () => {
    try {
      if (post.likedByCurrentUser) {
        await api.delete(`/forum/posts/${postId}/like`);
      } else {
        await api.post(`/forum/posts/${postId}/like`);
      }
      fetchPost();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  /**
   * Formats date to readable format
   * @param {string} dateString - The date string to format
   * @returns {string} - Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Heute";
    if (diffDays === 2) return "Gestern";
    if (diffDays <= 7) return `vor ${diffDays - 1} Tagen`;

    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /**
   * Returns category display name
   * @param {string} category - The category key
   * @returns {string} - The display name for the category
   */
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      GENERAL: "Allgemein",
      MOVIE_DISCUSSION: "Filme",
      SERIES_DISCUSSION: "Serien",
      RECOMMENDATIONS: "Empfehlungen",
      REVIEWS: "Bewertungen",
      NEWS: "News",
      OFF_TOPIC: "Off-Topic",
    };
    return categoryMap[category] || category;
  };

  /**
   * Checks if the current user can edit a post or reply (only author can edit)
   * @param {object} author - The author of the post/reply
   * @returns {boolean} - Whether the user can edit
   */
  const canEdit = (author) => {
    if (!currentUser) return false;
    return currentUser.id === author.id;
  };

  /**
   * Checks if the current user can delete a post or reply (author or admin)
   * @param {object} author - The author of the post/reply
   * @returns {boolean} - Whether the user can delete
   */
  const canDelete = (author) => {
    if (!currentUser) return false;
    return currentUser.id === author.id || currentUser.role === "ADMIN";
  };

  /**
   * Handles editing a post
   * @returns {Promise<void>} - Resolves when the post is updated
   */
  const handleEditPost = async () => {
    try {
      await api.put(`/forum/posts/${postId}`, {
        title: post.title,
        content: editPostContent,
        category: post.category,
      });
      setEditingPost(false);
      fetchPost();
      success("Beitrag erfolgreich bearbeitet!");
    } catch (error) {
      console.error("Error editing post:", error);
      showError("Fehler beim Bearbeiten des Beitrags");
    }
  };

  /**
   * Handles deleting a post
   * @returns {Promise<void>} - Resolves when the post is deleted
   */
  const handleDeletePost = async () => {
    if (!window.confirm("Möchten Sie diesen Beitrag wirklich löschen?")) {
      return;
    }

    try {
      const endpoint =
        currentUser.role === "ADMIN"
          ? `/forum/admin/posts/${postId}`
          : `/forum/posts/${postId}`;

      await api.delete(endpoint);
      success("Beitrag erfolgreich gelöscht!");
      navigate("/forum");
    } catch (error) {
      console.error("Error deleting post:", error);
      showError("Fehler beim Löschen des Beitrags");
    }
  };

  /**
   * Handles editing a reply
   * @param {string} replyId - The ID of the reply to edit
   * @returns {Promise<void>} - Resolves when the reply is updated
   */
  const handleEditReply = async (replyId) => {
    try {
      await api.put(`/forum/replies/${replyId}`, {
        content: editReplyContent,
      });
      setEditingReplyId(null);
      setEditReplyContent("");
      fetchReplies();
      success("Antwort erfolgreich bearbeitet!");
    } catch (error) {
      console.error("Error editing reply:", error);
      showError("Fehler beim Bearbeiten der Antwort");
    }
  };

  /**
   * Handles deleting a reply
   * @param {string} replyId - The ID of the reply to delete
   * @returns {Promise<void>} - Resolves when the reply is deleted
   */
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Möchten Sie diese Antwort wirklich löschen?")) {
      return;
    }

    try {
      await api.delete(`/forum/replies/${replyId}`);
      fetchReplies();
      success("Antwort erfolgreich gelöscht!");
    } catch (error) {
      console.error("Error deleting reply:", error);
      showError("Fehler beim Löschen der Antwort");
    }
  };

  /**
   * Starts editing a post
   */
  const startEditingPost = () => {
    setEditPostContent(post.content);
    setEditingPost(true);
  };

  /**
   * Starts editing a reply
   * @param {object} reply - The reply to edit
   */
  const startEditingReply = (reply) => {
    setEditReplyContent(reply.content);
    setEditingReplyId(reply.id);
  };

  /**
   * Cancels editing
   */
  const cancelEditing = () => {
    setEditingPost(false);
    setEditingReplyId(null);
    setEditPostContent("");
    setEditReplyContent("");
  };

  if (loading) {
    return (
      <div className="forum-detail">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Lädt...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="forum-detail">
        <div className="error-container">
          <p>{error || "Beitrag nicht gefunden"}</p>
          <button onClick={() => navigate("/forum")}>Zurück zum Forum</button>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-detail modern-forum-detail">
      {/* Hero Header */}
      <div className="detail-hero">
        <div className="hero-content">
          <div className="hero-header">
            <button
              className="modern-back-btn"
              onClick={() => navigate("/forum")}
            >
              <span className="back-icon">←</span>
              <span>Zurück zum Forum</span>
            </button>
            <div className="post-category-badge">
              {getCategoryDisplayName(post.category)}
            </div>
          </div>
          <h1 className="hero-title">{post.title}</h1>
          <div className="hero-meta">
            <div className="author-section">
              <div className="author-avatar">
                {post.author.username.charAt(0).toUpperCase()}
              </div>
              <div className="author-details">
                <span className="author-name">{post.author.username}</span>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <div className="post-badges">
              {post.pinned && (
                <span className="status-badge pinned">📌 Angepinnt</span>
              )}
              {post.locked && (
                <span className="status-badge locked">🔒 Gesperrt</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Post Content */}
        <div className="main-post-card">
          <div className="post-content">
            {editingPost ? (
              <div className="edit-post-form">
                <textarea
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  className="edit-textarea"
                  rows="6"
                />
                <div className="edit-actions">
                  <button onClick={handleEditPost} className="save-btn">
                    Speichern
                  </button>
                  <button onClick={cancelEditing} className="cancel-btn">
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>{post.content}</p>
                {(canEdit(post.author) || canDelete(post.author)) && (
                  <div className="post-actions">
                    {canEdit(post.author) && (
                      <button onClick={startEditingPost} className="edit-btn">
                        ✏️ Bearbeiten
                      </button>
                    )}
                    {canDelete(post.author) && (
                      <button onClick={handleDeletePost} className="delete-btn">
                        🗑️ Löschen
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Related Media Section */}
          {mediaInfo && (
            <div className="related-media-section">
              <h4>Verknüpftes Medium</h4>
              <div className="media-card">
                <div className="media-poster">
                  {mediaInfo.data.posterUrl ? (
                    <img
                      src={mediaInfo.data.posterUrl}
                      alt={mediaInfo.data.title || mediaInfo.data.name}
                      className="poster-image"
                    />
                  ) : (
                    <div className="poster-placeholder">
                      {mediaInfo.type === "movie" ? "🎬" : "📺"}
                    </div>
                  )}
                </div>
                <div className="media-info">
                  <h5 className="media-title">
                    {mediaInfo.data.title || mediaInfo.data.name}
                  </h5>
                  <p className="media-type">
                    {mediaInfo.type === "movie" ? "Film" : "Serie"}
                    {mediaInfo.data.releaseYear &&
                      ` • ${mediaInfo.data.releaseYear}`}
                  </p>
                  {mediaInfo.data.overview && (
                    <p className="media-description">
                      {mediaInfo.data.overview.length > 150
                        ? `${mediaInfo.data.overview.substring(0, 150)}...`
                        : mediaInfo.data.overview}
                    </p>
                  )}
                  <div className="media-actions">
                    <button
                      className="view-media-btn"
                      onClick={() =>
                        navigate(
                          mediaInfo.type === "movie"
                            ? `/movies/${mediaInfo.data.id}`
                            : `/series/${mediaInfo.data.id}`,
                        )
                      }
                    >
                      {mediaInfo.type === "movie"
                        ? "Film ansehen"
                        : "Serie ansehen"}
                    </button>
                    <button
                      className="find-similar-btn"
                      onClick={() =>
                        navigate(
                          `/forum?${mediaInfo.type}Id=${mediaInfo.data.id}`,
                        )
                      }
                    >
                      Ähnliche Posts finden
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="post-interactions">
            <div className="interaction-buttons">
              {currentUser && (
                <>
                  <button
                    className={`interaction-btn like-btn ${
                      post.likedByCurrentUser ? "active" : ""
                    }`}
                    onClick={handleLike}
                  >
                    <span className="btn-icon">👍</span>
                    <span className="btn-text">{post.likes || 0}</span>
                  </button>
                  <button
                    className={`interaction-btn subscribe-btn ${
                      subscriptionStatus.isSubscribed ? "active" : ""
                    }`}
                    onClick={handleSubscribe}
                  >
                    <span className="btn-icon">
                      {subscriptionStatus.isSubscribed ? "🔔" : "🔕"}
                    </span>
                    <span className="btn-text">
                      {subscriptionStatus.isSubscribed
                        ? "Abonniert"
                        : "Abonnieren"}
                    </span>
                  </button>
                </>
              )}
            </div>
            <div className="post-stats">
              <div className="stat-item">
                <span className="stat-icon">💬</span>
                <span>{replies.length} Antworten</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👁️</span>
                <span>{post.views || 0} Aufrufe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {currentUser && !post.locked && (
          <div className="reply-form-card">
            <h4>Antwort schreiben</h4>
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Schreibe deine Antwort..."
                rows="4"
                className="reply-textarea"
                required
              />
              <div className="reply-form-actions">
                <button
                  type="submit"
                  className="submit-reply-btn"
                  disabled={submittingReply || !replyContent.trim()}
                >
                  {submittingReply ? "Wird gesendet..." : "Antwort senden"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Replies Section */}
        <div className="replies-section">
          <div className="replies-header">
            <h3>
              Antworten{" "}
              <span className="replies-count">({replies.length})</span>
            </h3>
          </div>

          <div className="replies-list">
            {replies.length === 0 ? (
              <div className="empty-replies">
                <div className="empty-icon">💬</div>
                <h4>Noch keine Antworten</h4>
                <p>Sei der erste, der auf diesen Beitrag antwortet!</p>
              </div>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="reply-card">
                  <div className="reply-header">
                    <div className="reply-author-section">
                      <div className="reply-avatar">
                        {reply.author.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="reply-author-info">
                        <span className="reply-author-name">
                          {reply.author.username}
                        </span>
                        <span className="reply-date">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                    </div>
                    {(canEdit(reply.author) || canDelete(reply.author)) && (
                      <div className="reply-actions">
                        {canEdit(reply.author) && (
                          <button
                            onClick={() => startEditingReply(reply)}
                            className="edit-reply-btn"
                            title="Antwort bearbeiten"
                          >
                            ✏️
                          </button>
                        )}
                        {canDelete(reply.author) && (
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            className="delete-reply-btn"
                            title="Antwort löschen"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="reply-content">
                    {editingReplyId === reply.id ? (
                      <div className="edit-reply-form">
                        <textarea
                          value={editReplyContent}
                          onChange={(e) => setEditReplyContent(e.target.value)}
                          className="edit-reply-textarea"
                          rows="3"
                        />
                        <div className="edit-reply-actions">
                          <button
                            onClick={() => handleEditReply(reply.id)}
                            className="save-reply-btn"
                          >
                            Speichern
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="cancel-reply-btn"
                          >
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{reply.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                ← Zurück
              </button>
              <span className="pagination-info">
                Seite {currentPage + 1} von {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                Weiter →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPostDetail;
