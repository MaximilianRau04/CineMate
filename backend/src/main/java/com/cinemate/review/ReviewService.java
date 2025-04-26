package com.cinemate.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    public Optional<Review> getReviewById(String id) {
        return reviewRepository.findById(id);
    }

    public ResponseEntity<Review> createReview(Review review) {
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    public ResponseEntity<Review> updateReview(String id, Review updatedReview) {
        updatedReview.setId(id);
        return ResponseEntity.ok(reviewRepository.save(updatedReview));
    }

    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }
}
