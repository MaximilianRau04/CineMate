package com.cinemate.review;

import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.movie.MovieService;
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

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, MovieRepository movieRepository, SeriesRepository seriesRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;

    }

    /**
     * creates a review for the given userId and the movie or series based on  the given type
     * @param reviewRequestDTO
     * @return
     */
    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO reviewRequestDTO) {
        User user = userRepository.findById(reviewRequestDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User nicht gefunden: " + reviewRequestDTO.getUserId()));

        Movie movie = null;
        Series series = null;

        if ("movie".equalsIgnoreCase(reviewRequestDTO.getType())) {
            movie = movieRepository.findById(reviewRequestDTO.getItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Film nicht gefunden: " + reviewRequestDTO.getItemId()));
        } else if ("series".equalsIgnoreCase(reviewRequestDTO.getType())) {
            series = seriesRepository.findById(reviewRequestDTO.getItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Serie nicht gefunden: " + reviewRequestDTO.getItemId()));
        } else {
            throw new IllegalArgumentException("Ungültiger Typ: Muss 'movie' oder 'series' sein, war: " + reviewRequestDTO.getType());
        }

        List<Review> existingReviews = reviewRepository.findByUserIdAndItemId(
                reviewRequestDTO.getUserId(),
                reviewRequestDTO.getItemId()
        );

        if (!existingReviews.isEmpty()) {
            throw new IllegalStateException("Der Benutzer hat diesen Inhalt bereits bewertet");
        }

        double rating = reviewRequestDTO.getRating();
        if (rating < 0.5 || rating > 5.0 || (rating * 10) % 5 != 0) {
            throw new IllegalArgumentException("Rating muss zwischen 0.5 und 5.0 liegen und in 0.5-Schritten angegeben werden");
        }

        Review review = new Review(
                null,
                reviewRequestDTO.getUserId(),
                reviewRequestDTO.getItemId(),
                rating,
                reviewRequestDTO.getComment(),
                new Date()
        );

        Review savedReview = reviewRepository.save(review);

        if (movie != null) {
            calculateMovieRating(movie.getId());
        } else if (series != null) {
            calculateSeriesRating(series.getId());
        }

        return convertToResponseDTO(savedReview, user, movie, series);
    }


    /**
     * returns the review for the given id
     * @param id
     * @return ReviewResponseDTO
     */
    public Optional<ReviewResponseDTO> getReviewById(String id) {
        return reviewRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    /**
     * returns all reviews
     * @return ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * returns all reviews for the given movie
     * @param movieId
     * @return ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsByMovie(String movieId) {
        return reviewRepository.findByItemId(movieId).stream()
                .filter(review -> {
                    Optional<Movie> movie = movieRepository.findById(review.getItemId());
                    return movie.isPresent();
                })
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * returns all reviews for the given series
     * @param seriesId
     * @return ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsBySeries(String seriesId) {
        return reviewRepository.findByItemId(seriesId).stream()
                .filter(review -> {
                    Optional<Series> series = seriesRepository.findById(review.getItemId());
                    return series.isPresent();
                })
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * returns all reviews for the given user
     * @param userId
     * @return ReviewResponseDTO
     */
    public List<ReviewResponseDTO> getReviewsByUser(String userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * updates the review for the given id
     * @param id
     * @param reviewRequestDTO
     * @return
     */
    public Optional<ReviewResponseDTO> updateReview(String id, ReviewRequestDTO reviewRequestDTO) {
        return reviewRepository.findById(id)
                .map(existingReview -> {
                    if (!existingReview.getUserId().equals(reviewRequestDTO.getUserId())) {
                        throw new IllegalStateException("Nur der Ersteller kann diese Review bearbeiten");
                    }

                    double rating = reviewRequestDTO.getRating();
                    if (rating < 0.5 || rating > 5.0 || (rating * 10) % 5 != 0) {
                        throw new IllegalArgumentException("Rating muss zwischen 0.5 und 5.0 liegen und in 0.5-Schritten angegeben werden");
                    }

                    existingReview.setRating(rating);
                    existingReview.setComment(reviewRequestDTO.getComment());

                    Review updatedReview = reviewRepository.save(existingReview);

                    return convertToResponseDTO(updatedReview);
                });
    }

    /**
     * deletes the review for the given id
     * @param id
     * @return
     */
    public boolean deleteReview(String id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * converts a Review object to a ReviewResponseDTO object
     * @param review
     * @return ReviewResponseDTO
     */
    private ReviewResponseDTO convertToResponseDTO(Review review) {
        User user = userRepository.findById(review.getUserId()).orElse(null);

        Movie movie = null;
        Series series = null;

        Optional<Movie> movieOptional = movieRepository.findById(review.getItemId());
        if (movieOptional.isPresent()) {
            movie = movieOptional.get();
        } else {
            Optional<Series> seriesOptional = seriesRepository.findById(review.getItemId());
            if (seriesOptional.isPresent()) {
                series = seriesOptional.get();
            }
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
     * converts a Review object to a ReviewResponseDTO object if user, movie, series are already available
     * @param review
     * @param user
     * @param movie
     * @param series
     * @return ReviewResponseDTO
     */
    private ReviewResponseDTO convertToResponseDTO(Review review, User user, Movie movie, Series series) {
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
     * calculate the rating for a movie based on all reviews
     * @param movieId
     */
    public void calculateMovieRating(String movieId) {
        List<Review> reviews = reviewRepository.findByItemId(movieId);
        if (reviews.isEmpty()) {
            return;
        }

        double totalRating = 0;
        for (Review review : reviews) {
            totalRating += review.getRating();
        }

        double averageRating = totalRating / reviews.size();
        int reviewCount = reviews.size();

        Optional<Movie> movieOpt = movieRepository.findById(movieId);
        if (movieOpt.isPresent()) {
            Movie movie = movieOpt.get();
            movie.setRating(averageRating);
            movie.setReviewCount(reviewCount);
            movieRepository.save(movie);
        }
    }

    /**
     * calculate the rating for a movie based on all reviews
     * @param seriesId
     */
    public void calculateSeriesRating(String seriesId) {
        List<Review> reviews = reviewRepository.findByItemId(seriesId);
        if (reviews.isEmpty()) {
            return;
        }

        double totalRating = 0;
        for (Review review : reviews) {
            totalRating += review.getRating();
        }

        double averageRating = totalRating / reviews.size();
        int reviewCount = reviews.size();

        Optional<Series> seriesOpt = seriesRepository.findById(seriesId);
        if (seriesOpt.isPresent()) {
            Series series = seriesOpt.get();
            series.setRating(averageRating);
            series.setReviewCount(reviewCount);
            seriesRepository.save(series);
        }
    }
}
