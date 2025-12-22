import { useEffect, useState } from "react";
import { useToast } from "../../toasts";

export const useMediaInteractions = (userId, mediaId, mediaType = "movies") => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [markingAsWatched, setMarkingAsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  const { success, error: showError } = useToast();

  const API_URL = "http://localhost:8080/api";

  /**
   * Checks if the user has the media in their watchlist, watched list, or favorites.
   */
  useEffect(() => {
    if (!userId || !mediaId) return;
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // watchlist
    fetch(`${API_URL}/users/${userId}/watchlist/${mediaType}`, { headers })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setIsInWatchlist(
          data.some((m) => m.id.toString() === mediaId.toString()),
        );
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));

    // watched
    fetch(`${API_URL}/users/${userId}/watched/${mediaType}`, { headers })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setIsWatched(data.some((m) => m.id.toString() === mediaId.toString()));
      })
      .catch((err) =>
        console.error("Fehler beim Check der gesehenen Inhalte:", err),
      );

    // favorites
    fetch(`${API_URL}/users/${userId}/favorites/${mediaType}`, { headers })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setIsFavorite(data.some((m) => m.id.toString() === mediaId.toString()));
      })
      .catch((err) => console.error("Fehler beim Check der Favoriten:", err));
  }, [userId, mediaId, mediaType]);

  /**
   * adds the media to the user's watchlist.
   * @returns {void}
   */
  const addToWatchlist = () => {
    if (!userId || isInWatchlist) return;

    setAddingToWatchlist(true);
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`${API_URL}/users/${userId}/watchlist/${mediaType}/${mediaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP-Error: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setIsInWatchlist(true);
        success(
          `${mediaType === "movies" ? "Film" : "Serie"} zur Watchlist hinzugefügt!`,
        );
      })
      .catch((err) => {
        console.error("Fehler beim Hinzufügen zur Watchlist:", err);
        showError("Fehler beim Hinzufügen zur Watchlist");
      })
      .finally(() => {
        setAddingToWatchlist(false);
      });
  };

  /**
   * marks the media as watched.
   * @returns {void}
   */
  const markAsWatched = () => {
    if (!userId || isWatched) return;

    setMarkingAsWatched(true);
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`${API_URL}/users/${userId}/watched/${mediaType}/${mediaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP-Error: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setIsWatched(true);
        success(
          `${mediaType === "movies" ? "Film" : "Serie"} als gesehen markiert!`,
        );
      })
      .catch((err) => {
        console.error("Fehler beim Markieren als gesehen:", err);
        showError("Fehler beim Markieren als gesehen");
      })
      .finally(() => {
        setMarkingAsWatched(false);
      });
  };

  /**
   * adds the media to the user's favorites.
   * @returns {void}
   */
  const addToFavorites = () => {
    if (!userId || isFavorite) return;

    setAddingToFavorites(true);
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`${API_URL}/users/${userId}/favorites/${mediaType}/${mediaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP-Error: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setIsFavorite(true);
        success(
          `${mediaType === "movies" ? "Film" : "Serie"} zu Favoriten hinzugefügt!`,
        );
      })
      .catch((err) => {
        console.error("Fehler beim Hinzufügen zu Favoriten:", err);
        showError("Fehler beim Hinzufügen zu Favoriten");
      })
      .finally(() => {
        setAddingToFavorites(false);
      });
  };

  return {
    isInWatchlist,
    addingToWatchlist,
    addToWatchlist,

    isWatched,
    markingAsWatched,
    markAsWatched,

    isFavorite,
    addingToFavorites,
    addToFavorites,
  };
};
