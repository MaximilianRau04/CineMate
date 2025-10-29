package com.cinemate.notification.events;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserPreferenceChangedEvent {
    private final String userId;
    private final String activityType;
    private final String itemId;
    private final String itemType;

}
