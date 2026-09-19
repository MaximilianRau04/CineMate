package com.cinemate.achievement.repository;

import com.cinemate.achievement.Achievement;
import com.cinemate.achievement.AchievementType;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AchievementRepository extends MongoRepository<Achievement, String> {
  List<Achievement> findByTypeAndIsActiveTrue(AchievementType type);

  List<Achievement> findByIsActiveTrue();

  List<Achievement> findByThresholdLessThanEqualAndTypeAndIsActiveTrue(
      int threshold, AchievementType type);
}
