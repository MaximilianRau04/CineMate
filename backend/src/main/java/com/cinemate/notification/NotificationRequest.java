package com.cinemate.notification;

public class NotificationRequest {
    private String title;
    private String message;
    private String targetUserId;

    public NotificationRequest() {}

    public NotificationRequest(String title, String message, String targetUserId) {
        this.title = title;
        this.message = message;
        this.targetUserId = targetUserId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(String targetUserId) {
        this.targetUserId = targetUserId;
    }
}
