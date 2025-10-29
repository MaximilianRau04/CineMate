package com.cinemate.notification.events;

import com.cinemate.movie.Movie;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class MovieReleasedEvent extends ApplicationEvent {
    private final Movie movie;

    public MovieReleasedEvent(Object source, Movie movie) {
        super(source);
        this.movie = movie;
    }

}
