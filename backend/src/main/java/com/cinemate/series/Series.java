package com.cinemate.series;

import com.cinemate.actor.Actor;
import com.cinemate.director.Director;
import com.cinemate.series.DTOs.SeriesRequestDTO;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "series")
@Getter
@Setter
@NoArgsConstructor
public class Series {

    @Id
    private String id;
    @NotNull
    private String title;
    private String description;
    private String genre;
    private double rating;
    private int reviewCount;
    private Date releaseDate;
    private String posterUrl;
    @Field("seasons")
    private List<Season> seasons = new ArrayList<>();
    @DBRef(lazy = true)
    private List<Actor> actors;
    @DBRef(lazy = true)
    private List<Director> directors;
    private String country;
    private String trailerUrl;
    private Status status;

    public Series(String id, String title, String description, String genre, double rating, int reviewCount, Date releaseDate, String posterUrl, List<Season> seasons,
                  String country, String trailerUrl, Status status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
        this.seasons = seasons;
        this.country = country;
        this.trailerUrl = trailerUrl;
        this.status = status;
    }

    public Series(SeriesRequestDTO series) {
        this.id = series.getId();
        this.title = series.getTitle();
        this.description = series.getDescription();
        this.genre = series.getGenre();
        this.rating = series.getRating();
        this.reviewCount = series.getReviewCount();
        this.releaseDate = series.getReleaseDate();
        this.posterUrl = series.getPosterUrl();
        this.country = series.getCountry();
        this.trailerUrl = series.getTrailerUrl();
    }
}


