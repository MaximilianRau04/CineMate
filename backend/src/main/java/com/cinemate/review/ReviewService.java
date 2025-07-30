package com.cinemate.review;

import com.cinemate.achievement.events.AchievementCheckEvent;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.review.DTOs.ReviewRequestDTO;
import com.cinemate.review.DTOs.ReviewResponseDTO;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import com.cinemate.user.dtos.UserResponseDTO;
import com.cinemate.notification.events.ReviewCreatedEvent;
import com.cinemate.recommendation.utils.RecommendationTriggerUtil;
import com.cinemate.social.points.PointsEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final RecommendationTriggerUtil recommendationTrigger;
    private final PointsEventListener pointsEventListener;

    private static final String TYPE_MOVIE = "movie";
    private static final String TYPE_SERIES = "series";
    private static final double MIN_RATING = 0.5;
    private static final double MAX_RATING = 5.0;
    private static final double RATING_STEP = 0.5;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
                         MovieRepository movieRepository, SeriesRepository seriesRepository,
                         ApplicationEventPublisher eventPublisher, RecommendationTriggerUtil recommendationTrigger,
                         PointsEventListener pointsEventListener) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
        this.eventPublisher = eventPublisher;
        this.recommendationTrigger = recommendationTrigger;
        this.pointsEventListener = pointsEventListener;
    }

    /**
     * Creates a review for the given userId and the movie or series based on the given type
     *
     * @param reviewRequestDTO Data transfer object containing review information
     * @return Response DTO with created review data
     */
    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO reviewRequestDTO) {
        String itemType = reviewRequestDTO.getType().toLowerCase();
        String itemId = reviewRequestDTO.getItemId();
        String userId = reviewRequestDTO.getUserId();

        validateUserExists(userId);

        validateContentExists(itemType, itemId);

        checkForExistingReview(userId, itemId);

        validateRating(reviewRequestDTO.getRating());

        Review review = new Review(reviewRequestDTO);

        Review savedReview = reviewRepository.save(review);
        calculateContentRating(itemType, itemId);

        String itemTitle = getItemTitle(itemType, itemId);
        eventPublisher.publishEvent(new ReviewCreatedEvent(this, savedReview, itemTitle, itemType));

        eventPublisher.publishEvent(new com.cinemate.notification.events.UserActivityEvent(this, savedReview.getUserId(),
                com.cinemate.notification.events.UserActivityEvent.ActivityType.REVIEW_CREATED, savedReview.getItemId()));

        recommendationTrigger.triggerOnNewRating(userId, itemId, itemType);

        // Award points for writing a review
        pointsEventListener.onReviewCreated(userId);

        // Check achievements after creating a review
        eventPublisher.publishEvent(new AchievementCheckEvent(this, userId, "review_created"));

        return new ReviewResponseDTO(savedReview);
    }

    /**
     * Returns the review for the given id
     *
     * @param id Review ID
     * @return ReviewResponseDTO if found
     */
    public Optional<ReviewResponseDTO> getReviewById(String id) {
        return reviewRepository.findById(id)
                .map(ReviewResponseDTO::new);
    }

    /**
     * Returns all reviews
     *
     * @return List of ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Returns all reviews for the given movie
     *
     * @param movieId Movie ID
     * @return List of ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsByMovie(String movieId) {
        validateMovieExists(movieId);

        return reviewRepository.findByItemId(movieId).stream()
                .filter(review -> movieRepository.findById(review.getItemId()).isPresent())
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Returns all reviews for the given series
     *
     * @param seriesId Series ID
     * @return List of ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsBySeries(String seriesId) {
        validateSeriesExists(seriesId);

        return reviewRepository.findByItemId(seriesId).stream()
                .filter(review -> seriesRepository.findById(review.getItemId()).isPresent())
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Returns all reviews for the given user
     *
     * @param userId User ID
     * @return List of ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsByUser(String userId) {
        validateUserExists(userId);

        return reviewRepository.findByUserId(userId).stream()
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * returns a review by the given user for the given movie
     *
     * @param movieId
     * @param userId
     * @return ReviewResponseDTO
     */
    public ReviewResponseDTO findByMovieIdAndUserId(String movieId, String userId) {
        validateMovieExists(movieId);
        validateUserExists(userId);

        Review review = reviewRepository.findByItemIdAndUserId(movieId, userId);
        return review != null ? new ReviewResponseDTO(review) : null;
    }

    /**
     * returns a review by the given user for the given series
     *
     * @param seriesId
     * @param userId
     * @return ReviewResponseDTO
     */
    public ReviewResponseDTO findBySeriesIdAndUserId(String seriesId, String userId) {
        validateSeriesExists(seriesId);
        validateUserExists(userId);

        Review review = reviewRepository.findByItemIdAndUserId(seriesId, userId);
        return review != null ? new ReviewResponseDTO(review) : null;
    }

    /**
     * Returns the user of a review by review id
     *
     * @param reviewId
     * @return UserResponseDTO or null if review not found
     */
    public UserResponseDTO getUserByReviewId(String reviewId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            String userId = review.getUserId();

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                return new UserResponseDTO(userOpt.get());
            }
        }
        return null;
    }

    /**
     * Returns the movie of a review by review id
     *
     * @param reviewId
     * @return MovieResponseDTO or null if review not found or not a movie review
     */
    public MovieResponseDTO getMovieByReviewId(String reviewId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            String itemId = review.getItemId();

            Optional<Movie> movieOpt = movieRepository.findById(itemId);
            if (movieOpt.isPresent()) {
                return new MovieResponseDTO(movieOpt.get());
            }
        }
        return null;
    }

    /**
     * Returns the series of a review by review id
     *
     * @param reviewId
     * @return SeriesResponseDTO or null if review not found or not a series review
     */
    public SeriesResponseDTO getSeriesByReviewId(String reviewId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            String itemId = review.getItemId();

            Optional<Series> seriesOpt = seriesRepository.findById(itemId);
            if (seriesOpt.isPresent()) {
                return new SeriesResponseDTO(seriesOpt.get());
            }
        }
        return null;
    }

    /**
     * Retrieves the media (movie or series) associated with a review
     *
     * @param reviewId the ID of the review
     * @return a map containing the media type and data, or null if not found
     */
    public Map<String, Object> getMediaByReviewId(String reviewId) {
        MovieResponseDTO movie = getMovieByReviewId(reviewId);
        if (movie != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "movie");
            response.put("data", movie);
            return response;
        }

        SeriesResponseDTO series = getSeriesByReviewId(reviewId);
        if (series != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("type", "series");
            response.put("data", series);
            return response;
        }

        return null;
    }

    /**
     * Updates the review for the given id
     *
     * @param id               Review ID
     * @param reviewRequestDTO Updated review data
     * @return Updated ReviewResponseDTO if found
     */
    @Transactional
    public Optional<ReviewResponseDTO> updateReview(String id, ReviewRequestDTO reviewRequestDTO) {
        return reviewRepository.findById(id)
                .map(existingReview -> {
                    if (!existingReview.getUserId().equals(reviewRequestDTO.getUserId())) {
                        throw new IllegalStateException("Only the creator can edit this review");
                    }

                    validateRating(reviewRequestDTO.getRating());

                    existingReview.setRating(reviewRequestDTO.getRating());
                    existingReview.setComment(reviewRequestDTO.getComment());

                    Review updatedReview = reviewRepository.save(existingReview);

                    String contentType = determineContentType(existingReview.getItemId());
                    if (contentType != null) {
                        calculateContentRating(contentType, existingReview.getItemId());
                    }

                    return new ReviewResponseDTO(updatedReview);
                });
    }

    /**
     * Deletes the review for the given id
     *
     * @param id Review ID
     * @return true if deleted, false if not found
     */
    @Transactional
    public boolean deleteReview(String id) {
        Optional<Review> reviewOpt = reviewRepository.findById(id);

        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            String itemId = review.getItemId();
            reviewRepository.deleteById(id);

            String contentType = determineContentType(itemId);
            if (contentType != null) {
                calculateContentRating(contentType, itemId);
            }

            return true;
        }
        return false;
    }

    /**
     * Validates that the rating is within allowed range and follows required step pattern
     *
     * @param rating Rating to validate
     */
    private void validateRating(double rating) {
        if (rating < MIN_RATING || rating > MAX_RATING || (rating * 10) % (RATING_STEP * 10) != 0) {
            throw new IllegalArgumentException(
                    "Rating must be between " + MIN_RATING + " and " + MAX_RATING +
                            " and in " + RATING_STEP + " increments");
        }
    }

    /**
     * Validates that a user exists
     *
     * @param userId User ID to validate
     */
    private void validateUserExists(String userId) {
        if (!userRepository.findById(userId).isPresent()) {
            throw new IllegalArgumentException("User with ID " + userId + " does not exist");
        }
    }

    /**
     * Validates that a movie exists
     *
     * @param movieId Movie ID to validate
     */
    private void validateMovieExists(String movieId) {
        if (!movieRepository.findById(movieId).isPresent()) {
            throw new IllegalArgumentException("Movie with ID " + movieId + " does not exist");
        }
    }

    /**
     * Validates that a series exists
     *
     * @param seriesId Series ID to validate
     */
    private void validateSeriesExists(String seriesId) {
        if (!seriesRepository.findById(seriesId).isPresent()) {
            throw new IllegalArgumentException("Series with ID " + seriesId + " does not exist");
        }
    }

    /**
     * Validates that content (movie or series) exists based on type
     *
     * @param contentType Type of content ("movie" or "series")
     * @param contentId   ID of the content
     */
    private void validateContentExists(String contentType, String contentId) {
        if (TYPE_MOVIE.equalsIgnoreCase(contentType)) {
            validateMovieExists(contentId);
        } else if (TYPE_SERIES.equalsIgnoreCase(contentType)) {
            validateSeriesExists(contentId);
        } else {
            throw new IllegalArgumentException("Invalid content type: " + contentType);
        }
    }

    /**
     * Calculate the rating for a content (movie or series) based on all reviews
     *
     * @param contentType Type of content ("movie" or "series")
     * @param contentId   ID of the content
     */
    private void calculateContentRating(String contentType, String contentId) {
        List<Review> reviews = reviewRepository.findByItemId(contentId);
        if (reviews.isEmpty()) {
            return;
        }

        double averageRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);

        int reviewCount = reviews.size();

        if (TYPE_MOVIE.equalsIgnoreCase(contentType)) {
            updateMovieRating(contentId, averageRating, reviewCount);
        } else if (TYPE_SERIES.equalsIgnoreCase(contentType)) {
            updateSeriesRating(contentId, averageRating, reviewCount);
        }
    }

    /**
     * Updates movie rating and review count
     */
    private void updateMovieRating(String movieId, double rating, int reviewCount) {
        movieRepository.findById(movieId).ifPresent(movie -> {
            movie.setRating(rating);
            movie.setReviewCount(reviewCount);
            movieRepository.save(movie);
        });
    }

    /**
     * Updates series rating and review count
     */
    private void updateSeriesRating(String seriesId, double rating, int reviewCount) {
        seriesRepository.findById(seriesId).ifPresent(series -> {
            series.setRating(rating);
            series.setReviewCount(reviewCount);
            seriesRepository.save(series);
        });
    }

    /**
     * Checks if user has already reviewed this content
     */
    private void checkForExistingReview(String userId, String itemId) {
        List<Review> existingReviews = reviewRepository.findByUserIdAndItemId(userId, itemId);
        if (!existingReviews.isEmpty()) {
            throw new IllegalStateException("User has already reviewed this content");
        }
    }

    /**
     * Determines content type (movie or series) based on item ID
     */
    private String determineContentType(String itemId) {
        if (movieRepository.findById(itemId).isPresent()) {
            return TYPE_MOVIE;
        } else if (seriesRepository.findById(itemId).isPresent()) {
            return TYPE_SERIES;
        }
        return null;
    }

    /**
     * Gets the title of an item by its ID and type
     */
    private String getItemTitle(String itemType, String itemId) {
        if (TYPE_MOVIE.equals(itemType)) {
            return movieRepository.findById(itemId)
                    .map(Movie::getTitle)
                    .orElse("Unbekannter Film");
        } else if (TYPE_SERIES.equals(itemType)) {
            return seriesRepository.findById(itemId)
                    .map(Series::getTitle)
                    .orElse("Unbekannte Serie");
        }
        return "Unbekannter Inhalt";
    }


}