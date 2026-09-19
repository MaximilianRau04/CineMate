package com.cinemate.movie.DTOs;

import jakarta.validation.constraints.NotNull;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieRequestDTO {

  private String id;
  private Integer tmdbId;
  @NotNull private String title;
  private String description;
  private String genre;
  private double rating;
  private int reviewCount;
  private Date releaseDate;
  private String duration;
  private String posterUrl;
  private String country;
  private String trailerUrl;
}
