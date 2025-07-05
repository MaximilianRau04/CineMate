package com.cinemate.recommendation.utils;

import com.cinemate.notification.events.UserPreferenceChangedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class RecommendationTriggerUtil {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    /**
     * Triggers recommendation notifications when a user adds a new favorite
     * @param userId The user's ID
     * @param itemId The ID of the favorited item
     * @param itemType The type of the item ("movie" or "series")
     */
    public void triggerOnNewFavorite(String userId, String itemId, String itemType) {
        UserPreferenceChangedEvent event = new UserPreferenceChangedEvent(
            userId, "new_favorite", itemId, itemType
        );
        eventPublisher.publishEvent(event);
    }

    /**
     * Triggers recommendation notifications when a user submits a new rating
     * @param userId The user's ID
     * @param itemId The ID of the rated item
     * @param itemType The type of the item ("movie" or "series")
     */
    public void triggerOnNewRating(String userId, String itemId, String itemType) {
        UserPreferenceChangedEvent event = new UserPreferenceChangedEvent(
            userId, "new_rating", itemId, itemType
        );
        eventPublisher.publishEvent(event);
    }

    /**
     * Triggers recommendation notifications when a user updates their watchlist
     * @param userId The user's ID
     * @param itemId The ID of the item
     * @param itemType The type of the item ("movie" or "series")
     */
    public void triggerOnWatchlistUpdate(String userId, String itemId, String itemType) {
        UserPreferenceChangedEvent event = new UserPreferenceChangedEvent(
            userId, "watchlist_update", itemId, itemType
        );
        eventPublisher.publishEvent(event);
    }

    /**
     * Triggers recommendation notifications when a user marks an item as "watched"
     * @param userId The user's ID
     * @param itemId The ID of the item
     * @param itemType The type of the item ("movie" or "series")
     */
    public void triggerOnWatched(String userId, String itemId, String itemType) {
        UserPreferenceChangedEvent event = new UserPreferenceChangedEvent(
            userId, "watched", itemId, itemType
        );
        eventPublisher.publishEvent(event);
    }
}
