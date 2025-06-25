package com.cinemate.notification.events;

import com.cinemate.series.Episode;
import com.cinemate.series.Season;
import com.cinemate.series.Series;
import org.springframework.context.ApplicationEvent;

public class SeriesUpdatedEvent extends ApplicationEvent {
    private final Series series;
    private final Season newSeason;
    private final Episode newEpisode;
    private final String oldStatus;
    private final EventType eventType;

    public enum EventType {
        NEW_SEASON,
        NEW_EPISODE,
        STATUS_CHANGED
    }

    public SeriesUpdatedEvent(Object source, Series series, Season newSeason) {
        super(source);
        this.series = series;
        this.newSeason = newSeason;
        this.newEpisode = null;
        this.oldStatus = null;
        this.eventType = EventType.NEW_SEASON;
    }

    public SeriesUpdatedEvent(Object source, Series series, Season season, Episode newEpisode) {
        super(source);
        this.series = series;
        this.newSeason = season;
        this.newEpisode = newEpisode;
        this.oldStatus = null;
        this.eventType = EventType.NEW_EPISODE;
    }

    public SeriesUpdatedEvent(Object source, Series series, String oldStatus) {
        super(source);
        this.series = series;
        this.newSeason = null;
        this.newEpisode = null;
        this.oldStatus = oldStatus;
        this.eventType = EventType.STATUS_CHANGED;
    }

    public Series getSeries() {
        return series;
    }

    public Season getNewSeason() {
        return newSeason;
    }

    public Episode getNewEpisode() {
        return newEpisode;
    }

    public String getOldStatus() {
        return oldStatus;
    }

    public EventType getEventType() {
        return eventType;
    }
}
