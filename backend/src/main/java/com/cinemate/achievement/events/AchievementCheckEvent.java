package com.cinemate.achievement.events;

import org.springframework.context.ApplicationEvent;

public class AchievementCheckEvent extends ApplicationEvent {
    private final String userId;
    private final String trigger;

    public AchievementCheckEvent(Object source, String userId, String trigger) {
        super(source);
        this.userId = userId;
        this.trigger = trigger;
    }

    public String getUserId() {
        return userId;
    }

    public String getTrigger() {
        return trigger;
    }
}
