package com.cinemate.statistics.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendStatisticsDTO {
    private String userId;
    private String username;
    private Integer totalHoursWatched;
    private Integer totalMoviesWatched;
    private Integer totalSeriesWatched;
    private Double averageRating;
}
