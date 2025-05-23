package com.cinemate.series;

import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

public class Episode {
    @Field("episode_number")
    private int episodeNumber;
    @Field("title")
    private String title;
    @Field("description")
    private String description;
    @Field("duration")
    private String duration;
    @Field("release_date")
    private Date releaseDate;
    @Field("poster_url")
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
