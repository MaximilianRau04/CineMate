package com.cinemate.notification.events;

import org.springframework.context.ApplicationEvent;

public class UserActivityEvent extends ApplicationEvent {
    private final String userId;
    private final ActivityType activityType;
    private final String itemId;

    public enum ActivityType {
        MOVIE_WATCHED,
        SERIES_WATCHED,
        REVIEW_CREATED,
        WATCHLIST_ITEM_ADDED
    }

    public UserActivityEvent(Object source, String userId, ActivityType activityType, String itemId) {
        super(source);
        this.userId = userId;
        this.activityType = activityType;
        this.itemId = itemId;
    }

    public String getUserId() {
        return userId;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public String getItemId() {
        return itemId;
    }
}
