package com.cinemate.social.forum.subscription;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ForumSubscriptionRepository extends MongoRepository<ForumSubscription, String> {

    Optional<ForumSubscription> findByUserIdAndPostIdAndIsActiveTrue(String userId, String postId);

    List<ForumSubscription> findByUserIdAndIsActiveTrue(String userId);

    List<ForumSubscription> findByPostIdAndIsActiveTrue(String postId);

    @Query("{'post.$id': ?0, 'isActive': true}")
    List<ForumSubscription> findSubscribersForPost(String postId);

    long countByPostIdAndIsActiveTrue(String postId);

    long countByUserIdAndIsActiveTrue(String userId);
}
