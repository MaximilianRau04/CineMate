package com.cinemate.achievement.DTOs;

import com.cinemate.achievement.UserAchievement;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class UserAchievementDTO {
    private String id;
    private String userId;
    private AchievementDTO achievement;
    private Date unlockedAt;
    private int progress;
    private boolean isDisplayed;
    private boolean isUnlocked;
    private double progressPercentage;


    public UserAchievementDTO(UserAchievement userAchievement) {
        this.id = userAchievement.getId();
        this.userId = userAchievement.getUser().getId();
        this.achievement = new AchievementDTO(userAchievement.getAchievement());
        this.unlockedAt = userAchievement.getUnlockedAt();
        this.progress = userAchievement.getProgress();
        this.isDisplayed = userAchievement.isDisplayed();
        this.isUnlocked = userAchievement.isUnlocked();
        this.progressPercentage = userAchievement.getProgressPercentage();
    }
}
