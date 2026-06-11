package com.cinemate.tmdb.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TmdbMovieResult {
    private int tmdbId;
    private String title;
    private String overview;
    private String posterUrl;
    private String releaseDate;
    private double voteAverage;
}
