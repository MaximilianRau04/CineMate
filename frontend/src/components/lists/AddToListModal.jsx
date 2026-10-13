import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/I18nContext";

const AddToListModal = ({ mediaId, mediaType, onClose }) => {
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});

  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isAuthenticated) return;

    loadUserLists();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load user lists from the API.
   */
  const loadUserLists = async () => {
    try {
      const { data } = await api.get("/lists/my-lists");
      setUserLists(data);
    } catch (error) {
      console.error("Error loading user lists:", error);
      showError(t("lists.loadMineError"));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle adding media to a user list.
   * @param {*} listId
   */
  const handleAddToList = async (listId) => {
    setAdding((prev) => ({ ...prev, [listId]: true }));

    try {
      await api.post(`/lists/${listId}/${mediaType}/${mediaId}`);
      success(t("lists.addedToList"));
      // Update the list to show it now contains this item
      setUserLists((prev) =>
        prev.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              totalItemsCount: list.totalItemsCount + 1,
              [mediaType]: [...(list[mediaType] || []), { id: mediaId }],
            };
          }
          return list;
        }),
      );
    } catch (error) {
      if (error.response?.status === 409) {
        showError(t("lists.alreadyInList"));
      } else {
        console.error("Error adding to list:", error);
        showError(t("lists.addToListError"));
      }
    } finally {
      setAdding((prev) => ({ ...prev, [listId]: false }));
    }
  };

  /**
   * Check if the media is already in the user's list.
   * @param {*} list
   * @returns {boolean}
   */
  const isInList = (list) => {
    if (!list[mediaType]) return false;
    return list[mediaType].some((item) => item.id === mediaId);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle me-2"></i>
              {t("details.addToList")}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{t("common.loading")}</span>
                </div>
              </div>
            ) : userLists.length > 0 ? (
              <div className="list-group">
                {userLists.map((list) => (
                  <div
                    key={list.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="d-flex align-items-center">
                        <i
                          className={`bi bi-${
                            list.public ? "globe" : "lock"
                          } me-2`}
                        ></i>
                        <div>
                          <h6 className="mb-0">{list.title}</h6>
                          <small className="text-muted">
                            {t("lists.itemCount", {
                              count: list.totalItemsCount || 0,
                            })}
                          </small>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isInList(list) ? (
                        <span className="badge bg-success text-dark">
                          <i className="bi bi-check-circle me-1"></i>
                          {t("lists.alreadyAdded")}
                        </span>
                      ) : (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleAddToList(list.id)}
                          disabled={adding[list.id]}
                        >
                          {adding[list.id] ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                              ></span>
                              {t("details.adding")}
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus me-1"></i>
                              {t("common.add")}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i
                  className="bi bi-list-ul"
                  style={{ fontSize: "3rem", opacity: 0.3 }}
                ></i>
                <h5 className="mt-3">{t("lists.noOwnLists")}</h5>
                <p className="text-muted">{t("lists.noOwnListsHint")}</p>
                <Link to="/lists" className="btn btn-primary" onClick={onClose}>
                  <i className="bi bi-plus-circle me-2"></i>
                  {t("lists.createFirst")}
                </Link>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToListModal;
