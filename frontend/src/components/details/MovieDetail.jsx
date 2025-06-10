import React, { useState } from "react";
import { useMediaDetail, renderStars } from "./utils/useMediaDetail";
import { useWatchlist } from "./utils/useWatchlist";
import { useReviews } from "./utils/useReviews";
import MediaHeader from "./MediaHeader";
import RatingSection from "./sections/RatingSection";
import CastSection from "./sections/CastSection";
import ReviewSection from "./sections/ReviewSection";
import EditReviewModal from "./sections/EditReviewModal";

const MovieDetail = () => {
  const { mediaId, media, isLoading, error, userId, currentUser, actors, director, castLoading } =
    useMediaDetail('movies');

  const { added, adding, handleAddToWatchlist } = useWatchlist(userId, mediaId, 'movies');

  // This hook manages reviews, ratings, and user interactions
  const {
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
    handleDeleteReview
  } = useReviews(userId, mediaId, 'movies');

  const [showEditModal, setShowEditModal] = useState(false);

  // Handle edit review with modal close
  const handleEditReviewWithClose = async (rating, comment) => {
    await handleEditReview(rating, comment);
    setShowEditModal(false);
  };

  // Handle edit action
  const handleEdit = () => {
    setShowEditModal(true);
  };

  // Handle delete action 
  const handleDelete = async () => {
    await handleDeleteReview();
  };

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Film wird geladen...</p>
      </div>
    );
  }

  if (!media) return null;

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <MediaHeader
          media={media}
          averageRating={averageRating}
          reviewCount={reviews.length}
          userId={userId}
          added={added}
          adding={adding}
          onAddToWatchlist={handleAddToWatchlist}
          renderStars={renderStars}
        />
      </div>

      <div className="mt-4">
        <RatingSection
          userId={userId}
          reviewed={reviewed}
          rating={rating}
          comment={comment}
          submitting={submitting}
          submitSuccess={submitSuccess}
          onRatingChange={setRating}
          onCommentChange={setComment}
          onSubmitReview={handleSubmitReview}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderStars={renderStars}
        />
      </div>

      <CastSection
        actors={actors}
        director={director}
        castLoading={castLoading}
      />

      <ReviewSection
        reviews={reviews}
        reviewUsers={reviewUsers}
        currentUser={currentUser}
        renderStars={renderStars}
      />

      <EditReviewModal
        showEditModal={showEditModal}  
        rating={rating}
        comment={comment}
        submitting={submitting}
        onClose={() => setShowEditModal(false)}
        onEditReview={handleEditReviewWithClose}
        onDeleteReview={handleDeleteReview}  
        renderStars={renderStars}
      />
    </div>
  );
};

export default MovieDetail;