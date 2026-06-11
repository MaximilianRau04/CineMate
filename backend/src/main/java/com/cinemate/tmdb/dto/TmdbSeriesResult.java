package com.cinemate.tmdb.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TmdbSeriesResult {
    private int tmdbId;
    private String name;
    private String overview;
    private String posterUrl;
    private String firstAirDate;
    private double voteAverage;
}
