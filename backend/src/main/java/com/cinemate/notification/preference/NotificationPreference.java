package com.cinemate.notification.preference;

import com.cinemate.notification.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreference {
    private NotificationType type;
    private boolean emailEnabled;
    private boolean webEnabled;

}