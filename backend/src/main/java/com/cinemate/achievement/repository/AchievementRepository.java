package com.cinemate.achievement.repository;

import com.cinemate.achievement.Achievement;
import com.cinemate.achievement.AchievementType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AchievementRepository extends MongoRepository<Achievement, String> {
    List<Achievement> findByTypeAndIsActiveTrue(AchievementType type);
    List<Achievement> findByIsActiveTrue();
    List<Achievement> findByThresholdLessThanEqualAndTypeAndIsActiveTrue(int threshold, AchievementType type);
}
