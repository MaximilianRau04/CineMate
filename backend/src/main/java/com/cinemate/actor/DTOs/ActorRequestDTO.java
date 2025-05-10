package com.cinemate.actor.DTOs;

import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class ActorRequestDTO {
    private String id;
    @NotNull
    private String name;
    @NotNull
    private Date birthday;
    private String image;
    private String biography;

    public ActorRequestDTO(String id, String name, Date birthday, String image, String biography) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.image = image;
        this.biography = biography;
    }

    public ActorRequestDTO() {}

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
}
