package com.cinemate.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

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
