package com.cinemate.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YearlyActivityDTO {
    private String year; // Format: "2024"
    private Integer hours;
    private Integer moviesCount;
    private Integer seriesCount;
}
