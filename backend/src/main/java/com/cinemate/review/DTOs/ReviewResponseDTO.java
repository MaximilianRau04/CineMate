package com.cinemate.review.DTOs;

import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
import com.cinemate.user.User;

import java.util.Date;

public class ReviewResponseDTO {
    private String id;
    private User user;
    private Movie movie;
    private Series series;
    private double rating;
    private String comment;
    private Date date;

    public ReviewResponseDTO(String id, User user, Movie movie, Series series, double rating, String comment, Date date) {
        this.id = id;
        this.user = user;
        this.movie = movie;
        this.series = series;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
    }

    public ReviewResponseDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Series getSeries() {
        return series;
    }

    public void setSeries(Series series) {
        this.series = series;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
