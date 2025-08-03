package com.cinemate.customlist;

import com.cinemate.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomListRepository extends MongoRepository<CustomList, String> {

    List<CustomList> findByCreatorOrderByUpdatedAtDesc(User creator);
    Page<CustomList> findByIsPublicTrueOrderByUpdatedAtDesc(Pageable pageable);
    @Query("{'title': {$regex: ?0, $options: 'i'}, 'isPublic': true}")
    Page<CustomList> findByTitleContainingIgnoreCaseAndIsPublicTrue(String title, Pageable pageable);
    @Query("{'tags': {$in: ?0}, 'isPublic': true}")
    Page<CustomList> findByTagsInAndIsPublicTrue(List<String> tags, Pageable pageable);
    Page<CustomList> findByIsPublicTrueOrderByLikesCountDescUpdatedAtDesc(Pageable pageable);
    List<CustomList> findByCreatorAndIsPublic(User creator, boolean isPublic);
    long countByCreator(User creator);
    @Query("{'movies': ?0, 'isPublic': true}")
    List<CustomList> findPublicListsContainingMovie(String movieId);
    @Query("{'series': ?0, 'isPublic': true}")
    List<CustomList> findPublicListsContainingSeries(String seriesId);
}
