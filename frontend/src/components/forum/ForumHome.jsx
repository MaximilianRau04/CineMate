import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../toasts";
import "./css/ForumHome.css";

const ForumHome = () => {
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [mediaInfoCache, setMediaInfoCache] = useState({});

  const getHeaders = (extra = {}) => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}`, ...extra } : extra;
  };

  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  /**
   * Fetches media information for a post
   * @param {object} post - The post object
   * @returns {Promise<object|null>} - Media information or null
   */
  const fetchMediaInfo = useCallback(
    async (post) => {
      const cacheKey = post.movieId
        ? `movie_${post.movieId}`
        : `series_${post.seriesId}`;

      // Check cache first
      if (mediaInfoCache[cacheKey]) {
        return mediaInfoCache[cacheKey];
      }

      try {
        if (post.movieId) {
          const response = await fetch(
            `http://localhost:8080/api/movies/${post.movieId}`,
            {
              headers: getHeaders(),
            },
          );
          if (response.ok) {
            const movie = await response.json();
            const mediaInfo = { type: "movie", data: movie };
            setMediaInfoCache((prev) => ({ ...prev, [cacheKey]: mediaInfo }));
            return mediaInfo;
          }
        } else if (post.seriesId) {
          const response = await fetch(
            `http://localhost:8080/api/series/${post.seriesId}`,
            {
              headers: getHeaders(),
            },
          );
          if (response.ok) {
            const series = await response.json();
            const mediaInfo = { type: "series", data: series };
            setMediaInfoCache((prev) => ({ ...prev, [cacheKey]: mediaInfo }));
            return mediaInfo;
          }
        }
      } catch (error) {
        console.error("Error fetching media info:", error);
      }
      return null;
    },
    [mediaInfoCache],
  );

  /**
   * Fetches the current user information
   * @returns {Promise<void>} - Resolves when the user data is fetched
   * @throws {Error} - If fetching user data fails
   */
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/users/me", {
        headers: getHeaders(),
      });
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  /**
   * Fetches the available forum categories
   * @returns {Promise<void>} - Resolves when categories are fetched
   * @throws {Error} - If fetching categories fails
   */
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/forum/categories",
        {
          headers: getHeaders(),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  /**
   * Fetches the pinned posts
   * @return {Promise<void>} - Resolves when pinned posts are fetched
   * @throws {Error} - If fetching pinned posts fails
   */
  const fetchPinnedPosts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/forum/posts/pinned",
        {
          headers: getHeaders(),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPinnedPosts(data);
    } catch (error) {
      console.error("Error fetching pinned posts:", error);
    }
  };

  /**
   * Fetches the forum posts
   * @param {number} currentPage - The current page number
   * @param {string} selectedCategory - The selected category filter
   * @param {string} sortBy - The sorting criteria
   * @returns {Promise<void>} - Resolves when posts are fetched
   * @throws {Error} - If fetching posts fails
   */
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8080/api/forum/posts?page=${currentPage}&size=10`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      if (sortBy) {
        url += `&sortBy=${sortBy}`;
      }
      if (selectedMediaType) {
        url += `&mediaType=${selectedMediaType}`;
      }

      const response = await fetch(url, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setPosts(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Fehler beim Laden der Beiträge");
      setLoading(false);
    }
  }, [currentPage, selectedCategory, sortBy, selectedMediaType]);

  useEffect(() => {
    fetchCategories();
    fetchPinnedPosts();
    fetchCurrentUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Load media info for posts that have linked media
  useEffect(() => {
    const loadMediaInfo = async () => {
      const allPosts = [...posts, ...pinnedPosts];
      const postsWithMedia = allPosts.filter(
        (post) => post.movieId || post.seriesId,
      );

      for (const post of postsWithMedia) {
        const cacheKey = post.movieId
          ? `movie_${post.movieId}`
          : `series_${post.seriesId}`;
        if (!mediaInfoCache[cacheKey]) {
          await fetchMediaInfo(post);
        }
      }
    };

    if (posts.length > 0 || pinnedPosts.length > 0) {
      loadMediaInfo();
    }
  }, [posts, pinnedPosts, mediaInfoCache, fetchMediaInfo]);

  /**
   * Handles the search functionality
   * @param {string} searchQuery - The query to search for
   * @returns {Promise<void>} - Resolves when search results are fetched
   * @throws {Error} - If searching posts fails
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/forum/posts/search?query=${encodeURIComponent(
          searchQuery,
        )}&page=${currentPage}&size=10`,
        { headers: getHeaders() },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setPosts(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error searching posts:", error);
      setError("Fehler bei der Suche");
      setLoading(false);
    }
  };

  /**
   * Formats date string
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

    return date.toLocaleDateString("de-DE");
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
   * Renders media badge for a post
   * @param {object} post - The post object
   * @returns {JSX.Element|null} - Media badge component
   */
  const renderMediaBadge = (post) => {
    const cacheKey = post.movieId
      ? `movie_${post.movieId}`
      : `series_${post.seriesId}`;
    const mediaInfo = mediaInfoCache[cacheKey];

    if (post.movieId) {
      return (
        <span
          className="media-badge movie-badge"
          title={
            mediaInfo ? `Film: ${mediaInfo.data.title}` : "Verknüpfter Film"
          }
        >
          🎬 {mediaInfo ? mediaInfo.data.title : "Film"}
        </span>
      );
    } else if (post.seriesId) {
      return (
        <span
          className="media-badge series-badge"
          title={
            mediaInfo ? `Serie: ${mediaInfo.data.title}` : "Verknüpfte Serie"
          }
        >
          📺 {mediaInfo ? mediaInfo.data.title : "Serie"}
        </span>
      );
    }
    return null;
  };

  /**
   * Navigates to the create post page if user is authenticated
   * @returns {void}
   */
  const handleCreatePost = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    navigate("/forum/create-post");
  };

  /**
   * Checks if the current user can delete a post (admin or author)
   * @param {object} post - The post object
   * @returns {boolean} - Whether the user can delete the post
   */
  const canDeletePost = (post) => {
    if (!currentUser) return false;
    return currentUser.role === "ADMIN" || currentUser.id === post.author?.id;
  };

  /**
   * Handles deleting a post from the home page
   * @param {string} postId - The ID of the post to delete
   * @param {Event} e - The click event
   * @returns {Promise<void>} - Resolves when the post is deleted
   */
  const handleDeletePost = async (postId, e) => {
    e.stopPropagation();

    if (!window.confirm("Möchten Sie diesen Beitrag wirklich löschen?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        currentUser.role === "ADMIN"
          ? `http://localhost:8080/api/forum/admin/posts/${postId}`
          : `http://localhost:8080/api/forum/posts/${postId}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        setPinnedPosts((prevPinned) =>
          prevPinned.filter((post) => post.id !== postId),
        );
        success("Beitrag erfolgreich gelöscht!");
      } else {
        showError("Fehler beim Löschen des Beitrags");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showError("Fehler beim Löschen des Beitrags");
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="forum-home">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Lädt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forum-home">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-home">
      {/* Header */}
      <div className="forum-header">
        <h1>Forum</h1>
        <button className="create-btn" onClick={handleCreatePost}>
          <span>+</span> Neuer Beitrag
        </button>
      </div>

      {/* Search and Filters */}
      <div className="forum-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Beiträge suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {getCategoryDisplayName(category)}
              </option>
            ))}
          </select>

          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value)}
            className="filter-select"
          >
            <option value="">Alle Medien</option>
            <option value="movie">Nur Filme</option>
            <option value="series">Nur Serien</option>
            <option value="none">Ohne Medien</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="">Neueste</option>
            <option value="popular">Beliebteste</option>
            <option value="recent">Aktuelle</option>
          </select>
        </div>
      </div>

      {/* Pinned Posts */}
      {pinnedPosts.length > 0 && (
        <div className="pinned-section">
          <h2>Wichtige Beiträge</h2>
          <div className="posts-grid">
            {pinnedPosts.map((post) => (
              <div
                key={post.id}
                className="post-card pinned"
                onClick={() => navigate(`/forum/post/${post.id}`)}
              >
                <div className="post-meta">
                  <span className="category">
                    {getCategoryDisplayName(post.category)}
                  </span>
                  <span className="pinned-badge">📌</span>
                  {renderMediaBadge(post)}
                  {canDeletePost(post) && (
                    <button
                      className="delete-post-btn"
                      onClick={(e) => handleDeletePost(post.id, e)}
                      title="Beitrag löschen"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <h3>{post.title}</h3>
                <div className="post-info">
                  <span>{post.author?.username}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <div className="post-stats">
                    <span>👍 {post.likesCount || 0}</span>
                    <span>💬 {post.repliesCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts */}
      <div className="posts-section">
        <h2>Alle Beiträge</h2>

        {posts.length === 0 ? (
          <div className="no-posts">
            <p>Noch keine Beiträge vorhanden.</p>
            <button onClick={handleCreatePost} className="create-first-btn">
              Ersten Beitrag erstellen
            </button>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div
                key={post.id}
                className="post-card"
                onClick={() => navigate(`/forum/post/${post.id}`)}
              >
                <div className="post-meta">
                  <span className="category">
                    {getCategoryDisplayName(post.category)}
                  </span>
                  {renderMediaBadge(post)}
                  {canDeletePost(post) && (
                    <button
                      className="delete-post-btn"
                      onClick={(e) => handleDeletePost(post.id, e)}
                      title="Beitrag löschen"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <h3>{post.title}</h3>
                <p className="post-preview">
                  {post.content.length > 120
                    ? `${post.content.substring(0, 120)}...`
                    : post.content}
                </p>
                <div className="post-info">
                  <span>{post.author?.username}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <div className="post-stats">
                    <span>👍 {post.likesCount || 0}</span>
                    <span>💬 {post.repliesCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="page-btn"
            >
              ← Zurück
            </button>
            <span className="page-info">
              Seite {currentPage + 1} von {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="page-btn"
            >
              Weiter →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumHome;
