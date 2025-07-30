package com.cinemate.achievement.dto;

import com.cinemate.achievement.Achievement;
import com.cinemate.achievement.AchievementType;

import java.util.Date;

public class AchievementDTO {
    private String id;
    private String title;
    private String description;
    private String iconClass;
    private String badgeColor;
    private AchievementType type;
    private int threshold;
    private int points;
    private boolean isActive;
    private Date createdAt;

    public AchievementDTO() {}

    public AchievementDTO(Achievement achievement) {
        this.id = achievement.getId();
        this.title = achievement.getTitle();
        this.description = achievement.getDescription();
        this.iconClass = achievement.getIconClass();
        this.badgeColor = achievement.getBadgeColor();
        this.type = achievement.getType();
        this.threshold = achievement.getThreshold();
        this.points = achievement.getPoints();
        this.isActive = achievement.isActive();
        this.createdAt = achievement.getCreatedAt();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIconClass() { return iconClass; }
    public void setIconClass(String iconClass) { this.iconClass = iconClass; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public AchievementType getType() { return type; }
    public void setType(AchievementType type) { this.type = type; }

    public int getThreshold() { return threshold; }
    public void setThreshold(int threshold) { this.threshold = threshold; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
