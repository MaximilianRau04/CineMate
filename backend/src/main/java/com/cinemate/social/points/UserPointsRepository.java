package com.cinemate.social.points;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPointsRepository extends MongoRepository<UserPoints, String> {

  Optional<UserPoints> findByUser_Id(String userId);

  @Query("{ 'user.$id': ObjectId(?0) }")
  Optional<UserPoints> findByUserId(String userId);

  @Query(value = "{}", sort = "{ 'totalPoints': -1 }")
  List<UserPoints> findAllOrderByTotalPointsDesc();

  List<UserPoints> findTop10ByOrderByTotalPointsDesc();

  List<UserPoints> findAllByUser_Id(String userId);
}
