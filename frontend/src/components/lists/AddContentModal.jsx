import React, { useState, useEffect } from "react";

const AddContentModal = ({
  onClose,
  onAddContent,
  existingMovies = [],
  existingSeries = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [contentType, setContentType] = useState("movies");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api";

  /**
   * Effect to search for content when the search query or content type changes.
   */
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      searchContent();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, contentType]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Search for content based on the current search query and content type.
   * Filters out content that is already in the list.
   */
  const searchContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/${contentType}?search=${encodeURIComponent(
          searchQuery
        )}&page=0&size=20`
      );

      if (response.ok) {
        const data = await response.json();
        // Filter out content that's already in the list
        const existingIds =
          contentType === "movies"
            ? existingMovies.map((m) => m.id)
            : existingSeries.map((s) => s.id);

        const filteredResults = (data.content || data).filter(
          (item) => !existingIds.includes(item.id)
        );

        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error("Error searching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = (content) => {
    onAddContent(content.id, contentType);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle me-2"></i>
              Inhalt zur Liste hinzufügen
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {/* Content Type Selection */}
            <div className="mb-3">
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="contentType"
                  id="movies"
                  value="movies"
                  checked={contentType === "movies"}
                  onChange={(e) => setContentType(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="movies">
                  <i className="bi bi-film me-2"></i>
                  Filme
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="contentType"
                  id="series"
                  value="series"
                  checked={contentType === "series"}
                  onChange={(e) => setContentType(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="series">
                  <i className="bi bi-tv me-2"></i>
                  Serien
                </label>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${
                    contentType === "movies" ? "Filme" : "Serien"
                  } suchen...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
              <div className="form-text">
                Gib mindestens 3 Zeichen ein, um zu suchen
              </div>
            </div>

            {/* Search Results */}
            <div
              className="search-results"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="row">
                  {searchResults.map((content) => (
                    <div className="col-md-6 mb-3" key={content.id}>
                      <div className="card h-100">
                        <div className="row g-0 h-100">
                          <div className="col-4">
                            <img
                              src={
                                content.posterUrl ||
                                "https://via.placeholder.com/100x150?text=No+Image"
                              }
                              alt={content.title}
                              className="img-fluid h-100 w-100"
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/100x150?text=No+Image";
                              }}
                            />
                          </div>
                          <div className="col-8">
                            <div className="card-body p-2 d-flex flex-column h-100">
                              <h6
                                className="card-title mb-1"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {content.title}
                              </h6>
                              <p
                                className="card-text text-muted mb-1"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {content.genre}
                              </p>
                              <p
                                className="card-text text-muted mb-2"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {content.releaseYear || content.startYear}
                              </p>
                              <div className="mt-auto">
                                <button
                                  className="btn btn-primary btn-sm w-100"
                                  onClick={() => handleAddContent(content)}
                                >
                                  <i className="bi bi-plus me-1"></i>
                                  Hinzufügen
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim().length > 2 ? (
                <div className="text-center py-4 text-muted">
                  <i
                    className="bi bi-search"
                    style={{ fontSize: "2rem", opacity: 0.3 }}
                  ></i>
                  <p className="mt-2">Keine Ergebnisse gefunden</p>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i
                    className="bi bi-search"
                    style={{ fontSize: "2rem", opacity: 0.3 }}
                  ></i>
                  <p className="mt-2">
                    Suche nach {contentType === "movies" ? "Filmen" : "Serien"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContentModal;
