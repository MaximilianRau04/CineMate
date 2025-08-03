import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../toasts";

const AddToListModal = ({ mediaId, mediaType, onClose }) => {
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});

  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();

  const API_BASE_URL = "http://localhost:8080/api";

  useEffect(() => {
    if (!isAuthenticated) return;

    loadUserLists();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load user lists from the API.
   */
  const loadUserLists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/lists/my-lists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const lists = await response.json();
        setUserLists(lists);
      }
    } catch (error) {
      console.error("Error loading user lists:", error);
      showError("Fehler beim Laden der Listen");
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/lists/${listId}/${mediaType}/${mediaId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        success("Zu Liste hinzugefügt!");
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
          })
        );
      } else if (response.status === 409) {
        showError("Element ist bereits in dieser Liste vorhanden");
      } else {
        showError("Fehler beim Hinzufügen zur Liste");
      }
    } catch (error) {
      console.error("Error adding to list:", error);
      showError("Fehler beim Hinzufügen zur Liste");
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
              Zu Liste hinzufügen
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
                  <span className="visually-hidden">Loading...</span>
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
                            {list.totalItemsCount}{" "}
                            {list.totalItemsCount === 1
                              ? "Element"
                              : "Elemente"}
                          </small>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isInList(list) ? (
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Bereits vorhanden
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
                              Hinzufügen...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus me-1"></i>
                              Hinzufügen
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
                <h5 className="mt-3">Keine Listen vorhanden</h5>
                <p className="text-muted">
                  Du hast noch keine Listen erstellt.
                </p>
                <a href="/lists" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Erste Liste erstellen
                </a>
              </div>
            )}
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

export default AddToListModal;
