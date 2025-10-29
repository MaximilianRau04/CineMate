package com.cinemate.series.DTOs;

import com.cinemate.series.Series;
import com.cinemate.series.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeriesResponseDTO {
    private String id;
    private String title;
    private String description;
    private String genre;
    private double rating;
    private int reviewCount;
    private Date releaseDate;
    private String posterUrl;
    private String country;
    private String trailerUrl;
    private Status status;

    public SeriesResponseDTO(Series series) {
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
        this.status = series.getStatus();
    }
}
