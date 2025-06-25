package com.cinemate.notification.listeners;

import com.cinemate.notification.AutoNotificationService;
import com.cinemate.notification.events.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    @Autowired
    private AutoNotificationService autoNotificationService;

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
}
