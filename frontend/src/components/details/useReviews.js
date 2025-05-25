import { useEffect, useState } from "react";

export const useReviews = (userId, mediaId, mediaType = 'movies') => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewUsers, setReviewUsers] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /**
   * Calculates the average rating from an array of reviews.
   * @param {*} reviews 
   */
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  /**
   * fetches user data for a specific review.
   * @param {*} reviewId 
   */
  const fetchReviewUser = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}/user`);
      
      if (!response.ok) {
        console.error(`API Fehler für Review ${reviewId}: ${response.status}`);
        return null;
      }
      
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(`Fehler beim Laden des Benutzers für Review ${reviewId}:`, error);
      return null;
    }
  };

  /**
   * loads reviews for the specified media type and ID.
   */
  const loadReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${mediaType.slice(0, -1)}/${mediaId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setReviews([]);
          setAverageRating(0);
          return;
        }
        throw new Error(`Bewertungen konnten nicht geladen werden (${response.status})`);
      }
      
      const data = await response.json();
      setReviews(data);

      const newReviewUsers = { ...reviewUsers };
      
      for (const review of data) {
        if (!newReviewUsers[review.id]) {
          const userData = await fetchReviewUser(review.id);
          if (userData) {
            newReviewUsers[review.id] = userData;
          }
        }
      }

      setReviewUsers(newReviewUsers);
      
      const newAverageRating = calculateAverageRating(data);
      setAverageRating(newAverageRating);
    } catch (error) {
      console.error("Fehler beim Laden der Bewertungen:", error);
      setReviews([]);
    }
  };

  /**
   * Checks if the user has already reviewed the media.
   */
  useEffect(() => {
    if (!userId || !mediaId) return;

    fetch(`http://localhost:8080/api/reviews/${mediaType.slice(0, -1)}/${mediaId}/user/${userId}`)
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
  }, [userId, mediaId, mediaType]);

  // Load reviews when mediaId or mediaType changes
  useEffect(() => {
    if (!mediaId) return;
    loadReviews();
  }, [mediaId, mediaType]); 

  /**
   * adds a review for the media.
   */
  const handleSubmitReview = async () => {
    if (!userId || rating === 0) return;

    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${mediaType.slice(0, -1)}/${mediaId}/user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          itemId: mediaId,
          rating,
          comment,
          type: mediaType.slice(0, -1),
        }),
      });

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
   */
  const handleEditReview = async (editRating, editComment) => {
    if (!userId || !reviewId || editRating === 0) return;

    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          itemId: mediaId,
          rating: editRating,
          comment: editComment,
          type: mediaType.slice(0, -1),
        }),
      });

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
   */
  const handleDeleteReview = async () => {
    const confirmDelete = window.confirm("Möchtest du deine Bewertung wirklich löschen?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Löschen der Bewertung (${response.status})`);
      }

      setReviewed(false);
      setRating(0);
      setComment("");
      setReviewId(null);
      setSubmitSuccess(false);
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
    loadReviews
  };
};