import { useState, useEffect } from "react";
import ListCard from "./ListCard";
import CreateListModal from "./CreateListModal";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";
import "./CustomListsPage.css";
import api from "../../utils/api";
import { useTranslation } from "../../i18n/I18nContext";

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
  const { t } = useTranslation();

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
      const { data } = await api.get(
        `/lists/public?page=${currentPage}&size=12&sortBy=${sortBy}`,
      );
      if (isLoadMore) {
        setLists((prev) => [...prev, ...data.content]);
      } else {
        setLists(data.content);
      }
      setHasMore(!data.last);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Error loading public lists:", error);
      showError(t("lists.loadPublicError"));
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
      const { data } = await api.get("/lists/my-lists");
      setMyLists(data);
    } catch (error) {
      if (error.response?.status === 401) {
        showError(t("lists.sessionExpired"));
      } else {
        console.error("Error loading my lists:", error);
        showError(t("lists.loadMineError"));
      }
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
      const { data } = await api.get(
        `/lists/search?query=${encodeURIComponent(searchQuery)}&page=0&size=12`,
      );
      setLists(data.content);
      setHasMore(!data.last);
      setPage(1);
    } catch (error) {
      console.error("Error searching lists:", error);
      showError(t("lists.searchError"));
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
      const { data: newList } = await api.post("/lists", listData);
      success(t("lists.created"));
      setShowCreateModal(false);

      if (activeTab === "my-lists") {
        setMyLists((prev) => [newList, ...prev]);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showError(t("lists.sessionExpired"));
      } else {
        console.error("Error creating list:", error);
        showError(t("lists.createError"));
      }
    }
  };

  /**
   * handles deleting a list.
   * @param {*} listId
   * @returns {Promise<void>}
   */
  const handleDeleteList = async (listId) => {
    if (!window.confirm(t("lists.confirmDelete"))) return;

    try {
      await api.delete(`/lists/${listId}`);
      success(t("lists.deleted"));
      setMyLists((prev) => prev.filter((list) => list.id !== listId));
      setLists((prev) => prev.filter((list) => list.id !== listId));
    } catch (error) {
      console.error("Error deleting list:", error);
      showError(t("lists.deleteError"));
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
      const { data: updatedList } = await api.post(`/lists/${listId}/like`);
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? updatedList : list)),
      );
    } catch (error) {
      console.error("Error liking list:", error);
      showError(t("lists.likeError"));
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
        <div className="cm-spinner">
          <div className="cm-reel" />
        </div>
      );
    }

    if (listsToRender.length === 0) {
      return (
        <div className="cm-empty">
          <h3>
            {activeTab === "my-lists"
              ? t("lists.noOwnLists")
              : t("lists.noListsFound")}
          </h3>
          <p>
            {activeTab === "my-lists"
              ? t("lists.noOwnListsHint")
              : t("lists.noListsFoundHint")}
          </p>
          {activeTab === "my-lists" && isAuthenticated && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {t("lists.createFirst")}
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
    <div className="container-xxl cm-page custom-lists-page">
      <header className="cm-page-head">
        <div>
          <div className="cm-eyebrow">{t("lists.eyebrow")}</div>
          <h1>{t("lists.title")}</h1>
        </div>
        {isAuthenticated && (
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>
            {t("lists.newList")}
          </button>
        )}
      </header>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs custom-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "public" ? "active" : ""}`}
            onClick={() => setActiveTab("public")}
          >
            <i className="bi bi-globe me-2"></i>
            {t("lists.publicLists")}
          </button>
        </li>
        {isAuthenticated && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "my-lists" ? "active" : ""}`}
              onClick={() => setActiveTab("my-lists")}
            >
              <i className="bi bi-person-circle me-2"></i>
              {t("lists.myLists")} ({myLists.length})
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
                placeholder={t("lists.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchLists()}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={searchLists}
                aria-label={t("common.search")}
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
              <option value="recent">{t("lists.sortRecent")}</option>
              <option value="popular">{t("lists.sortPopular")}</option>
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
                {t("common.loading")}
              </>
            ) : (
              t("lists.loadMore")
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
