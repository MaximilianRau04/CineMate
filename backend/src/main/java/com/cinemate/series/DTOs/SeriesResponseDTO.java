package com.cinemate.series.DTOs;

import com.cinemate.series.Series;
import com.cinemate.series.Status;

import java.util.Date;

public class SeriesResponseDTO {
    private String id;
    private String title;
    private String description;
    private String genre;
    private double rating;
    private int reviewCount;
    private Date releaseDate;
    private String posterUrl;
    private String country;
    private String trailerUrl;
    private Status status;

    public SeriesResponseDTO(String id, String title, String description, String genre, double rating, int reviewCount, Date releaseDate, String posterUrl,
                             String country, String trailerUrl, Status status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
        this.country = country;
        this.trailerUrl = trailerUrl;
        this.status = status;
    }

    public SeriesResponseDTO(Series series) {
        this.id = series.getId();
        this.title = series.getTitle();
        this.description = series.getDescription();
        this.genre = series.getGenre();
        this.rating = series.getRating();
        this.reviewCount = series.getReviewCount();
        this.releaseDate = series.getReleaseDate();
        this.posterUrl = series.getPosterUrl();
        this.country = series.getCountry();
        this.trailerUrl = series.getTrailerUrl();
        this.status = series.getStatus();
    }

    public SeriesResponseDTO() {}

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

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
