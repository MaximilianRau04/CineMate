package com.cinemate.series;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

public class Season {
    @Id
    private String id;
    @Field("season_number")
    private int seasonNumber;
    @Field("episodes")
    private List<Episode> episodes;
    @Field("trailer_url")
    private String trailerUrl;

    public Season(String id, int seasonNumber, List<Episode> episodes, String trailerUrl) {
        this.id = id;
        this.seasonNumber = seasonNumber;
        this.episodes = episodes;
        this.trailerUrl = trailerUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
