package com.cinemate.social.points;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Event listener that automatically awards points for various user actions
 */
@Component
public class PointsEventListener {
    
    private final PointsService pointsService;
    
    @Autowired
    public PointsEventListener(PointsService pointsService) {
        this.pointsService = pointsService;
    }
    
    /**
     * Award points when user writes a review
     */
    public void onReviewCreated(String userId) {
        pointsService.awardPoints(userId, PointsType.REVIEW);
    }
    
    /**
     * Award points when user marks content as watched
     */
    public void onContentWatched(String userId) {
        pointsService.awardPoints(userId, PointsType.WATCH);
    }
    
    /**
     * Award points for social interactions (handled in FriendService)
     */
    public void onSocialInteraction(String userId, int customPoints) {
        pointsService.awardPoints(userId, PointsType.SOCIAL, customPoints);
    }
    
    /**
     * Award points for achievements
     */
    public void onAchievementUnlocked(String userId, int customPoints) {
        pointsService.awardPoints(userId, PointsType.ACHIEVEMENT, customPoints);
    }
}
