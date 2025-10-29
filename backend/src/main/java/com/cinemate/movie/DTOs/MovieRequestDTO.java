package com.cinemate.movie.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequestDTO {

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
    private String country;
    private String trailerUrl;

}
