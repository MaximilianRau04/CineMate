package com.cinemate.director.DTOs;

import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

public class DirectorRequestDTO {
    private String id;
    @NotNull
    private String name;
    @NotNull
    private Date birthday;
    private String image;
    private String biography;
    private List<String> movieIds;
    private List<String> seriesIds;

    public DirectorRequestDTO(String id, String name, Date birthday, String image, String biography, List<String> movieIds, List<String> seriesIds) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.image = image;
        this.biography = biography;
        this.movieIds = movieIds;
        this.seriesIds = seriesIds;
    }
    public DirectorRequestDTO() {}

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

    public List<String> getMovieIds() {
        return movieIds;
    }

    public void setMovieIds(List<String> movieIds) {
        this.movieIds = movieIds;
    }

    public List<String> getSeriesIds() {
        return seriesIds;
    }

    public void setSeriesIds(List<String> seriesIds) {
        this.seriesIds = seriesIds;
    }
}
