package com.cinemate.director.DTOs;

import com.cinemate.director.Director;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectorResponseDTO {

    private String id;
    private String name;
    private Date birthday;
    private String image;
    private String biography;

    public DirectorResponseDTO(Director director) {
        this.id = director.getId();
        this.name = director.getName();
        this.birthday = director.getBirthday();
        this.image = director.getImage();
        this.biography = director.getBiography();
    }
}
