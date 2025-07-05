package com.cinemate.notification.events;

public class UserPreferenceChangedEvent {
    private final String userId;
    private final String activityType;
    private final String itemId;
    private final String itemType; 

    public UserPreferenceChangedEvent(String userId, String activityType, String itemId, String itemType) {
        this.userId = userId;
        this.activityType = activityType;
        this.itemId = itemId;
        this.itemType = itemType;
    }

    public String getUserId() {
        return userId;
    }

    public String getActivityType() {
        return activityType;
    }

    public String getItemId() {
        return itemId;
    }

    public String getItemType() {
        return itemType;
    }
}
