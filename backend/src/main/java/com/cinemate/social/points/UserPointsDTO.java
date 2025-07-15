package com.cinemate.social.points;

import java.util.Date;

public class UserPointsDTO {
    
    private String id;
    private String userId;
    private String username;
    private int totalPoints;
    private int reviewPoints;
    private int watchPoints;
    private int socialPoints;
    private int achievementPoints;
    private Date lastUpdated;
    private String avatarUrl;
    private Date joinedAt;
    
    public UserPointsDTO() {}
    
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public int getTotalPoints() { return totalPoints; }
    public void setTotalPoints(int totalPoints) { this.totalPoints = totalPoints; }
    
    public int getReviewPoints() { return reviewPoints; }
    public void setReviewPoints(int reviewPoints) { this.reviewPoints = reviewPoints; }
    
    public int getWatchPoints() { return watchPoints; }
    public void setWatchPoints(int watchPoints) { this.watchPoints = watchPoints; }
    
    public int getSocialPoints() { return socialPoints; }
    public void setSocialPoints(int socialPoints) { this.socialPoints = socialPoints; }
    
    public int getAchievementPoints() { return achievementPoints; }
    public void setAchievementPoints(int achievementPoints) { this.achievementPoints = achievementPoints; }
    
    public Date getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(Date lastUpdated) { this.lastUpdated = lastUpdated; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public Date getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Date joinedAt) { this.joinedAt = joinedAt; }
}
