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

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const fetchReviewUser = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}/user`);
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error(`Fehler beim Laden des Benutzers für Review ${reviewId}:`, error);
      return null;
    }
  };

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

      const userPromises = data.map(async (review) => {
        if (!reviewUsers[review.id]) {
          const userData = await fetchReviewUser(review.id);
          return { reviewId: review.id, userData };
        }
        return null;
      });

      const userResults = await Promise.all(userPromises);
      const newReviewUsers = { ...reviewUsers };

      userResults.forEach((result) => {
        if (result && result.userData) {
          newReviewUsers[result.reviewId] = result.userData;
        }
      });

      setReviewUsers(newReviewUsers);
      const newAverageRating = calculateAverageRating(data);
      setAverageRating(newAverageRating);
    } catch (error) {
      console.error("Fehler beim Laden der Bewertungen:", error);
      setReviews([]);
    }
  };

  // Check if user has already reviewed
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

  // Load reviews
  useEffect(() => {
    if (!mediaId) return;
    loadReviews();
  }, [mediaId]);

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
      alert(`Fehler: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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
      alert(`Fehler: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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
      alert(`Fehler: ${error.message}`);
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