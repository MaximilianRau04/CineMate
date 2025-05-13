package com.cinemate.series.DTOs;

import com.cinemate.series.Series;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

public class SeriesRequestDTO {

    private String id;
    @NotNull
    private String title;
    private String description;
    private String genre;
    private double rating;
    private int reviewCount;
    private Date releaseDate;
    private String posterUrl;
    private List<Series.Season> seasons;
    private List<String> actorIds;
    private List<String> directorIds;
    private String country;
    private String trailerUrl;

    public SeriesRequestDTO(String id, String title, String description, String genre, double rating, int reviewCount, Date releaseDate, String posterUrl,
                            List<Series.Season> seasons, List<String> actorIds, List<String> directorIds, String country, String trailerUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
        this.seasons = seasons;
        this.actorIds = actorIds;
        this.directorIds = directorIds;
        this.country = country;
        this.trailerUrl = trailerUrl;
    }

    public SeriesRequestDTO() {}

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

    public List<Series.Season> getSeasons() {
        return seasons;
    }

    public void setSeasons(List<Series.Season> seasons) {
        this.seasons = seasons;
    }

    public List<String> getActorIds() {
        return actorIds;
    }

    public void setActorIds(List<String> actorIds) {
        this.actorIds = actorIds;
    }

    public List<String> getDirectorIds() {
        return directorIds;
    }

    public void setDirectorIds(List<String> directorIds) {
        this.directorIds = directorIds;
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
