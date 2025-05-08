package com.cinemate.actor;

import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
import com.fasterxml.jackson.annotation.JsonBackReference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "actors")
public class Actor {
    @Id
    private String id;
    private String name;
    private Date birthday;
    @JsonBackReference
    private List<Movie> movies;
    @JsonBackReference
    private List<Series> series;
    private String image;
    private String biography;

    public Actor(String id, String name, Date birthday, List<Movie> movies, List<Series> series, String image, String biography) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.movies = movies;
        this.series = series;
        this.image = image;
        this.biography = biography;
    }

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
