import React, { useState, useEffect } from "react";
import ListCard from "./ListCard";
import CreateListModal from "./CreateListModal";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";
import "../../assets/custom-lists.css";

const CustomListsPage = () => {
  const [lists, setLists] = useState([]);
  const [myLists, setMyLists] = useState([]);
  const [activeTab, setActiveTab] = useState("public");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();

  const API_BASE_URL = "http://localhost:8080/api";

  /**
   * Validate JWT token format
   * @param {string} token
   * @returns {boolean}
   */
  const isValidJWT = (token) => {
    if (!token || typeof token !== "string") return false;
    const parts = token.split(".");
    return parts.length === 3;
  };

  /**
   * Load public lists from the API.
   * @param {boolean} isLoadMore - Whether to load more lists or reset the list.
   * @returns {Promise<void>}
   */
  const loadPublicLists = async (isLoadMore = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const currentPage = isLoadMore ? page : 0;
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/lists/public?page=${currentPage}&size=12&sortBy=${sortBy}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (isLoadMore) {
          setLists((prev) => [...prev, ...data.content]);
        } else {
          setLists(data.content);
        }
        setHasMore(!data.last);
        setPage(currentPage + 1);
      } else {
        showError("Fehler beim Laden der öffentlichen Listen");
      }
    } catch (error) {
      console.error("Error loading public lists:", error);
      showError("Fehler beim Laden der öffentlichen Listen");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load my lists from the API.
   * @returns {Promise<void>}
   */
  const loadMyLists = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Check if token exists and has the correct format
      if (!isValidJWT(token)) {
        console.error("Invalid or missing JWT token");
        showError("Ungültiges Token. Bitte loggen Sie sich erneut ein.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/lists/my-lists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyLists(data);
      } else if (response.status === 401) {
        showError("Session abgelaufen. Bitte loggen Sie sich erneut ein.");
        // Optionally redirect to login or clear invalid token
      } else {
        showError("Fehler beim Laden deiner Listen");
      }
    } catch (error) {
      console.error("Error loading my lists:", error);
      showError("Fehler beim Laden deiner Listen");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and tab changes
  useEffect(() => {
    if (activeTab === "public") {
      setPage(0);
      setHasMore(true);
      loadPublicLists(false);
    } else if (activeTab === "my-lists" && isAuthenticated) {
      loadMyLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated]);

  // Sort changes for public lists only
  useEffect(() => {
    if (activeTab === "public") {
      setPage(0);
      setHasMore(true);
      loadPublicLists(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  /**
   * Search lists based on the search query.
   * @returns {Promise<void>}
   */
  const searchLists = async () => {
    if (!searchQuery.trim()) {
      loadPublicLists();
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/lists/search?query=${encodeURIComponent(
          searchQuery,
        )}&page=0&size=12`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      if (response.ok) {
        const data = await response.json();
        setLists(data.content);
        setHasMore(!data.last);
        setPage(1);
      }
    } catch (error) {
      console.error("Error searching lists:", error);
      showError("Fehler beim Suchen der Listen");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle list creation.
   * @param {*} listData
   * @returns {Promise<void>}
   */
  const handleCreateList = async (listData) => {
    try {
      const token = localStorage.getItem("token");

      // Check if token exists and has the correct format
      if (!isValidJWT(token)) {
        console.error("Invalid or missing JWT token");
        showError("Ungültiges Token. Bitte loggen Sie sich erneut ein.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listData),
      });

      if (response.ok) {
        const newList = await response.json();
        success("Liste erfolgreich erstellt!");
        setShowCreateModal(false);

        if (activeTab === "my-lists") {
          setMyLists((prev) => [newList, ...prev]);
        }
      } else if (response.status === 401) {
        showError("Session abgelaufen. Bitte loggen Sie sich erneut ein.");
      } else {
        showError("Fehler beim Erstellen der Liste");
      }
    } catch (error) {
      console.error("Error creating list:", error);
      showError("Fehler beim Erstellen der Liste");
    }
  };

  /**
   * handles deleting a list.
   * @param {*} listId
   * @returns {Promise<void>}
   */
  const handleDeleteList = async (listId) => {
    if (!window.confirm("Möchtest du diese Liste wirklich löschen?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        success("Liste erfolgreich gelöscht!");
        setMyLists((prev) => prev.filter((list) => list.id !== listId));
        setLists((prev) => prev.filter((list) => list.id !== listId));
      } else {
        showError("Fehler beim Löschen der Liste");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      showError("Fehler beim Löschen der Liste");
    }
  };

  /**
   * Handle liking a list.
   * @param {*} listId
   * @returns {Promise<void>}
   */
  const handleLikeList = async (listId) => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lists/${listId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedList = await response.json();
        setLists((prev) =>
          prev.map((list) => (list.id === listId ? updatedList : list)),
        );
      }
    } catch (error) {
      console.error("Error liking list:", error);
      showError("Fehler beim Liken der Liste");
    }
  };

  /**
   * Renders the list of lists.
   * @param {*} listsToRender
   * @returns {JSX.Element}
   */
  const renderLists = (listsToRender) => {
    if (loading && listsToRender.length === 0) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (listsToRender.length === 0) {
      return (
        <div className="text-center py-5">
          <div className="mb-4">
            <i
              className="bi bi-list-ul"
              style={{ fontSize: "4rem", opacity: 0.3 }}
            ></i>
          </div>
          <h4 className="text-muted mb-3">
            {activeTab === "my-lists"
              ? "Keine eigenen Listen vorhanden"
              : "Keine Listen gefunden"}
          </h4>
          {activeTab === "my-lists" && isAuthenticated && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Erste Liste erstellen
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="row">
        {listsToRender.map((list) => (
          <div className="col-md-6 col-lg-4 col-xl-3 mb-4" key={list.id}>
            <ListCard
              list={list}
              onLike={() => handleLikeList(list.id)}
              onDelete={
                activeTab === "my-lists"
                  ? () => handleDeleteList(list.id)
                  : null
              }
              showOwnerActions={activeTab === "my-lists"}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-white mb-4">
            <i className="bi bi-list-ul me-3"></i>
            Listen
          </h1>
        </div>
        {isAuthenticated && (
          <div className="col-auto">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Neue Liste erstellen
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs custom-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "public" ? "active" : ""}`}
            onClick={() => setActiveTab("public")}
          >
            <i className="bi bi-globe me-2"></i>
            Öffentliche Listen
          </button>
        </li>
        {isAuthenticated && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "my-lists" ? "active" : ""}`}
              onClick={() => setActiveTab("my-lists")}
            >
              <i className="bi bi-person-circle me-2"></i>
              Meine Listen ({myLists.length})
            </button>
          </li>
        )}
      </ul>

      {/* Search and Sort Controls */}
      {activeTab === "public" && (
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Listen durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchLists()}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={searchLists}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Neueste zuerst</option>
              <option value="popular">Beliebteste zuerst</option>
            </select>
          </div>
        </div>
      )}

      {renderLists(activeTab === "public" ? lists : myLists)}

      {/* Load More Button */}
      {activeTab === "public" && hasMore && lists.length > 0 && (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => loadPublicLists(true)}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Lädt...
              </>
            ) : (
              "Mehr laden"
            )}
          </button>
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateList}
        />
      )}
    </div>
  );
};

export default CustomListsPage;
