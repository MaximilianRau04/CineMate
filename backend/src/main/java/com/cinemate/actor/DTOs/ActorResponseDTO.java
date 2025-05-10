package com.cinemate.actor.DTOs;

import com.cinemate.actor.Actor;

import java.util.Date;

public class ActorResponseDTO {

    private String id;
    private String name;
    private Date birthday;
    private String image;
    private String biography;

    public ActorResponseDTO(String id, String name, Date birthday, String image, String biography) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.image = image;
        this.biography = biography;
    }

    public ActorResponseDTO() {}

    public ActorResponseDTO(Actor actor) {
        this.id = actor.getId();
        this.name = actor.getName();
        this.birthday = actor.getBirthday();
        this.image = actor.getImage();
        this.biography = actor.getBiography();
    }

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
