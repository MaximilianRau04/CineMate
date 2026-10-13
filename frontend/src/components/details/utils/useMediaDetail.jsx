import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import api from "../../../utils/api";
import { useAuth } from "../../../utils/AuthContext";
import { useTranslation } from "../../../i18n/I18nContext";

export const useMediaDetail = (mediaType = "movies") => {
  const { id: mediaId } = useParams();
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const userId = currentUser?.id ?? null;
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actors, setActors] = useState([]);
  const [director, setDirector] = useState(null);
  const [castLoading, setCastLoading] = useState(true);

  /**
   * Fetches media details based on mediaId and mediaType.
   * @returns {void}
   */
  useEffect(() => {
    if (!mediaId) return;

    setIsLoading(true);
    setError(null);

    api
      .get(`/${mediaType}/${mediaId}`)
      .then((res) => {
        setMedia(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(`Failed to load ${mediaType}:`, err);
        const status = err.response?.status;
        const kind = mediaType === "movies" ? "movie" : "series";
        const message =
          status === 404
            ? t(`details.${kind}NotFound`)
            : t(`details.${kind}LoadError`, { status: status ?? "-" });
        setError(message);
        setIsLoading(false);
      });
  }, [mediaId, mediaType]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Fetches actors and director for the media based on mediaId and mediaType.
   * @returns {void}
   */
  useEffect(() => {
    if (!mediaId) return;

    setCastLoading(true);

    const fetchActors = api
      .get(`/${mediaType}/${mediaId}/actors`)
      .then((res) => res.data)
      .catch(() => []);

    const fetchDirector = api
      .get(`/${mediaType}/${mediaId}/director`)
      .then((res) => res.data)
      .catch(() => null);

    Promise.all([fetchActors, fetchDirector]).then(
      ([actorsData, directorData]) => {
        setActors(actorsData || []);
        setDirector(directorData);
        setCastLoading(false);
      },
    );
  }, [mediaId, mediaType]);

  return {
    mediaId,
    media,
    setMedia,
    isLoading,
    error,
    userId,
    currentUser,
    actors,
    director,
    castLoading,
  };
};

/**
 * renders stars based on the rating value
 * @param {*} rating
 * @returns stars
 */
export const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} color="var(--cm-brass)" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} color="var(--cm-brass)" />);
    } else {
      stars.push(<FaRegStar key={i} color="rgba(243, 233, 218, 0.3)" />);
    }
  }

  return stars;
};

/**
 * formats a timestamp to a date string in the format dd.mm.yyyy
 * @param {*} timestamp
 * @param {string} locale
 * @returns localized date or ""
 */
export const formatBirthday = (timestamp, locale = "en-US") => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "";
  }
};
