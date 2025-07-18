package com.cinemate.social.forum.post;

import com.cinemate.social.forum.ForumCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends MongoRepository<ForumPost, String> {

    Page<ForumPost> findByCategoryAndIsDeletedFalseOrderByCreatedAtDesc(ForumCategory category, Pageable pageable);

    Page<ForumPost> findByIsDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    List<ForumPost> findByIsPinnedTrueAndIsDeletedFalseOrderByCreatedAtDesc();

    Page<ForumPost> findByAuthorIdAndIsDeletedFalseOrderByCreatedAtDesc(String authorId, Pageable pageable);

    Page<ForumPost> findByMovieIdAndIsDeletedFalseOrderByCreatedAtDesc(String movieId, Pageable pageable);

    Page<ForumPost> findBySeriesIdAndIsDeletedFalseOrderByCreatedAtDesc(String seriesId, Pageable pageable);

    @Query("{'$and': [{'isDeleted': false}, {'$or': [{'title': {'$regex': ?0, '$options': 'i'}}, {'content': {'$regex': ?0, '$options': 'i'}}]}]}")
    Page<ForumPost> searchPosts(String searchTerm, Pageable pageable);

    Page<ForumPost> findByIsDeletedFalseOrderByRepliesCountDesc(Pageable pageable);

    Page<ForumPost> findByIsDeletedFalseOrderByLikesCountDesc(Pageable pageable);

    Page<ForumPost> findByIsDeletedFalseOrderByLastModifiedDesc(Pageable pageable);

    long countByCategoryAndIsDeletedFalse(ForumCategory category);

    long countByAuthorIdAndIsDeletedFalse(String authorId);

    @Query("{'$and': [{'isDeleted': false}, {'$or': [{'author.$id': ?0}, {'replies': {'$elemMatch': {'author.$id': ?0}}}]}]}")
    Page<ForumPost> findPostsUserParticipatedIn(String userId, Pageable pageable);
}
