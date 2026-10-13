import React, { useState } from "react";
import { useMediaDetail, renderStars } from "./utils/useMediaDetail";
import { useMediaInteractions } from "./utils/useMediaInteractions";
import { useReviews } from "./utils/useReviews";
import MediaHeader from "./MediaHeader";
import RatingSection from "./sections/RatingSection";
import CastSection from "./sections/CastSection";
import ReviewSection from "./sections/ReviewSection";
import EditReviewModal from "./sections/EditReviewModal";
import SeasonSection from "./sections/SeasonSection";
import StreamingAvailability from "../streaming/StreamingAvailability";
import AddToListModal from "../lists/AddToListModal";
import { LoadingSpinner } from "../explore/FilterPanel";
import { useTranslation } from "../../i18n/I18nContext";
import { Link } from "react-router-dom";
import "./Detail.css";

const SeriesDetail = () => {
  const { t } = useTranslation();
  const {
    mediaId,
    media,
    isLoading,
    error,
    userId,
    currentUser,
    actors,
    director,
    castLoading,
  } = useMediaDetail("series");

  // This hook manages user interactions like watchlist, watched, and favorites
  const {
    isInWatchlist,
    addingToWatchlist,
    addToWatchlist,
    isWatched,
    markingAsWatched,
    markAsWatched,
    isFavorite,
    addingToFavorites,
    addToFavorites,
  } = useMediaInteractions(userId, mediaId, "series");

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
    handleDeleteReview,
  } = useReviews(userId, mediaId, "series");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);

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
    return <LoadingSpinner message={t("details.seriesLoading")} />;
  }

  if (error && !media) {
    return (
      <div className="container cm-page">
        <div className="cm-empty">
          <h3>{error}</h3>
          <Link to="/explore" className="btn btn-outline-primary mt-2">
            {t("details.backToExplore")}
          </Link>
        </div>
      </div>
    );
  }

  if (!media) return null;

  return (
    <div className="cm-detail">
      <MediaHeader
        type="series"
        media={media}
        averageRating={averageRating}
        reviewCount={reviews.length}
        userId={userId}
        error={error}
        added={isInWatchlist}
        adding={addingToWatchlist}
        onAddToWatchlist={addToWatchlist}
        watched={isWatched}
        watching={markingAsWatched}
        onMarkAsWatched={markAsWatched}
        favorite={isFavorite}
        favoriting={addingToFavorites}
        onAddToFavorites={addToFavorites}
        onShowAddToListModal={() => setShowAddToListModal(true)}
        renderStars={renderStars}
      />

      <div className="container-xxl cm-detail-body">
        <div className="mt-4">
          <StreamingAvailability
            mediaId={mediaId}
            mediaType="series"
            userRegion="DE"
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

        <SeasonSection seriesId={mediaId} />

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
      </div>

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

      {showAddToListModal && (
        <AddToListModal
          mediaId={mediaId}
          mediaType="series"
          onClose={() => setShowAddToListModal(false)}
        />
      )}
    </div>
  );
};

export default SeriesDetail;
