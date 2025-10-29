package com.cinemate.achievement;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "achievements")
@Getter
@Setter
public class Achievement {

    @Id
    private String id;

    @NotNull
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
}
