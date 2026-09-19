package com.cinemate.review;

import java.util.Date;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ReviewRepository extends MongoRepository<Review, String> {
  List<Review> findByUserId(String userId);

  List<Review> findByItemId(String itemId);

  List<Review> findByUserIdAndItemId(String userId, String itemId);

  Review findByItemIdAndUserId(String itemId, String userId);

  long countByUserId(String userId);

  // Alternative Standard-Spring-Data-Methoden
  List<Review> findTop10ByUserIdOrderByDateDesc(String userId);

  // Neue Methoden für Statistiken
  @Query("{'userId': ?0, 'date': {$gte: ?1}}")
  List<Review> findByUserIdAndDateAfter(String userId, Date dateAfter);
}
