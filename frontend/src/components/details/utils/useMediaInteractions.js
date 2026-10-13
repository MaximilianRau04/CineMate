import { useEffect, useState } from "react";
import { useToast } from "../../toasts";
import api from "../../../utils/api";
import { useTranslation } from "../../../i18n/I18nContext";

export const useMediaInteractions = (userId, mediaId, mediaType = "movies") => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [markingAsWatched, setMarkingAsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  const { success, error: showError } = useToast();
  const { t } = useTranslation();
  const kind = mediaType === "movies" ? "movie" : "series";

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
      .catch((err) => console.error("Failed to check watchlist:", err));

    // watched
    api
      .get(`/users/${userId}/watched/${mediaType}`)
      .then((res) => {
        setIsWatched(
          res.data.some((m) => m.id.toString() === mediaId.toString()),
        );
      })
      .catch((err) => console.error("Failed to check watched items:", err));

    // favorites
    api
      .get(`/users/${userId}/favorites/${mediaType}`)
      .then((res) => {
        setIsFavorite(
          res.data.some((m) => m.id.toString() === mediaId.toString()),
        );
      })
      .catch((err) => console.error("Failed to check favorites:", err));
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
        success(t(`details.${kind}AddedToWatchlist`));
      })
      .catch((err) => {
        console.error("Failed to add to watchlist:", err);
        showError(t("details.watchlistError"));
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
        success(t(`details.${kind}MarkedWatched`));
      })
      .catch((err) => {
        console.error("Failed to mark as watched:", err);
        showError(t("details.watchedError"));
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
        success(t(`details.${kind}AddedToFavorites`));
      })
      .catch((err) => {
        console.error("Failed to add to favorites:", err);
        showError(t("details.favoritesError"));
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
