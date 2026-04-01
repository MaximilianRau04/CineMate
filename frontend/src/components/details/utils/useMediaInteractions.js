import { useEffect, useState } from "react";
import { useToast } from "../../toasts";
import api from "../../../utils/api";

export const useMediaInteractions = (userId, mediaId, mediaType = "movies") => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [markingAsWatched, setMarkingAsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  const { success, error: showError } = useToast();

  /**
   * Checks if the user has the media in their watchlist, watched list, or favorites.
   */
  useEffect(() => {
    if (!userId || !mediaId) return;

    // watchlist
    api
      .get(`/users/${userId}/watchlist/${mediaType}`)
      .then((res) => {
        setIsInWatchlist(
          res.data.some((m) => m.id.toString() === mediaId.toString()),
        );
      })
      .catch((err) => console.error("Fehler beim Check der Watchlist:", err));

    // watched
    api
      .get(`/users/${userId}/watched/${mediaType}`)
      .then((res) => {
        setIsWatched(
          res.data.some((m) => m.id.toString() === mediaId.toString()),
        );
      })
      .catch((err) =>
        console.error("Fehler beim Check der gesehenen Inhalte:", err),
      );

    // favorites
    api
      .get(`/users/${userId}/favorites/${mediaType}`)
      .then((res) => {
        setIsFavorite(
          res.data.some((m) => m.id.toString() === mediaId.toString()),
        );
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

    api
      .put(`/users/${userId}/watchlist/${mediaType}/${mediaId}`)
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

    api
      .put(`/users/${userId}/watched/${mediaType}/${mediaId}`)
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

    api
      .put(`/users/${userId}/favorites/${mediaType}/${mediaId}`)
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
