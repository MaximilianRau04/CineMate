import { useEffect, useState } from "react";

export const useMediaInteractions = (userId, mediaId, mediaType = 'movies') => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [markingAsWatched, setMarkingAsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);

  const API_URL = "http://localhost:8080/api";

  /**
   * Checks if the user has the media in their watchlist, watched list, or favorites.
   */
  useEffect(() => {
    if (!userId || !mediaId) return;

    // watchlist
    fetch(`${API_URL}/users/${userId}/watchlist/${mediaType}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setIsInWatchlist(data.some(m => m.id.toString() === mediaId.toString()));
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));
    
    // watched
    fetch(`${API_URL}/users/${userId}/watched/${mediaType}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setIsWatched(data.some(m => m.id.toString() === mediaId.toString()));
      })
      .catch((err) => console.error("Fehler beim Check der gesehenen Inhalte:", err));
      
    // favorites
    fetch(`${API_URL}/users/${userId}/favorites/${mediaType}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setIsFavorite(data.some(m => m.id.toString() === mediaId.toString()));
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
    fetch(`${API_URL}/users/${userId}/watchlist/${mediaType}/${mediaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP-Error: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setIsInWatchlist(true);
      })
      .catch((err) => {
        console.error("Fehler beim Hinzufügen zur Watchlist:", err);
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
    fetch(`${API_URL}/users/${userId}/watched/${mediaType}/${mediaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP-Error: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setIsWatched(true);
      })
      .catch((err) => {
        console.error("Fehler beim Markieren als gesehen:", err);
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
    fetch(`${API_URL}/users/${userId}/favorites/${mediaType}/${mediaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP-Error: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setIsFavorite(true);
      })
      .catch((err) => {
        console.error("Fehler beim Hinzufügen zu Favoriten:", err);
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
    addToFavorites
  };
};