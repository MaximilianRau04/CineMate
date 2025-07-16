package com.cinemate.review;

import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.review.DTOs.ReviewRequestDTO;
import com.cinemate.review.DTOs.ReviewResponseDTO;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.user.dtos.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * returns a review by the given id
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getReviewById(@PathVariable String id) {
        Optional<ReviewResponseDTO> review = reviewService.getReviewById(id);
        return review.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * returns all reviews
     * @return ReviewResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        List<ReviewResponseDTO> reviews = reviewService.getAllReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    /**
     * returns all reviews for the given movie
     * @param movieId
     * @return List<ReviewResponseDTO>
     */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByMovie(@PathVariable String movieId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByMovie(movieId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    /**
     * returns all reviews for the given movie
     * @param seriesId
     * @return List<ReviewResponseDTO>
     */
    @GetMapping("/series/{seriesId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsBySeries(@PathVariable String seriesId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsBySeries(seriesId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    /**
     * returns all reviews for the given user
     * @param userId
     * @return List<ReviewResponseDTO>
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByUser(@PathVariable String userId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByUser(userId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    /**
     * returns the review by the given user for the given movie
     * @param movieId
     * @param userId
     * @return ReviewResponseDTO
     */
    @GetMapping("/movie/{movieId}/user/{userId}")
    public ResponseEntity<ReviewResponseDTO> getReviewByMovieAndUser(@PathVariable String movieId, @PathVariable String userId) {
        ReviewResponseDTO review = reviewService.findByMovieIdAndUserId(movieId, userId);
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * returns the review by the given user for the given series
     * @param seriesId
     * @param userId
     * @return ReviewResponseDTO
     */
    @GetMapping("/series/{seriesId}/user/{userId}")
    public ResponseEntity<ReviewResponseDTO> getReviewBySeriesAndUser(@PathVariable String seriesId, @PathVariable String userId) {
        ReviewResponseDTO review = reviewService.findBySeriesIdAndUserId(seriesId, userId);
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    /**
     * returns the user of a review by the given id
     * @param id
     * @return UserResponseDTO
     */
    @GetMapping("/{id}/user")
    public ResponseEntity<UserResponseDTO> getUserByReview(@PathVariable String id) {
        UserResponseDTO user = reviewService.getUserByReviewId(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * returns the movie of a review by the given id
     * @param id
     * @return MovieResponseDTO
     */
    @GetMapping("/{id}/movie")
    public ResponseEntity<MovieResponseDTO> getMovieByReview(@PathVariable String id) {
        MovieResponseDTO movie = reviewService.getMovieByReviewId(id);
        if (movie != null) {
            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * returns the series of a review by the given id
     * @param id
     * @return SeriesResponseDTO
     */
    @GetMapping("/{id}/series")
    public ResponseEntity<SeriesResponseDTO> getSeriesByReview(@PathVariable String id) {
        SeriesResponseDTO series = reviewService.getSeriesByReviewId(id);
        if (series != null) {
            return ResponseEntity.ok(series);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/media")
    public ResponseEntity<Object> getMediaByReview(@PathVariable String id) {
        Map<String, Object> mediaData = reviewService.getMediaByReviewId(id);

        if (mediaData != null) {
            return ResponseEntity.ok(mediaData);
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * creates a review for the given movie and the given user
     * @param movieId
     * @param userId
     * @param reviewDTO
     * @return ReviewResponseDTO
     */
    @PostMapping("/movie/{movieId}/user/{userId}")
    public ResponseEntity<ReviewResponseDTO> createMovieReview(
            @PathVariable String movieId,
            @PathVariable String userId,
            @RequestBody ReviewRequestDTO reviewDTO) {

        reviewDTO.setItemId(movieId);
        reviewDTO.setUserId(userId);

        ReviewResponseDTO createdReview = reviewService.createReview(reviewDTO);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    /**
     * creates a review for the given series and the given user
     * @param seriesId
     * @param userId
     * @param reviewDTO
     * @return ReviewResponseDTO
     */
    @PostMapping("/series/{seriesId}/user/{userId}")
    public ResponseEntity<ReviewResponseDTO> createSeriesReview(
            @PathVariable String seriesId,
            @PathVariable String userId,
            @RequestBody ReviewRequestDTO reviewDTO) {

        reviewDTO.setItemId(seriesId);
        reviewDTO.setUserId(userId);

        ReviewResponseDTO createdReview = reviewService.createReview(reviewDTO);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    /**
     * updates a review
     * @param id
     * @param reviewRequestDTO
     * @return ReviewResponseDTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable String id, @RequestBody ReviewRequestDTO reviewRequestDTO) {
        Optional<ReviewResponseDTO> updatedReview = reviewService.updateReview(id, reviewRequestDTO);
        return updatedReview.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * deletes a review by the given id
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        boolean deleted = reviewService.deleteReview(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
