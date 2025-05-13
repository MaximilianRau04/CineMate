package com.cinemate.movie.DTOs;

import com.cinemate.movie.Movie;

import java.util.Date;

public class MovieResponseDTO {

    private String id;
    private String title;
    private String description;
    private String genre;
    private double rating ;
    private int reviewCount;
    private Date releaseDate;
    private String duration;
    private String posterUrl;
    private String country;
    private String trailerUrl;

    public MovieResponseDTO(String id, String title, String description, String genre, double rating, int reviewCount, Date releaseDate, String duration,
                            String posterUrl, String country, String trailerUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.releaseDate = releaseDate;
        this.duration = duration;
        this.posterUrl = posterUrl;
        this.country = country;
        this.trailerUrl = trailerUrl;
    }

    public MovieResponseDTO() {}

    public MovieResponseDTO(Movie movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.description = movie.getDescription();
        this.genre = movie.getGenre();
        this.rating = movie.getRating();
        this.reviewCount = movie.getReviewCount();
        this.releaseDate = movie.getReleaseDate();
        this.duration = movie.getDuration();
        this.posterUrl = movie.getPosterUrl();
        this.country = movie.getCountry();
        this.trailerUrl = movie.getTrailerUrl();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }
}
