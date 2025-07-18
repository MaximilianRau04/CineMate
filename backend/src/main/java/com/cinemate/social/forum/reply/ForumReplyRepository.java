package com.cinemate.social.forum.reply;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumReplyRepository extends MongoRepository<ForumReply, String> {

    Page<ForumReply> findByParentPostIdAndIsDeletedFalseOrderByCreatedAtAsc(String postId, Pageable pageable);

    Page<ForumReply> findByAuthorIdAndIsDeletedFalseOrderByCreatedAtDesc(String authorId, Pageable pageable);

    long countByParentPostIdAndIsDeletedFalse(String postId);

    long countByAuthorIdAndIsDeletedFalse(String authorId);

    Page<ForumReply> findByIsDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    Page<ForumReply> findByIsDeletedFalseOrderByLikesCountDesc(Pageable pageable);

    @Query("{'parentPost.author.$id': ?0, 'isDeleted': false}")
    List<ForumReply> findRepliesOnUserPosts(String userId);

    @Query("{'parentPost.author.$id': ?0, 'isDeleted': false, 'createdAt': {'$gte': ?1}}")
    List<ForumReply> findRecentRepliesOnUserPosts(String userId, java.util.Date since);
}
