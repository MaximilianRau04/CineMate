package com.cinemate.notification.events;

import com.cinemate.movie.Movie;
import org.springframework.context.ApplicationEvent;

public class MovieReleasedEvent extends ApplicationEvent {
    private final Movie movie;

    public MovieReleasedEvent(Object source, Movie movie) {
        super(source);
        this.movie = movie;
    }

    public Movie getMovie() {
        return movie;
    }
}
