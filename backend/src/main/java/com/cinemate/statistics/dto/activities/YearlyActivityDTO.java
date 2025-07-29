package com.cinemate.statistics.dto.activities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YearlyActivityDTO {
    private String year;
    private Integer hours;
    private Integer moviesCount;
    private Integer seriesCount;
}
