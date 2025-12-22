import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export const useMediaDetail = (mediaType = "movies") => {
  const { id: mediaId } = useParams();
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [actors, setActors] = useState([]);
  const [director, setDirector] = useState(null);
  const [castLoading, setCastLoading] = useState(true);

  const getHeaders = (extra = {}) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}`, ...extra } : extra;
  };

  /**
   * Fetches the current user from localStorage and sets userId and currentUser state.
   * @returns {void}
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/users/me", {
      headers: getHeaders(),
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(`HTTP Error: ${res.status}`),
      )
      .then((data) => {
        if (data?.id) {
          setUserId(data.id);
          setCurrentUser(data);
        }
      })
      .catch((err) => console.error("Fehler beim Laden des Users:", err));
  }, []);

  /**
   * Fetches media details based on mediaId and mediaType.
   * @returns {void}
   */
  useEffect(() => {
    if (!mediaId) return;

    setIsLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/${mediaType}/${mediaId}`, {
      headers: getHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? `${mediaType === "movies" ? "Film" : "Serie"} wurde nicht gefunden`
              : `${mediaType === "movies" ? "Film" : "Serie"} konnte nicht geladen werden (${res.status})`,
          );
        }
        return res.json();
      })
      .then((data) => {
        setMedia(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(`Fehler beim Laden des ${mediaType}:`, err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [mediaId, mediaType]);

  /**
   * Fetches actors and director for the media based on mediaId and mediaType.
   * @returns {void}
   */
  useEffect(() => {
    if (!mediaId) return;

    setCastLoading(true);

    // read token inside effect to avoid missing dependency warnings

    const fetchActors = fetch(
      `http://localhost:8080/api/${mediaType}/${mediaId}/actors`,
      {
        headers: getHeaders(),
      },
    )
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    const fetchDirector = fetch(
      `http://localhost:8080/api/${mediaType}/${mediaId}/director`,
      {
        headers: getHeaders(),
      },
    )
      .then((res) => (res.ok ? res.json() : null))
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
      stars.push(<FaStar key={i} color="#ffc107" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
    } else {
      stars.push(<FaRegStar key={i} color="#e4e5e9" />);
    }
  }

  return stars;
};

/**
 * formats a timestamp to a date string in the format dd.mm.yyyy
 * @param {*} timestamp
 * @returns date formatted as dd.mm.yyyy or ""
 */
export const formatBirthday = (timestamp) => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "";
  }
};
