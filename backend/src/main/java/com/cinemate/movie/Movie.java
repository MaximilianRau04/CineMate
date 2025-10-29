package com.cinemate.movie;

import com.cinemate.actor.Actor;
import com.cinemate.director.Director;
import com.cinemate.movie.DTOs.MovieRequestDTO;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "movies")
@Getter
@Setter
@NoArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    @NotNull
    private String title;
    private String description;
    private String genre;
    private double rating ;
    private int reviewCount;
    private Date releaseDate;
    private String duration;
    private String posterUrl;
    @DBRef(lazy = true)
    private List<Director> directors;
    @DBRef(lazy = true)
    private List<Actor> actors;
    private String country;
    private String trailerUrl;

    public Movie(String id, String title, String description, String genre, double rating, int reviewCount, Date releaseDate, String duration, String posterUrl,
                 String country, String trailerUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.releaseDate = releaseDate;
        this.duration = duration;
        this.posterUrl = posterUrl;
        this.country = country;
        this.trailerUrl = trailerUrl;
    }

    public Movie(MovieRequestDTO movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.description = movie.getDescription();
        this.genre = movie.getGenre();
        this.rating = movie.getRating();
        this.reviewCount = movie.getReviewCount();
        this.releaseDate = movie.getReleaseDate();
        this.duration = movie.getDuration();
        this.posterUrl = movie.getPosterUrl();
        this.country = movie.getCountry();
        this.trailerUrl = movie.getTrailerUrl();
    }
}
