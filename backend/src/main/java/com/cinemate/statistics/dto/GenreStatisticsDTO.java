package com.cinemate.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenreStatisticsDTO {
    private String name;
    private Integer count;
    private Integer hours;
}
