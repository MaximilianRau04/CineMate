package com.cinemate.actor.DTOs;

import com.cinemate.actor.Actor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActorResponseDTO {

    private String id;
    private String name;
    private Date birthday;
    private String image;
    private String biography;

    public ActorResponseDTO(Actor actor) {
        this.id = actor.getId();
        this.name = actor.getName();
        this.birthday = actor.getBirthday();
        this.image = actor.getImage();
        this.biography = actor.getBiography();
    }

}
