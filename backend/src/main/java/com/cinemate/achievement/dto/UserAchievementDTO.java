package com.cinemate.achievement.dto;

import com.cinemate.achievement.UserAchievement;

import java.util.Date;

public class UserAchievementDTO {
    private String id;
    private String userId;
    private AchievementDTO achievement;
    private Date unlockedAt;
    private int progress;
    private boolean isDisplayed;
    private boolean isUnlocked;
    private double progressPercentage;

    public UserAchievementDTO() {}

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public AchievementDTO getAchievement() { return achievement; }
    public void setAchievement(AchievementDTO achievement) { this.achievement = achievement; }

    public Date getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(Date unlockedAt) { this.unlockedAt = unlockedAt; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public boolean isDisplayed() { return isDisplayed; }
    public void setDisplayed(boolean displayed) { isDisplayed = displayed; }

    public boolean isUnlocked() { return isUnlocked; }
    public void setUnlocked(boolean unlocked) { isUnlocked = unlocked; }

    public double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }
}
