package com.cinemate.notification.listeners;

import com.cinemate.notification.AutoNotificationService;
import com.cinemate.notification.events.*;
import com.cinemate.recommendation.RecommendationNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    @Autowired
    private AutoNotificationService autoNotificationService;

    @Autowired
    private RecommendationNotificationService recommendationNotificationService;

    @EventListener
    @Async
    public void handleMovieReleasedEvent(MovieReleasedEvent event) {
        autoNotificationService.notifyMovieWatchlistReleased(event.getMovie());
    }

    @EventListener
    @Async
    public void handleSeriesUpdatedEvent(SeriesUpdatedEvent event) {
        switch (event.getEventType()) {
            case NEW_SEASON:
                autoNotificationService.notifySeriesNewSeason(event.getSeries(), event.getNewSeason());
                break;
            case NEW_EPISODE:
                autoNotificationService.notifySeriesNewEpisode(event.getSeries(), event.getNewSeason(), event.getNewEpisode());
                break;
            case STATUS_CHANGED:
                autoNotificationService.notifySeriesStatusChanged(event.getSeries(), event.getOldStatus());
                break;
        }
    }

    @EventListener
    @Async
    public void handleReviewCreatedEvent(ReviewCreatedEvent event) {
        autoNotificationService.notifyWatchlistItemReviewed(
            event.getReview(), 
            event.getItemTitle(), 
            event.getItemType()
        );

        autoNotificationService.notifyFavoriteItemReviewed(
            event.getReview(), 
            event.getItemTitle(), 
            event.getItemType()
        );
    }

    @EventListener
    @Async
    public void handleUserActivityEvent(UserActivityEvent event) {
        autoNotificationService.checkAndNotifyMilestones(event.getUserId());
    }

    @EventListener
    @Async
    public void handleUserPreferenceChangedEvent(UserPreferenceChangedEvent event) {
        // Send triggered recommendations based on user activity
        try {
            recommendationNotificationService.sendTriggeredRecommendations(
                event.getUserId(), 
                event.getActivityType()
            );
        } catch (Exception e) {
            System.err.println("Error sending triggered recommendation notifications for user " 
                + event.getUserId() + ": " + e.getMessage());
        }
    }

    @EventListener
    @Async
    public void handleForumPostCreatedEvent(ForumPostCreatedEvent event) {
        autoNotificationService.notifyForumPostCreated(event.getForumPost());
    }

    @EventListener
    @Async
    public void handleForumReplyCreatedEvent(ForumReplyCreatedEvent event) {
        autoNotificationService.notifyForumReplyCreated(event.getForumReply(), event.getForumPost());
    }
}
