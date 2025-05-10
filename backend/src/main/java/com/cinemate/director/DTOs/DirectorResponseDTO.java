package com.cinemate.director.DTOs;

import com.cinemate.director.Director;

import java.util.Date;

public class DirectorResponseDTO {

    private String id;
    private String name;
    private Date birthday;
    private String image;
    private String biography;

    public DirectorResponseDTO(String id, String name, Date birthday, String image, String biography) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.image = image;
        this.biography = biography;
    }

    public DirectorResponseDTO() {}

    public DirectorResponseDTO(Director director) {
        this.id = director.getId();
        this.name = director.getName();
        this.birthday = director.getBirthday();
        this.image = director.getImage();
        this.biography = director.getBiography();
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
