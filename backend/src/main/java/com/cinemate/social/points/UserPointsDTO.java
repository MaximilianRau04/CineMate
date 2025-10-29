package com.cinemate.social.points;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class UserPointsDTO {
    
    private String id;
    @NotNull
    private String userId;
    @NotNull
    private String username;
    private int totalPoints;
    private int reviewPoints;
    private int watchPoints;
    private int socialPoints;
    private int achievementPoints;
    private Date lastUpdated;
    private String avatarUrl;
    private Date joinedAt;
    
    public UserPointsDTO(UserPoints userPoints) {
        this.id = userPoints.getId();
        this.userId = userPoints.getUser().getId();
        this.username = userPoints.getUser().getUsername();
        this.totalPoints = userPoints.getTotalPoints();
        this.reviewPoints = userPoints.getReviewPoints();
        this.watchPoints = userPoints.getWatchPoints();
        this.socialPoints = userPoints.getSocialPoints();
        this.achievementPoints = userPoints.getAchievementPoints();
        this.lastUpdated = userPoints.getLastUpdated();
        this.avatarUrl = userPoints.getUser().getAvatarUrl();
        this.joinedAt = userPoints.getUser().getJoinedAt();
    }

}
