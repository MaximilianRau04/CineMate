import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useMediaDetail } from "./useMediaDetail";
import { useWatchlist } from "./useWatchlist";
import { useReviews } from "./useReviews";
import MediaHeader from "./MediaHeader";
import RatingSection from "./RatingSection";
import ExistingRatingSection from "./ExistingRatingSection";
//import CastSection from "./CastSection";
//import ReviewsSection from "./ReviewsSection";
//import EditReviewModal from "./EditReviewModal";
import { renderStars } from "./startUtils";

const MovieDetail = () => {
  const { mediaId, media, isLoading, error, userId, currentUser, actors, director, castLoading } = 
    useMediaDetail('movies');
  
  const { added, adding, handleAddToWatchlist } = useWatchlist(userId, mediaId, 'movies');
  
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

  const handleOpenEditModal = () => setShowEditModal(true);

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Film wird geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <Link to="/explore" className="btn btn-outline-secondary mt-3">
            <FaArrowLeft className="me-2" />
            Zurück zur Übersicht
          </Link>
        </div>
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
          renderStars={renderStars}
        />

        <ExistingRatingSection
          reviewed={reviewed}
          rating={rating}
          comment={comment}
          renderStars={renderStars}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteReview}
        />

        <div className="mt-4">
          <Link to="/explore" className="btn btn-outline-primary">
            <FaArrowLeft className="me-2" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
      {/* Uncomment these sections when the components are implemented 
      <CastSection
        actors={actors}
        director={director}
        castLoading={castLoading}
      />

      <ReviewsSection
        reviews={reviews}
        reviewUsers={reviewUsers}
        currentUser={currentUser}
        renderStars={renderStars}
      />

      <EditReviewModal
        show={showEditModal}
        rating={rating}
        comment={comment}
        submitting={submitting}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditReview}
        renderStars={renderStars}
      />
      */}
    </div>
  );
};

export default MovieDetail;