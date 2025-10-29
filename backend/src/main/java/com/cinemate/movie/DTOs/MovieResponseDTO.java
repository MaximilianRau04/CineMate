package com.cinemate.movie.DTOs;

import com.cinemate.movie.Movie;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponseDTO {

    private String id;
    private String title;
    private String description;
    private String genre;
    private double rating ;
    private int reviewCount;
    private Date releaseDate;
    private String duration;
    private String posterUrl;
    private String country;
    private String trailerUrl;

    public MovieResponseDTO(Movie movie) {
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
