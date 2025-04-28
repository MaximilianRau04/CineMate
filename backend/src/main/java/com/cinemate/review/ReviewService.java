package com.cinemate.review;

import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.review.DTOs.ReviewRequestDTO;
import com.cinemate.review.DTOs.ReviewResponseDTO;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    private static final String TYPE_MOVIE = "movie";
    private static final String TYPE_SERIES = "series";
    private static final double MIN_RATING = 0.5;
    private static final double MAX_RATING = 5.0;
    private static final double RATING_STEP = 0.5;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
                         MovieRepository movieRepository, SeriesRepository seriesRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
    }

    /**
     * Creates a review for the given userId and the movie or series based on the given type
     * @param reviewRequestDTO Data transfer object containing review information
     * @return Response DTO with created review data
     */
    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO reviewRequestDTO) {
        User user = userRepository.findById(reviewRequestDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + reviewRequestDTO.getUserId()));

        String itemType = reviewRequestDTO.getType().toLowerCase();
        String itemId = reviewRequestDTO.getItemId();
        Object content = getContentByTypeAndId(itemType, itemId);
        checkForExistingReview(reviewRequestDTO.getUserId(), itemId);
        validateRating(reviewRequestDTO.getRating());
        Review review = new Review(
                null,
                reviewRequestDTO.getUserId(),
                itemId,
                reviewRequestDTO.getRating(),
                reviewRequestDTO.getComment(),
                new Date()
        );

        Review savedReview = reviewRepository.save(review);
        calculateContentRating(itemType, itemId);
        return convertToResponseDTO(savedReview);
    }

    /**
     * Returns the review for the given id
     * @param id Review ID
     * @return ReviewResponseDTO if found
     */
    public Optional<ReviewResponseDTO> getReviewById(String id) {
        return reviewRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    /**
     * Returns all reviews
     * @return List of ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns all reviews for the given movie
     * @param movieId Movie ID
     * @return List of ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsByMovie(String movieId) {
        return reviewRepository.findByItemId(movieId).stream()
                .filter(review -> movieRepository.findById(review.getItemId()).isPresent())
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns all reviews for the given series
     * @param seriesId Series ID
     * @return List of ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsBySeries(String seriesId) {
        return reviewRepository.findByItemId(seriesId).stream()
                .filter(review -> seriesRepository.findById(review.getItemId()).isPresent())
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Returns all reviews for the given user
     * @param userId User ID
     * @return List of ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsByUser(String userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * returns a review by the given user for the given movie
     * @param movieId
     * @param userId
     * @return ReviewResponseDTO
     */
    public ReviewResponseDTO findByMovieIdAndUserId(String movieId, String userId) {
        Review review = reviewRepository.findByItemIdAndUserId(movieId, userId);
        return convertToResponseDTO(review);

    }

    /**
     * Updates the review for the given id
     * @param id Review ID
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

                    return convertToResponseDTO(updatedReview);
                });
    }

    /**
     * Deletes the review for the given id
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
     * Converts a Review object to a ReviewResponseDTO object
     * @param review Review to convert
     * @return ReviewResponseDTO
     */
    private ReviewResponseDTO convertToResponseDTO(Review review) {
        User user = userRepository.findById(review.getUserId()).orElse(null);

        Movie movie = null;
        Series series = null;

        if (movieRepository.findById(review.getItemId()).isPresent()) {
            movie = movieRepository.findById(review.getItemId()).get();
        } else if (seriesRepository.findById(review.getItemId()).isPresent()) {
            series = seriesRepository.findById(review.getItemId()).get();
        }

        return new ReviewResponseDTO(
                review.getId(),
                user,
                movie,
                series,
                review.getRating(),
                review.getComment(),
                review.getDate()
        );
    }

    /**
     * Calculate the rating for a content (movie or series) based on all reviews
     * @param contentType Type of content ("movie" or "series")
     * @param contentId ID of the content
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
     * Gets content (movie or series) by type and ID
     */
    private Object getContentByTypeAndId(String type, String id) {
        if (TYPE_MOVIE.equalsIgnoreCase(type)) {
            return movieRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + id));
        } else if (TYPE_SERIES.equalsIgnoreCase(type)) {
            return seriesRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Series not found: " + id));
        } else {
            throw new IllegalArgumentException("Invalid type: Must be 'movie' or 'series', was: " + type);
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
}