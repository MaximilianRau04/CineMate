import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../toasts";
import SearchableMediaSelect from "./SearchableMediaSelect";
import "./css/CreateForumPost.css";

const CreateForumPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [movieId, setMovieId] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchCategories();
  }, [navigate]);

  /**
   * Fetches the list of forum categories
   * @returns {Promise<void>} - Resolves when categories are fetched
   */
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        "http://localhost:8080/api/forum/categories",
        {
          headers,
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  /**
   * Handles form submission
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>} - Resolves when the post is created
   * @throws {Error} - If the post creation fails
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Titel und Inhalt sind erforderlich");
      return;
    }

    const finalMovieId = seriesId ? "" : movieId;
    const finalSeriesId = movieId ? "" : seriesId;

    setLoading(true);
    setError(null);

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        movieId: finalMovieId || null,
        seriesId: finalSeriesId || null,
      };

      const token = localStorage.getItem("token");
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : { "Content-Type": "application/json" };

      const response = await fetch("http://localhost:8080/api/forum/posts", {
        method: "POST",
        headers,
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const createdPost = await response.json();
        success("Beitrag erfolgreich erstellt!");
        navigate(`/forum/post/${createdPost.id}`);
      } else if (response.status === 401) {
        setError("Sie müssen sich anmelden, um einen Beitrag zu erstellen");
        setTimeout(() => navigate("/"), 2000);
      } else {
        const errorData = await response.text();
        throw new Error(errorData || "Error creating post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showError("Fehler beim Erstellen des Beitrags");
      setError("Fehler beim Erstellen des Beitrags");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="create-forum-post modern-create-page">
      {/* Modern Header */}
      <div className="modern-create-header">
        <div className="header-content">
          <button
            className="modern-back-button"
            onClick={() => navigate("/forum")}
            type="button"
          >
            <span className="back-arrow">←</span>
            <span>Zurück zum Forum</span>
          </button>
          <div className="header-title-section">
            <h1 className="modern-create-title">Neuen Beitrag erstellen</h1>
            <p className="header-subtitle">
              Teile deine Gedanken mit der Community
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="create-form-container enhanced-form-container">
        {error && (
          <div className="error-message enhanced-error-message">{error}</div>
        )}

        <form
          className="create-form enhanced-create-form"
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <div className="form-group enhanced-form-group">
            <label htmlFor="title" className="enhanced-label">
              Titel *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Gib deinem Beitrag einen aussagekräftigen Titel..."
              required
              maxLength={200}
              className="enhanced-input"
            />
            <div className="char-count enhanced-char-count">
              {title.length}/200
            </div>
          </div>

          {/* Category */}
          <div className="form-group enhanced-form-group">
            <label htmlFor="category" className="enhanced-label">
              Kategorie *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="enhanced-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="enhanced-option">
                  {getCategoryDisplayName(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* Media Selection */}
          <div className="form-row enhanced-form-row">
            <div className="form-group enhanced-form-group">
              <label htmlFor="movieSelect" className="enhanced-label">
                Film (optional)
              </label>
              <SearchableMediaSelect
                type="movie"
                value={movieId}
                onChange={setMovieId}
                placeholder="Film suchen und auswählen..."
                disabled={!!seriesId}
                className="enhanced-media-select"
              />
              {seriesId && (
                <div className="info-text enhanced-info-text">
                  Film-Auswahl ist deaktiviert, da bereits eine Serie ausgewählt
                  wurde.
                </div>
              )}
            </div>

            <div className="form-group enhanced-form-group">
              <label htmlFor="seriesSelect" className="enhanced-label">
                Serie (optional)
              </label>
              <SearchableMediaSelect
                type="series"
                value={seriesId}
                onChange={setSeriesId}
                placeholder="Serie suchen und auswählen..."
                disabled={!!movieId}
                className="enhanced-media-select"
              />
              {movieId && (
                <div className="info-text enhanced-info-text">
                  Serien-Auswahl ist deaktiviert, da bereits ein Film ausgewählt
                  wurde.
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="form-group enhanced-form-group">
            <label htmlFor="content" className="enhanced-label">
              Inhalt *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Schreibe hier deinen Beitrag..."
              required
              rows="12"
              maxLength={5000}
              className="enhanced-textarea"
            />
            <div className="char-count enhanced-char-count">
              {content.length}/5000
            </div>
          </div>

          {/* Tips */}
          <div className="form-tips enhanced-form-tips">
            <h3>💡 Tipps für einen guten Beitrag:</h3>
            <ul className="enhanced-tips-list">
              <li>Verwende einen aussagekräftigen Titel</li>
              <li>Wähle die passende Kategorie</li>
              <li>Verknüpfe einen Film oder eine Serie, falls relevant</li>
              <li>Strukturiere deinen Text mit Absätzen</li>
              <li>Sei respektvoll und konstruktiv</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="form-actions enhanced-form-actions">
            <button
              type="button"
              className="cancel-btn enhanced-cancel-btn"
              onClick={() => navigate("/forum")}
              disabled={loading}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="submit-btn enhanced-submit-btn"
              disabled={loading || !title.trim() || !content.trim()}
            >
              {loading ? "Wird erstellt..." : "Beitrag erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForumPost;
