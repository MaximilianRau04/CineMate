package com.cinemate.achievement;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "achievements")
public class Achievement {
    @Id
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

    public Achievement() {
        this.createdAt = new Date();
        this.isActive = true;
    }

    public Achievement(String title, String description, String iconClass, String badgeColor, 
                      AchievementType type, int threshold, int points) {
        this();
        this.title = title;
        this.description = description;
        this.iconClass = iconClass;
        this.badgeColor = badgeColor;
        this.type = type;
        this.threshold = threshold;
        this.points = points;
    }

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
