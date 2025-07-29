package com.cinemate.statistics.dto;

import com.cinemate.statistics.dto.activities.MonthlyActivityDTO;
import com.cinemate.statistics.dto.activities.RecentActivityDTO;
import com.cinemate.statistics.dto.activities.YearlyActivityDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatisticsDTO {
    private Integer totalHoursWatched;
    private Integer totalMoviesWatched;
    private Integer totalSeriesWatched;
    private Integer totalEpisodesWatched;
    private Double averageRating;
    
    private List<GenreStatisticsDTO> topGenres;
    private List<ActorStatisticsDTO> favoriteActors;
    private List<DirectorStatisticsDTO> favoriteDirectors;
    private List<MonthlyActivityDTO> monthlyActivity;
    private List<YearlyActivityDTO> yearlyActivity;
    private List<RecentActivityDTO> recentActivity;
    private WatchingPatternsDTO watchingPatterns;
}
