package com.cinemate.social.forum.like;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumLikeRepository extends MongoRepository<ForumLike, String> {

  Optional<ForumLike> findByUserIdAndPostId(String userId, String postId);

  Optional<ForumLike> findByUserIdAndReplyId(String userId, String replyId);

  long countByPostId(String postId);

  long countByReplyId(String replyId);

  void deleteByUserIdAndPostId(String userId, String postId);

  void deleteByUserIdAndReplyId(String userId, String replyId);
}
