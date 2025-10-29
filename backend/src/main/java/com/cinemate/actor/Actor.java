package com.cinemate.actor;

import com.cinemate.actor.DTOs.ActorRequestDTO;
import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "actors")
@Getter
@Setter
@NoArgsConstructor
public class Actor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    @NotNull
    private String name;
    private Date birthday;
    @DBRef(lazy = true)
    private List<Movie> movies;
    @DBRef(lazy = true)
    private List<Series> series;
    private String image;
    private String biography;

    public Actor(String id, String name, Date birthday, String image, String biography) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.image = image;
        this.biography = biography;
    }

    public Actor(ActorRequestDTO actor) {
        this.id = actor.getId();
        this.name = actor.getName();
        this.birthday = actor.getBirthday();
        this.image = actor.getImage();
        this.biography = actor.getBiography();
    }
}
