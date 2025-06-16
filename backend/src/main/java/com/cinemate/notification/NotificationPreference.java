package com.cinemate.notification;

public class NotificationPreference {
    private NotificationType type;
    private boolean emailEnabled;
    private boolean webEnabled;

    public NotificationPreference() {}

    public NotificationPreference(NotificationType type, boolean emailEnabled, boolean webEnabled) {
        this.type = type;
        this.emailEnabled = emailEnabled;
        this.webEnabled = webEnabled;
    }

    public NotificationType getType() { return type; }

    public void setType(NotificationType type) { this.type = type; }

    public boolean isEmailEnabled() { return emailEnabled; }

    public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }

    public boolean isWebEnabled() { return webEnabled; }

    public void setWebEnabled(boolean webEnabled) { this.webEnabled = webEnabled; }
}