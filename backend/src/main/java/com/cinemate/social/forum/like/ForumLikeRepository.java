package com.cinemate.social.forum.like;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumLikeRepository extends MongoRepository<ForumLike, String> {

    Optional<ForumLike> findByUserIdAndPostId(String userId, String postId);

    Optional<ForumLike> findByUserIdAndReplyId(String userId, String replyId);

    long countByPostId(String postId);

    long countByReplyId(String replyId);

    void deleteByUserIdAndPostId(String userId, String postId);

    void deleteByUserIdAndReplyId(String userId, String replyId);
}
