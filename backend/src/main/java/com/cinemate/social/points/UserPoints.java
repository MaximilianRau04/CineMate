package com.cinemate.social.points;

import com.cinemate.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "user_points")
@Getter
@Setter
@NoArgsConstructor
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
}
