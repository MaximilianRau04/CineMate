package com.cinemate.actor;

import com.cinemate.actor.DTOs.ActorRequestDTO;
import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "actors")
public class Actor {
    @Id
    private String id;
    private String name;
    private Date birthday;
    @DBRef(lazy = true)
    private List<Movie> movies;
    @DBRef(lazy = true)
    private List<Series> series;
    private String image;
    private String biography;

    public Actor(String id, String name, Date birthday, String image, String biography) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.image = image;
        this.biography = biography;
    }

    public Actor(ActorRequestDTO actor) {
        this.id = actor.getId();
        this.name = actor.getName();
        this.birthday = actor.getBirthday();
        this.image = actor.getImage();
        this.biography = actor.getBiography();
    }

    public Actor() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }

    public List<Series> getSeries() {
        return series;
    }

    public void setSeries(List<Series> series) {
        this.series = series;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }
}
