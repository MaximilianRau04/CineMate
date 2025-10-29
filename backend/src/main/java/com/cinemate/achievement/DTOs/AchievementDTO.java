package com.cinemate.achievement.DTOs;

import com.cinemate.achievement.Achievement;
import com.cinemate.achievement.AchievementType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
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

}
