package com.cinemate.review;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository <Review, String> {
    List<Review> findByUserId(String userId);
    List<Review> findByItemId(String itemId);
    List<Review> findByUserIdAndItemId(String userId, String itemId);
    Review findByItemIdAndUserId(String itemId, String userId);
    long countByUserId(String userId);
}
