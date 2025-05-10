package com.cinemate.series.DTOs;

import com.cinemate.actor.Actor;
import com.cinemate.director.Director;
import com.cinemate.series.Series;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class SeriesResponseDTO {
    private String id;
    private String title;
    private String description;
    private String genre;
    private double rating;
    private int reviewCount;
    private Date releaseDate;
    private String posterUrl;
    @JsonBackReference
    private List<Series.Season> seasons;
    @ManyToMany(mappedBy = "series")
    @JsonBackReference
    private List<Actor> actors;
    @ManyToOne
    @JsonBackReference
    private Director director;
    private String country;
    private String trailerUrl;

    public SeriesResponseDTO(String id, String title, String description, String genre, double rating, int reviewCount, Date releaseDate, String posterUrl,
                             List<Series.Season> seasons,  String country, String trailerUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
        this.seasons = seasons;
        this.country = country;
        this.trailerUrl = trailerUrl;
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
        this.seasons = series.getSeasons();
        this.country = series.getCountry();
        this.trailerUrl = series.getTrailerUrl();
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

    public List<Actor> getActors() {
        return actors;
    }

    public void setActors(List<Actor> actors) {
        this.actors = actors;
    }

    public Director getDirector() {
        return director;
    }

    public void setDirector(Director director) {
        this.director = director;
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

    public List<Series.Season> getSeasons() {
        return seasons;
    }

    public void setSeasons(List<Series.Season> seasons) {
        this.seasons = seasons;
    }
}
