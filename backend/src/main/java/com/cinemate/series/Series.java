package com.cinemate.series;

import com.cinemate.actor.Actor;
import com.cinemate.director.Director;
import com.cinemate.series.DTOs.SeriesRequestDTO;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "series")
public class Series {

    @Id
    private String id;
    @NotNull
    private String title;
    private String description;
    private String genre;
    private double rating;
    private int reviewCount;
    private Date releaseDate;
    private String posterUrl;
    @JsonManagedReference
    private List<Season> seasons;
    @JsonManagedReference
    private List<Actor> actors;
    @JsonManagedReference
    private List<Director> directors;
    private String country;
    private String trailerUrl;
    // tags

    public Series(String id, String title, String description, String genre, double rating, int reviewCount, Date releaseDate, String posterUrl, List<Season> seasons,
                  String country, String trailerUrl) {
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

    public Series() {}

    public Series(SeriesRequestDTO series) {
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

    public List<Season> getSeasons() {
        return seasons;
    }

    public void setSeasons(List<Season> seasons) {
        this.seasons = seasons;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<Actor> getActors() {
        return actors;
    }

    public void setActors(List<Actor> actors) {
        this.actors = actors;
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

    public List<Director> getDirectors() {
        return directors;
    }

    public void setDirectors(List<Director> directors) {
        this.directors = directors;
    }

    public static class Season {
        private int seasonNumber;
        private List<Episode> episodes;
        private String trailerUrl;

        public Season(int seasonNumber, List<Episode> episodes, String trailerUrl) {
            this.seasonNumber = seasonNumber;
            this.episodes = episodes;
            this.trailerUrl = trailerUrl;
        }

        public int getSeasonNumber() {
            return seasonNumber;
        }

        public void setSeasonNumber(int seasonNumber) {
            this.seasonNumber = seasonNumber;
        }

        public List<Episode> getEpisodes() {
            return episodes;
        }

        public void setEpisodes(List<Episode> episodes) {
            this.episodes = episodes;
        }

        public String getTrailerUrl() {
            return trailerUrl;
        }

        public void setTrailerUrl(String trailerUrl) {
            this.trailerUrl = trailerUrl;
        }
    }

    public static class Episode {
        private String title;
        private int episodeNumber;
        private String duration;
        private Date releaseDate;
        private String description;
        private String posterUrl;

        public Episode(String title, int episodeNumber, String duration, Date releaseDate, String description, String posterUrl) {
            this.title = title;
            this.episodeNumber = episodeNumber;
            this.duration = duration;
            this.releaseDate = releaseDate;
            this.description = description;
            this.posterUrl = posterUrl;

        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public int getEpisodeNumber() {
            return episodeNumber;
        }

        public void setEpisodeNumber(int episodeNumber) {
            this.episodeNumber = episodeNumber;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public Date getReleaseDate() {
            return releaseDate;
        }

        public void setReleaseDate(Date releaseDate) {
            this.releaseDate = releaseDate;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getPosterUrl() {
            return posterUrl;
        }

        public void setPosterUrl(String posterUrl) {
            this.posterUrl = posterUrl;
        }

    }
}
