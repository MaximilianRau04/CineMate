package com.cinemate.statistics.DTOs.activities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyActivityDTO {
    private String month;
    private Integer hours;
    private Integer moviesCount;
    private Integer seriesCount;
}
