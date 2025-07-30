package com.cinemate.achievement;

import com.cinemate.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "user_achievements")
public class UserAchievement {
    @Id
    private String id;
    
    @DBRef
    @JsonIgnore
    private User user;
    
    @DBRef
    private Achievement achievement;
    
    private Date unlockedAt;
    private int progress;
    private boolean isDisplayed;

    public UserAchievement() {
        this.unlockedAt = new Date();
        this.isDisplayed = true;
    }

    public UserAchievement(User user, Achievement achievement) {
        this();
        this.user = user;
        this.achievement = achievement;
        this.progress = achievement.getThreshold(); // Achievement is complete when created
    }

    public UserAchievement(User user, Achievement achievement, int progress) {
        this();
        this.user = user;
        this.achievement = achievement;
        this.progress = progress;
        if (progress < achievement.getThreshold()) {
            this.unlockedAt = null; // Not yet unlocked
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Achievement getAchievement() { return achievement; }
    public void setAchievement(Achievement achievement) { this.achievement = achievement; }

    public Date getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(Date unlockedAt) { this.unlockedAt = unlockedAt; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public boolean isDisplayed() { return isDisplayed; }
    public void setDisplayed(boolean displayed) { isDisplayed = displayed; }

    public boolean isUnlocked() {
        return unlockedAt != null && progress >= achievement.getThreshold();
    }

    public double getProgressPercentage() {
        if (achievement == null || achievement.getThreshold() == 0) return 0.0;
        return Math.min(100.0, (double) progress / achievement.getThreshold() * 100.0);
    }
}
