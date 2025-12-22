import { useEffect, useState } from "react";

export const useReviews = (userId, mediaId, mediaType) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewUsers, setReviewUsers] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const typeMap = { movies: "movie", series: "series" };
  const mediaPath = typeMap[mediaType];

  /**
   * Calculates the average rating from an array of reviews.
   * @param {*} reviews
   * @return {number}
   */
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  /**
   * fetches user data for a specific review.
   * @param {*} reviewId
   * @return {Promise<Object|null>}
   */
  const fetchReviewUser = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewId}/user`,
        { headers },
      );

      if (!response.ok) {
        console.error(`API Fehler für Review ${reviewId}: ${response.status}`);
        return null;
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(
        `Fehler beim Laden des Benutzers für Review ${reviewId}:`,
        error,
      );
      return null;
    }
  };

  /**
   * loads reviews for the specified media type and ID.
   * @returns {Promise<void>}
   */
  const loadReviews = async () => {
    if (!mediaId || !mediaPath) return;

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `http://localhost:8080/api/reviews/${mediaPath}/${mediaId}`,
        { headers },
      );
      if (!response.ok) {
        if (response.status === 404) {
          setReviews([]);
          setAverageRating(0);
          setReviewUsers({});
          return;
        }
        throw new Error(
          `Bewertungen konnten nicht geladen werden (${response.status})`,
        );
      }

      const data = await response.json();
      setReviews(data);
      const newAverageRating = calculateAverageRating(data);
      setAverageRating(newAverageRating);

      const newReviewUsers = {};
      for (const review of data) {
        const userData = await fetchReviewUser(review.id);
        if (userData) {
          newReviewUsers[review.id] = userData;
        }
      }
      setReviewUsers(newReviewUsers);
    } catch (error) {
      console.error("Fehler beim Laden der Bewertungen:", error);
      setReviews([]);
      setAverageRating(0);
      setReviewUsers({});
    }
  };

  /**
   * Checks if the user has already reviewed the media.
   * @param {string} userId
   * @param {string} mediaId
   * @param {string} mediaPath
   * @returns {Promise<void>}
   */
  useEffect(() => {
    if (!userId || !mediaId) return;
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(
      `http://localhost:8080/api/reviews/${mediaPath}/${mediaId}/user/${userId}`,
      { headers },
    )
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error(`Fehler beim Laden der Bewertung (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setReviewed(true);
          setRating(data.rating);
          setComment(data.comment || "");
          setReviewId(data.id);
        }
      })
      .catch((err) => console.error("Fehler beim Prüfen der Bewertung:", err));
  }, [userId, mediaId, mediaPath]);

  // Load reviews when mediaId or mediaPath changes
  useEffect(() => {
    if (!mediaId) return;
    loadReviews();
  }, [mediaId, mediaPath]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * adds a review for the media.
   * @param {number} rating
   * @param {string} comment
   * @returns {Promise<void>}
   */
  const handleSubmitReview = async () => {
    if (!userId || rating === 0) return;

    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : { "Content-Type": "application/json" };

      const response = await fetch(
        `http://localhost:8080/api/reviews/${mediaPath}/${mediaId}/user/${userId}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            userId,
            itemId: mediaId,
            rating,
            comment,
            type: mediaPath,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Fehler beim Speichern der Bewertung: ${errorData}`);
      }

      const data = await response.json();
      setReviewed(true);
      setSubmitSuccess(true);

      if (data && data.id) {
        setReviewId(data.id);
      }

      await loadReviews();
    } catch (error) {
      console.error("Fehler beim Speichern der Bewertung:", error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * updates a review for the media.
   * @param {number} editRating
   * @param {string} editComment
   * @returns {Promise<void>}
   */
  const handleEditReview = async (editRating, editComment) => {
    if (!userId || !reviewId || editRating === 0) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : { "Content-Type": "application/json" };

      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            userId,
            itemId: mediaId,
            rating: editRating,
            comment: editComment,
            type: mediaPath,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Fehler beim Bearbeiten der Bewertung: ${errorData}`);
      }

      setRating(editRating);
      setComment(editComment);
      await loadReviews();
    } catch (error) {
      console.error("Fehler beim Bearbeiten der Bewertung:", error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * deletes a review for the media.
   * @returns {Promise<void>}
   */
  const handleDeleteReview = async () => {
    const confirmDelete = window.confirm(
      "Möchtest du deine Bewertung wirklich löschen?",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(
          `Fehler beim Löschen der Bewertung (${response.status})`,
        );
      }

      setReviewed(false);
      setRating(0);
      setComment("");
      setReviewId(null);
      setSubmitSuccess(false);

      await new Promise((resolve) => setTimeout(resolve, 100));

      await loadReviews();
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  return {
    reviews,
    averageRating,
    reviewUsers,
    rating,
    setRating,
    comment,
    setComment,
    reviewed,
    submitting,
    submitSuccess,
    handleSubmitReview,
    handleEditReview,
    handleDeleteReview,
    loadReviews,
  };
};
