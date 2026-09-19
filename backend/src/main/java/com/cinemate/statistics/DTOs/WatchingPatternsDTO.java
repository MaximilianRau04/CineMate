package com.cinemate.statistics.DTOs;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchingPatternsDTO {
  private String mostActiveDay;
  private Integer mostActiveHour;
  private Double averageSessionLength;
  private Map<String, String> preferredGenreByTime;
}
