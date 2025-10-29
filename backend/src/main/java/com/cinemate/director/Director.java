package com.cinemate.director;

import com.cinemate.director.DTOs.DirectorRequestDTO;
import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "directors")
@Getter
@Setter
@NoArgsConstructor
public class Director {
    @Id
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

    public Director(String id, String name, Date birthday, String image, String biography) {
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.image = image;
        this.biography = biography;
    }

    public Director(DirectorRequestDTO director) {
        this.id = director.getId();
        this.name = director.getName();
        this.birthday = director.getBirthday();
        this.image = director.getImage();
        this.biography = director.getBiography();
    }
}
