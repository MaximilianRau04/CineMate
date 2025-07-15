package com.cinemate.social.points;

import com.cinemate.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "user_points")
public class UserPoints {
    
    @Id
    private String id;
    
    @DBRef
    @JsonIgnore
    private User user;
    
    private int totalPoints;
    private int reviewPoints;
    private int watchPoints;
    private int socialPoints;
    private int achievementPoints;
    
    private Date lastUpdated;
    
    public UserPoints() {}
    
    public UserPoints(User user) {
        this.user = user;
        this.totalPoints = 0;
        this.reviewPoints = 0;
        this.watchPoints = 0;
        this.socialPoints = 0;
        this.achievementPoints = 0;
        this.lastUpdated = new Date();
    }
    
    public void addPoints(PointsType type, int points) {
        switch (type) {
            case REVIEW:
                this.reviewPoints += points;
                break;
            case WATCH:
                this.watchPoints += points;
                break;
            case SOCIAL:
                this.socialPoints += points;
                break;
            case ACHIEVEMENT:
                this.achievementPoints += points;
                break;
        }
        this.totalPoints += points;
        this.lastUpdated = new Date();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
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
}
