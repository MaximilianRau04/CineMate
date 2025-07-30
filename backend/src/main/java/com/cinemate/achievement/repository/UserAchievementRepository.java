package com.cinemate.achievement.repository;

import com.cinemate.achievement.UserAchievement;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserAchievementRepository extends MongoRepository<UserAchievement, String> {
    List<UserAchievement> findByUserIdOrderByUnlockedAtDesc(String userId);
    List<UserAchievement> findByUserIdAndUnlockedAtIsNotNull(String userId);
    List<UserAchievement> findByUserIdAndUnlockedAtIsNull(String userId);
    Optional<UserAchievement> findByUserIdAndAchievementId(String userId, String achievementId);
    List<UserAchievement> findByUserIdAndIsDisplayedTrue(String userId);
    long countByUserIdAndUnlockedAtIsNotNull(String userId);
}
