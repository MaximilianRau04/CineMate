import { useEffect, useState } from "react";

export const useWatchlist = (userId, mediaId, mediaType = 'movies') => {
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  /**
   * Checks if the media is already in the user's watchlist.
   * @param {string} userId 
   */
  useEffect(() => {
    if (!userId || !mediaId) return;

    fetch(`http://localhost:8080/api/users/${userId}/watchlist/${mediaType}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        const alreadyInWatchlist = data.some(
          (m) => m.id.toString() === mediaId.toString()
        );
        setAdded(alreadyInWatchlist);
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));
  }, [userId, mediaId, mediaType]);

  /**
   * adds the media to the user's watchlist.
   * @param {string} userId
   * @param {string} mediaId
   * @param {string} mediaType
   * @returns {void}
   */
  const handleAddToWatchlist = () => {
    if (!userId || added) return;

    setAdding(true);
    fetch(`http://localhost:8080/api/users/${userId}/watchlist/${mediaType}/${mediaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP-Error: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setAdded(true);
        setAdding(false);
      })
      .catch((err) => {
        console.error("Fehler beim Hinzufügen zur Watchlist:", err);
        setAdding(false);
      });
  };

  return { added, adding, handleAddToWatchlist };
};