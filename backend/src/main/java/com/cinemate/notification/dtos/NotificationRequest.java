package com.cinemate.notification.dtos;

import com.cinemate.notification.NotificationType;

import java.util.Map;

public class NotificationRequest {
    private String userId;
    private NotificationType type;
    private String title;
    private String message;
    private String itemId;
    private String ItemType;
    private Map<String, Object> metadata;

    public NotificationRequest(String userId, NotificationType type, String title, String message, String itemId, String itemType, Map<String, Object> metadata) {
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.itemId = itemId;
        ItemType = itemType;
        this.metadata = metadata;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getItemType() {
        return ItemType;
    }

    public void setItemType(String itemType) {
        ItemType = itemType;
    }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}

