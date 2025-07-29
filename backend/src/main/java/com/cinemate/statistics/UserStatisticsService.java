package com.cinemate.statistics;

import com.cinemate.social.friends.Friend;
import com.cinemate.statistics.dto.*;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import com.cinemate.review.Review;
import com.cinemate.review.ReviewRepository;
import com.cinemate.social.friends.FriendRepository;
import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserStatisticsService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final FriendRepository friendRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    /**
     * Calculates and retrieves detailed user statistics based on the given user ID and time period.
     * This includes metrics such as total hours watched, top genres, favorite actors, and recent activity.
     *
     * @param userId the unique identifier of the user whose statistics are to be calculated
     * @param period the time period for which statistics should be calculated (e.g., weekly, monthly, yearly)
     * @return an instance of {@code UserStatisticsDTO} containing the calculated statistics for the specified user and period
     * @throws RuntimeException if the user with the specified ID is not found
     */
    public UserStatisticsDTO calculateUserStatistics(String userId, String period) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime startDate = getStartDateForPeriod(period);
        
        return UserStatisticsDTO.builder()
                .totalHoursWatched(calculateTotalHours(user, startDate))
                .totalMoviesWatched(calculateMoviesWatched(user, startDate))
                .totalSeriesWatched(calculateSeriesWatched(user, startDate))
                .totalEpisodesWatched(calculateEpisodesWatched(user, startDate))
                .averageRating(calculateAverageRating(userId, startDate))
                .topGenres(calculateTopGenres(user, startDate))
                .favoriteActors(calculateFavoriteActors(user, startDate))
                .favoriteDirectors(calculateFavoriteDirectors(user, startDate))
                .monthlyActivity(calculateMonthlyActivity(userId, period))
                .yearlyActivity(calculateYearlyActivity(userId))
                .recentActivity(getRecentActivity(userId))
                .watchingPatterns(calculateWatchingPatterns(userId))
                .build();
    }

    /**
     * Retrieves a list of statistical data about a user's friends.
     *
     * @param userId the ID of the user whose friends' statistics need to be retrieved
     * @return a list of FriendStatisticsDTO objects containing statistical information
     *         about each friend
     */
    public List<FriendStatisticsDTO> getFriendsStatistics(String userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Friend> friendships = friendRepository.findAcceptedFriendshipsByUser(user);
            
            return friendships.stream()
                    .map(friendship -> {
                        User friend = friendship.getRequester().getId().equals(userId) 
                            ? friendship.getRecipient() 
                            : friendship.getRequester();
                        
                        try {
                            return FriendStatisticsDTO.builder()
                                    .userId(friend.getId())
                                    .username(friend.getUsername())
                                    .totalHoursWatched(calculateTotalHours(friend, null))
                                    .totalMoviesWatched(calculateMoviesWatched(friend, null))
                                    .totalSeriesWatched(calculateSeriesWatched(friend, null))
                                    .averageRating(calculateAverageRating(friend.getId(), null))
                                    .build();
                        } catch (Exception e) {
                            System.err.println("Error building FriendStatisticsDTO for friend: " + friend.getUsername() + " - " + e.getMessage());
                            return null;
                        }
                    })
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getFriendsStatistics for userId: " + userId + " - " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get friends statistics", e);
        }
    }

    /**
     * Calculates the start date based on the given period.
     *
     * @param period the period for which the start date is to be determined.
     *               Valid values are "month", "year", and "all".
     * @return the start date as a LocalDateTime for the specified period.
     */
    private LocalDateTime getStartDateForPeriod(String period) {
        LocalDateTime now = LocalDateTime.now();
        switch (period.toLowerCase()) {
            case "month":
                return now.minusMonths(1);
            case "year":
                return now.minusYears(1);
            case "all":
            default:
                return null;
        }
    }

    /**
     * Calculates the total number of hours of movies and series watched by the user
     * starting from the specified date.
     *
     * @param user the user whose watched media will be analyzed
     * @param startDate the date from which to begin the analysis of watched media
     * @return the total number of watched hours as an Integer, aggregated from both movies and series
     */
    private Integer calculateTotalHours(User user, LocalDateTime startDate) {
        List<Movie> watchedMovies = user.getMoviesWatched();
        List<Series> watchedSeries = user.getSeriesWatched();

        // calculate hours for movies
        int movieHours = watchedMovies.stream()
                .mapToInt(movie -> {
                    // try to parse the duration
                    try {
                        String duration = movie.getDuration();
                        if (duration != null && !duration.isEmpty()) {
                            // Remove "min" or other text suffixes and parse the number
                            String numberOnly = duration.replaceAll("[^0-9]", "");
                            return numberOnly.isEmpty() ? 0 : Integer.parseInt(numberOnly);
                        }
                        return 0;
                    } catch (NumberFormatException e) {
                        return 0; // Fallback if parsing fails
                    }
                })
                .sum();

        // calculate hours for series
        int seriesHours = watchedSeries.stream()
                .mapToInt(series -> {
                    // Calculate the total running time of a series based on seasons
                    if (series.getSeasons() != null && !series.getSeasons().isEmpty()) {
                        return series.getSeasons().stream()
                                .mapToInt(season -> {
                                    int episodeCount = season.getEpisodes() != null ? season.getEpisodes().size() : 0;
                                    return episodeCount * 45;
                                })
                                .sum();
                    }
                    return 0;
                })
                .sum();

        return (movieHours + seriesHours) / 60; // convert minutes to hours
    }

    private Integer calculateMoviesWatched(User user, LocalDateTime startDate) {
        return user.getMoviesWatched().size();
    }

    private Integer calculateSeriesWatched(User user, LocalDateTime startDate) {
        return user.getSeriesWatched().size();
    }

    /**
     * Calculates the total number of episodes watched by the user starting from a specified date.
     *
     * @param user the user whose watched episodes are to be calculated
     * @param startDate the start date from which episodes watched are considered
     * @return the total number of episodes watched by the user
     */
    private Integer calculateEpisodesWatched(User user, LocalDateTime startDate) {
        return user.getSeriesWatched().stream()
                .mapToInt(series -> {
                    if (series.getSeasons() != null && !series.getSeasons().isEmpty()) {
                        return series.getSeasons().stream()
                                .mapToInt(season -> season.getEpisodes() != null ? season.getEpisodes().size() : 0)
                                .sum();
                    }
                    return 0;
                })
                .sum();
    }

    /**
     * Calculates the average rating of reviews for a given user. If a start date is provided,
     * only reviews created after the specified start date are considered.
     *
     * @param userId the unique identifier of the user whose reviews should be evaluated
     * @param startDate the date after which reviews are considered; if null, all reviews are included
     * @return the average rating of the user's reviews; returns 0.0 if no reviews are found
     */
    private Double calculateAverageRating(String userId, LocalDateTime startDate) {
        List<Review> reviews = startDate != null
            ? reviewRepository.findByUserIdAndDateAfter(userId, Date.from(startDate.atZone(ZoneId.systemDefault()).toInstant()))
            : reviewRepository.findByUserId(userId);

        return reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
    }

    private List<GenreStatisticsDTO> calculateTopGenres(User user, LocalDateTime startDate) {
        List<Movie> watchedMovies = user.getMoviesWatched();
        List<Series> watchedSeries = user.getSeriesWatched();

        Map<String, GenreStats> genreMap = new HashMap<>();

        // process movies
        watchedMovies.forEach(movie -> {
            if (movie.getGenre() != null && !movie.getGenre().isEmpty()) {
                String genreName = movie.getGenre();
                GenreStats stats = genreMap.getOrDefault(genreName, new GenreStats());
                stats.count++;
                // try to parse the duration
                try {
                    String duration = movie.getDuration();
                    if (duration != null && !duration.isEmpty()) {
                        String numberOnly = duration.replaceAll("[^0-9]", "");
                        int minutes = numberOnly.isEmpty() ? 0 : Integer.parseInt(numberOnly);
                        stats.hours += minutes / 60;
                    }
                } catch (NumberFormatException e) {
                    // Fallback to 0 if parsing fails
                }
                genreMap.put(genreName, stats);
            }
        });

        // process series
        watchedSeries.forEach(series -> {
            if (series.getGenre() != null && !series.getGenre().isEmpty()) {
                String genreName = series.getGenre();
                GenreStats stats = genreMap.getOrDefault(genreName, new GenreStats());
                stats.count++;
                // calculate hours basaed on seasons
                if (series.getSeasons() != null && !series.getSeasons().isEmpty()) {
                    int totalEpisodes = series.getSeasons().stream()
                            .mapToInt(season -> season.getEpisodes() != null ? season.getEpisodes().size() : 0)
                            .sum();
                    stats.hours += (totalEpisodes * 45) / 60;
                }
                genreMap.put(genreName, stats);
            }
        });

        return genreMap.entrySet().stream()
                .map(entry -> GenreStatisticsDTO.builder()
                        .name(entry.getKey())
                        .count(entry.getValue().count)
                        .hours(entry.getValue().hours)
                        .build())
                .sorted((a, b) -> b.getCount().compareTo(a.getCount()))
                .limit(8)
                .collect(Collectors.toList());
    }

    /**
     * Calculates the list of favorite actors based on the movies and series
     * watched by the user within a specific time frame.
     *
     * @param user the user object containing the list of movies and series they have watched
     * @param startDate the start date for filtering the movies and series watched by the user
     * @return a list of ActorStatisticsDTO objects representing the top favorite actors
     *         and their respective counts, sorted in descending order
     */
    private List<ActorStatisticsDTO> calculateFavoriteActors(User user, LocalDateTime startDate) {
        List<Movie> watchedMovies = user.getMoviesWatched();
        List<Series> watchedSeries = user.getSeriesWatched();

        Map<String, Integer> actorCounts = new HashMap<>();

        // process movies
        watchedMovies.forEach(movie -> {
            if (movie.getActors() != null) {
                movie.getActors().forEach(actor -> {
                    actorCounts.merge(actor.getName(), 1, Integer::sum);
                });
            }
        });

        // process series
        watchedSeries.forEach(series -> {
            if (series.getActors() != null) {
                series.getActors().forEach(actor -> {
                    actorCounts.merge(actor.getName(), 1, Integer::sum);
                });
            }
        });

        return actorCounts.entrySet().stream()
                .map(entry -> ActorStatisticsDTO.builder()
                        .name(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .sorted((a, b) -> b.getCount().compareTo(a.getCount()))
                .limit(10)
                .collect(Collectors.toList());
    }

    /**
     * Calculates the list of favorite directors for the given user based on the
     * movies and series they have watched. Only considers data created prior to the specified start date.
     * The result is a sorted list of directors in descending order of their occurrences.
     *
     * @param user the user whose favorite directors are to be calculated
     * @param startDate the timestamp used as a reference to filter data
     * @return a list of DirectorStatisticsDTO objects representing the user's favorite directors
     */
    private List<DirectorStatisticsDTO> calculateFavoriteDirectors(User user, LocalDateTime startDate) {
        List<Movie> watchedMovies = user.getMoviesWatched();
        List<Series> watchedSeries = user.getSeriesWatched();

        Map<String, Integer> directorCounts = new HashMap<>();

        // process movies
        watchedMovies.forEach(movie -> {
            if (movie.getDirectors() != null) {
                movie.getDirectors().forEach(director -> {
                    directorCounts.merge(director.getName(), 1, Integer::sum);
                });
            }
        });

        // process series
        watchedSeries.forEach(series -> {
            if (series.getDirectors() != null) {
                series.getDirectors().forEach(director -> {
                    directorCounts.merge(director.getName(), 1, Integer::sum);
                });
            }
        });

        return directorCounts.entrySet().stream()
                .map(entry -> DirectorStatisticsDTO.builder()
                        .name(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .sorted((a, b) -> b.getCount().compareTo(a.getCount()))
                .limit(10)
                .collect(Collectors.toList());
    }

    /**
     * Calculates the monthly activity data for a user over a specified period of one year.
     * The method generates a list of monthly activity summaries including details like
     * viewing hours, movie count, and series count for each month.
     *
     * @param userId the unique identifier of the user whose activity is to be calculated
     * @param period the period for which the activity is being calculated, given in a specific format
     * @return a list of MonthlyActivityDTO objects representing the activity data for each month in the defined period
     */
    private List<MonthlyActivityDTO> calculateMonthlyActivity(String userId, String period) {
        // TODO, currently only test data
        List<MonthlyActivityDTO> activities = new ArrayList<>();

        for (int i = 11; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusMonths(i);
            String monthKey = date.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            
            activities.add(MonthlyActivityDTO.builder()
                    .month(monthKey)
                    .hours((int) (Math.random() * 30) + 5)
                    .moviesCount((int) (Math.random() * 10) + 1)
                    .seriesCount((int) (Math.random() * 5) + 1)
                    .build());
        }
        
        return activities;
    }

    /**
     * Calculates and retrieves a list of yearly activity data for the specified user.
     * The activity includes details like the number of hours spent, movies watched, and series watched
     * over the past three years.
     *
     * @param userId The unique identifier of the user whose activity data is to be calculated.
     * @return A list of YearlyActivityDTO objects containing yearly activity details for the user.
     */
    private List<YearlyActivityDTO> calculateYearlyActivity(String userId) {
        // TODO, currently only test data
        List<YearlyActivityDTO> activities = new ArrayList<>();

        for (int i = 2; i >= 0; i--) {
            int year = LocalDateTime.now().minusYears(i).getYear();
            
            activities.add(YearlyActivityDTO.builder()
                    .year(String.valueOf(year))
                    .hours((int) (Math.random() * 300) + 100)
                    .moviesCount((int) (Math.random() * 60) + 20)
                    .seriesCount((int) (Math.random() * 20) + 5)
                    .build());
        }
        
        return activities;
    }

    /**
     * Retrieves a list of the most recent activities performed by a user. These activities include
     * reviews of movies or series, sorted by the date of the activity in descending order.
     *
     * @param userId The unique identifier of the user whose recent activities are to be retrieved.
     * @return A list of {@code RecentActivityDTO} objects representing the user's recent activities,
     *         sorted by date in descending order, limited to the most recent 15 activities.
     */
    private List<RecentActivityDTO> getRecentActivity(String userId) {
        List<RecentActivityDTO> activities = new ArrayList<>();

        // recent reviews
        List<Review> recentReviews = reviewRepository
                .findTop10ByUserIdOrderByDateDesc(userId);
        
        recentReviews.forEach(review -> {
            // try to find movie first
            Optional<Movie> movie = movieRepository.findById(review.getItemId());
            if (movie.isPresent()) {
                activities.add(RecentActivityDTO.builder()
                        .type("movie")
                        .title(movie.get().getTitle())
                        .action("Bewertung abgegeben (" + review.getRating() + " Sterne)")
                        .date(LocalDateTime.ofInstant(
                            review.getDate().toInstant(),
                            ZoneId.systemDefault()))
                        .build());
            } else {
                // if there is no movie, try to find series
                Optional<Series> series = seriesRepository.findById(review.getItemId());
                if (series.isPresent()) {
                    activities.add(RecentActivityDTO.builder()
                            .type("series")
                            .title(series.get().getTitle())
                            .action("Bewertung abgegeben (" + review.getRating() + " Sterne)")
                            .date(LocalDateTime.ofInstant(
                                review.getDate().toInstant(),
                                ZoneId.systemDefault()))
                            .build());
                }
            }
        });

        return activities.stream()
                .sorted(Comparator.comparing(RecentActivityDTO::getDate).reversed())
                .limit(15)
                .collect(Collectors.toList());
    }

    /**
     * Analyzes the user's watching behavior based on historical viewing data
     * and calculates patterns, such as the most active day, most active hour,
     * average session length, and preferred genres by time of day.
     *
     * @param userId the unique identifier of the user whose watching patterns are to be calculated
     * @return a WatchingPatternsDTO object containing the calculated watching patterns,
     *         including the most active day, most active hour, average session length,
     *         and a map of preferred genres categorized by time of day
     */
    private WatchingPatternsDTO calculateWatchingPatterns(String userId) {
        // TODO, simple implementation
        return WatchingPatternsDTO.builder()
                .mostActiveDay("Samstag")
                .mostActiveHour(20)
                .averageSessionLength(2.3)
                .preferredGenreByTime(Map.of(
                        "morning", "Comedy",
                        "afternoon", "Drama",
                        "evening", "Action",
                        "night", "Horror"
                ))
                .build();
    }

    private static class GenreStats {
        int count = 0;
        int hours = 0;
    }

    private static class MonthlyStats {
        int hours = 0;
        int moviesCount = 0;
        int seriesCount = 0;
    }

    private static class YearlyStats {
        int hours = 0;
        int moviesCount = 0;
        int seriesCount = 0;
    }
}
