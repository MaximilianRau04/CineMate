package com.cinemate.recommendation;

import com.cinemate.actor.Actor;
import com.cinemate.director.Director;
import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import com.cinemate.recommendation.DTOs.RecommendationResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    @Autowired
    public RecommendationService(UserRepository userRepository, 
                               MovieRepository movieRepository, 
                               SeriesRepository seriesRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
    }

    /**
     * Generates personalized recommendations for a user
     * based on Content-Based Filtering
     */
    public List<RecommendationResponseDTO> getRecommendationsForUser(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Collections.emptyList();
        }

        User user = userOptional.get();
        
        // Collect all preferred genres from favorites and watched content
        Set<String> preferredGenres = extractUserPreferredGenres(user);
        
        // Collect preferred actors and directors
        Set<String> preferredActors = extractUserPreferredActors(user);
        Set<String> preferredDirectors = extractUserPreferredDirectors(user);

        List<Movie> allMovies = movieRepository.findAll();
        List<Series> allSeries = seriesRepository.findAll();
        
        // Filter out already watched/favorite content
        Set<String> userMovieIds = getUserMovieIds(user);
        Set<String> userSeriesIds = getUserSeriesIds(user);
        
        List<Movie> candidateMovies = allMovies.stream()
            .filter(movie -> !userMovieIds.contains(movie.getId()))
            .collect(Collectors.toList());
            
        List<Series> candidateSeries = allSeries.stream()
            .filter(series -> !userSeriesIds.contains(series.getId()))
            .collect(Collectors.toList());
        
        // Calculate recommendation scores
        List<RecommendationResponseDTO> recommendations = new ArrayList<>();
        
        // Rate movies
        for (Movie movie : candidateMovies) {
            double score = calculateContentScore(movie, preferredGenres, preferredActors, preferredDirectors);
            if (score > 0.3) { // Minimum threshold
                recommendations.add(new RecommendationResponseDTO(
                    movie.getId(), 
                    movie.getTitle(), 
                    "movie", 
                    score, 
                    generateReasonForMovie(movie, preferredGenres, preferredActors, preferredDirectors),
                    movie.getPosterUrl()
                ));
            }
        }
        
        // Rate series
        for (Series series : candidateSeries) {
            double score = calculateContentScore(series, preferredGenres, preferredActors, preferredDirectors);
            if (score > 0.3) { // Minimum threshold
                recommendations.add(new RecommendationResponseDTO(
                    series.getId(), 
                    series.getTitle(), 
                    "series", 
                    score, 
                    generateReasonForSeries(series, preferredGenres, preferredActors, preferredDirectors),
                    series.getPosterUrl()
                ));
            }
        }
        
        // Sort by score and return top 20
        return recommendations.stream()
            .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
            .limit(20)
            .collect(Collectors.toList());
    }

    /**
     * Extracts preferred genres based on favorites and watched content
     */
    private Set<String> extractUserPreferredGenres(User user) {
        Set<String> genres = new HashSet<>();
        
        // From favorites
        user.getMovieFavorites().forEach(movie -> 
            genres.addAll(Arrays.asList(movie.getGenre().split(",\\s*"))));
        user.getSeriesFavorites().forEach(series -> 
            genres.addAll(Arrays.asList(series.getGenre().split(",\\s*"))));
            
        // From watched content (with lower weight)
        user.getMoviesWatched().forEach(movie -> 
            genres.addAll(Arrays.asList(movie.getGenre().split(",\\s*"))));
        user.getSeriesWatched().forEach(series -> 
            genres.addAll(Arrays.asList(series.getGenre().split(",\\s*"))));
            
        return genres;
    }

    /**
     * Extracts preferred actors
     */
    private Set<String> extractUserPreferredActors(User user) {
        Set<String> actorIds = new HashSet<>();

        user.getMovieFavorites().forEach(movie -> {
            if (movie.getActors() != null) {
                movie.getActors().forEach(actor -> actorIds.add(actor.getId()));
            }
        });

        user.getSeriesFavorites().forEach(series -> {
            if (series.getActors() != null) {
                series.getActors().forEach(actor -> actorIds.add(actor.getId()));
            }
        });
        
        return actorIds;
    }

    /**
     * Extracts preferred directors
     */
    private Set<String> extractUserPreferredDirectors(User user) {
        Set<String> directorIds = new HashSet<>();
        
        user.getMovieFavorites().forEach(movie -> {
            if (movie.getDirectors() != null) {
                movie.getDirectors().forEach(director -> directorIds.add(director.getId()));
            }
        });
        
        user.getSeriesFavorites().forEach(series -> {
            if (series.getDirectors() != null) {
                series.getDirectors().forEach(director -> directorIds.add(director.getId()));
            }
        });
        
        return directorIds;
    }

    /**
     * Calculates the content score for a movie
     */
    private double calculateContentScore(Movie movie, Set<String> preferredGenres, 
                                       Set<String> preferredActors, Set<String> preferredDirectors) {
        double score = 0.0;
        
        // Genre match (40% weight)
        if (movie.getGenre() != null) {
            String[] movieGenres = movie.getGenre().split(",\\s*");
            long genreMatches = Arrays.stream(movieGenres)
                .filter(preferredGenres::contains)
                .count();
            score += (genreMatches / (double) movieGenres.length) * 0.4;
        }

        // Director match (30% weight)
        if (movie.getDirectors() != null) {
            long directorMatches = movie.getDirectors().stream()
                    .filter(director -> preferredDirectors.contains(director.getId()))
                    .count();
            score += (directorMatches / (double) Math.max(movie.getDirectors().size(), 1)) * 0.3;
        }
        
        // Actor match (20% weight)
        if (movie.getActors() != null) {
            long actorMatches = movie.getActors().stream()
                .filter(actor -> preferredActors.contains(actor.getId()))
                .count();
            score += (actorMatches / (double) Math.max(movie.getActors().size(), 1)) * 0.2;
        }
        
        // Rating bonus (10% weight)
        score += (movie.getRating() / 5.0) * 0.1;
        
        return score;
    }

    /**
     * Calculates the content score for a series
     */
    private double calculateContentScore(Series series, Set<String> preferredGenres, 
                                       Set<String> preferredActors, Set<String> preferredDirectors) {
        double score = 0.0;
        
        // Genre match (40% weight)
        if (series.getGenre() != null) {
            String[] seriesGenres = series.getGenre().split(",\\s*");
            long genreMatches = Arrays.stream(seriesGenres)
                .filter(preferredGenres::contains)
                .count();
            score += (genreMatches / (double) seriesGenres.length) * 0.4;
        }

        // Director match (30% weight)
        if (series.getDirectors() != null) {
            long directorMatches = series.getDirectors().stream()
                    .filter(director -> preferredDirectors.contains(director.getId()))
                    .count();
            score += (directorMatches / (double) Math.max(series.getDirectors().size(), 1)) * 0.3;
        }
        
        // Actor match (20% weight)
        if (series.getActors() != null) {
            long actorMatches = series.getActors().stream()
                .filter(actor -> preferredActors.contains(actor.getId()))
                .count();
            score += (actorMatches / (double) Math.max(series.getActors().size(), 1)) * 0.2;
        }
        
        // Rating bonus (10% weight)
        score += (series.getRating() / 10.0) * 0.1;
        
        return score;
    }

    /**
     * returns all favorite and watched movies and movies in the watchlist of the user
     * @param user
     * @return set of movieIds
     */
    private Set<String> getUserMovieIds(User user) {
        Set<String> movieIds = new HashSet<>();
        user.getMovieFavorites().forEach(movie -> movieIds.add(movie.getId()));
        user.getMoviesWatched().forEach(movie -> movieIds.add(movie.getId()));
        user.getMovieWatchlist().forEach(movie -> movieIds.add(movie.getId()));
        return movieIds;
    }

    /**
     * returns all favorite and watched series and series in the watchlist of the user
     * @param user
     * @return set of seriesIds
     */
    private Set<String> getUserSeriesIds(User user) {
        Set<String> seriesIds = new HashSet<>();
        user.getSeriesFavorites().forEach(series -> seriesIds.add(series.getId()));
        user.getSeriesWatched().forEach(series -> seriesIds.add(series.getId()));
        user.getSeriesWatchlist().forEach(series -> seriesIds.add(series.getId()));
        return seriesIds;
    }

    /**
     * generates a reason for the recommended movie
     * @param movie
     * @param preferredGenres
     * @param preferredActors
     * @param preferredDirectors
     * @return
     */
    private String generateReasonForMovie(Movie movie, Set<String> preferredGenres, 
                                         Set<String> preferredActors, Set<String> preferredDirectors) {
        List<String> reasons = new ArrayList<>();

        // check for matching genres
        if (movie.getGenre() != null) {
            String[] movieGenres = movie.getGenre().split(",\\s*");
            List<String> matchingGenres = Arrays.stream(movieGenres)
                .filter(preferredGenres::contains)
                .collect(Collectors.toList());
            if (!matchingGenres.isEmpty()) {
                reasons.add("Du magst " + String.join(", ", matchingGenres));
            }
        }
        // Check for matching actors
        if (movie.getActors() != null && !movie.getActors().isEmpty()) {
            List<String> matchingActors = movie.getActors().stream()
                    .map(Actor::getName)
                    .filter(preferredActors::contains)
                    .collect(Collectors.toList());
            if (!matchingActors.isEmpty()) {
                reasons.add("Du magst " + String.join(", ", matchingActors));
            }
        }

        // Check for matching directors
        if (movie.getDirectors() != null && !movie.getDirectors().isEmpty()) {
            List<String> matchingDirectors = movie.getDirectors().stream()
                    .map(Director::getName)
                    .filter(preferredDirectors::contains)
                    .collect(Collectors.toList());
            if (!matchingDirectors.isEmpty()) {
                reasons.add("Filme von " + String.join(", ", matchingDirectors));
            }
        }
        
        return reasons.isEmpty() ? "Basierend auf deinen Vorlieben" : String.join(" und ", reasons);
    }

    private String generateReasonForSeries(Series series, Set<String> preferredGenres, 
                                          Set<String> preferredActors, Set<String> preferredDirectors) {
        List<String> reasons = new ArrayList<>();

        // check for matching genres
        if (series.getGenre() != null) {
            String[] seriesGenres = series.getGenre().split(",\\s*");
            List<String> matchingGenres = Arrays.stream(seriesGenres)
                .filter(preferredGenres::contains)
                .collect(Collectors.toList());
            if (!matchingGenres.isEmpty()) {
                reasons.add("Du magst " + String.join(", ", matchingGenres));
            }
        }
        // Check for matching actors
        if (series.getActors() != null && !series.getActors().isEmpty()) {
            List<String> matchingActors = series.getActors().stream()
                    .map(Actor::getName)
                    .filter(preferredActors::contains)
                    .collect(Collectors.toList());
            if (!matchingActors.isEmpty()) {
                reasons.add("Du magst " + String.join(", ", matchingActors));
            }
        }

        // Check for matching directors
        if (series.getDirectors() != null && !series.getDirectors().isEmpty()) {
            List<String> matchingDirectors = series.getDirectors().stream()
                    .map(Director::getName)
                    .filter(preferredDirectors::contains)
                    .collect(Collectors.toList());
            if (!matchingDirectors.isEmpty()) {
                reasons.add("Weitere Serien von " + String.join(", ", matchingDirectors));
            }
        }
        
        return reasons.isEmpty() ? "Based on your preferences" : String.join(" and ", reasons);
    }

    /**
     * Returns popular/trending content based on ratings and popularity
     */
    public List<RecommendationResponseDTO> getTrendingRecommendations() {
        List<RecommendationResponseDTO> trending = new ArrayList<>();
        
        // Top-rated movies
        List<Movie> topMovies = movieRepository.findAll().stream()
            .sorted((a, b) -> {
                // Sort by weighted score: Rating * log (Number of Reviews + 1)
                double scoreA = a.getRating() * Math.log(a.getReviewCount() + 1);
                double scoreB = b.getRating() * Math.log(b.getReviewCount() + 1);
                return Double.compare(scoreB, scoreA);
            })
            .limit(10)
            .collect(Collectors.toList());
            
        // Top-rated series
        List<Series> topSeries = seriesRepository.findAll().stream()
            .sorted((a, b) -> {
                double scoreA = a.getRating() * Math.log(a.getReviewCount() + 1);
                double scoreB = b.getRating() * Math.log(b.getReviewCount() + 1);
                return Double.compare(scoreB, scoreA);
            })
            .limit(10)
            .collect(Collectors.toList());
        
        // Convert to DTOs
        topMovies.forEach(movie -> trending.add(new RecommendationResponseDTO(
            movie.getId(), 
            movie.getTitle(), 
            "movie", 
            movie.getRating(),
            "Beliebter Film mit " + movie.getRating() + "/5 ⭐",
            movie.getPosterUrl()
        )));
        
        topSeries.forEach(series -> trending.add(new RecommendationResponseDTO(
            series.getId(), 
            series.getTitle(), 
            "series", 
            series.getRating(),
            "Beliebte Serie mit " + series.getRating() + "/5 ⭐",
            series.getPosterUrl()
        )));
        
        // Mix and sort by score
        return trending.stream()
            .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
            .collect(Collectors.toList());
    }

    /**
     * Returns recommendations based on a specific genre
     */
    public List<RecommendationResponseDTO> getRecommendationsByGenre(String genre) {
        List<RecommendationResponseDTO> recommendations = new ArrayList<>();
        
        // Movies of the genre
        List<Movie> genreMovies = movieRepository.findAll().stream()
            .filter(movie -> movie.getGenre() != null && 
                    Arrays.asList(movie.getGenre().split(",\\s*")).contains(genre))
            .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
            .limit(15)
            .collect(Collectors.toList());
            
        // Series of the genre
        List<Series> genreSeries = seriesRepository.findAll().stream()
            .filter(series -> series.getGenre() != null && 
                    Arrays.asList(series.getGenre().split(",\\s*")).contains(genre))
            .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
            .limit(15)
            .collect(Collectors.toList());
        
        // Convert to DTOs
        genreMovies.forEach(movie -> recommendations.add(new RecommendationResponseDTO(
            movie.getId(), 
            movie.getTitle(), 
            "movie", 
            movie.getRating(),
            "Empfohlen für " + genre + " fans",
            movie.getPosterUrl()
        )));
        
        genreSeries.forEach(series -> recommendations.add(new RecommendationResponseDTO(
            series.getId(), 
            series.getTitle(), 
            "series", 
            series.getRating(),
            "Empfohlen für " + genre + " fans",
            series.getPosterUrl()
        )));
        
        return recommendations.stream()
            .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
            .collect(Collectors.toList());
    }

    /**
     * Collaborative Filtering: Recommendations based on similar users
     * (not yet implemented)
     */
    public List<RecommendationResponseDTO> getCollaborativeRecommendations(String userId) {
        // Here a Collaborative Filtering algorithm could be implemented that finds users with similar preferences and recommends their favorites
        
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Collections.emptyList();
        }
        
        User currentUser = userOptional.get();
        List<User> allUsers = userRepository.findAll();
        
        // Find similar users (simplified Jaccard-Similarity approach)
        List<User> similarUsers = findSimilarUsers(currentUser, allUsers);
        
        // Collect recommendations from similar users
        Set<String> currentUserMovieIds = getUserMovieIds(currentUser);
        Set<String> currentUserSeriesIds = getUserSeriesIds(currentUser);
        
        Map<String, Integer> movieRecommendations = new HashMap<>();
        Map<String, Integer> seriesRecommendations = new HashMap<>();
        
        for (User similarUser : similarUsers) {
            // Movies from similar users
            similarUser.getMovieFavorites().forEach(movie -> {
                if (!currentUserMovieIds.contains(movie.getId())) {
                    movieRecommendations.put(movie.getId(), 
                        movieRecommendations.getOrDefault(movie.getId(), 0) + 1);
                }
            });
            
            // Series from similar users
            similarUser.getSeriesFavorites().forEach(series -> {
                if (!currentUserSeriesIds.contains(series.getId())) {
                    seriesRecommendations.put(series.getId(), 
                        seriesRecommendations.getOrDefault(series.getId(), 0) + 1);
                }
            });
        }
        
        List<RecommendationResponseDTO> recommendations = new ArrayList<>();
        
        // Top recommended movies
        movieRecommendations.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(10)
            .forEach(entry -> {
                movieRepository.findById(entry.getKey()).ifPresent(movie -> {
                    recommendations.add(new RecommendationResponseDTO(
                        movie.getId(),
                        movie.getTitle(),
                        "movie",
                        entry.getValue(),
                        "Von " + entry.getValue() + " ähnlichen Benutzern empfohlen",
                        movie.getPosterUrl()
                    ));
                });
            });
            
        // Top recommended series
        seriesRecommendations.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(10)
            .forEach(entry -> {
                seriesRepository.findById(entry.getKey()).ifPresent(series -> {
                    recommendations.add(new RecommendationResponseDTO(
                        series.getId(),
                        series.getTitle(),
                        "series",
                        entry.getValue(),
                        "Von " + entry.getValue() + " ähnlichen Benutzern empfohlen",
                        series.getPosterUrl()
                    ));
                });
            });
        
        return recommendations.stream()
            .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
            .collect(Collectors.toList());
    }

    /**
     * finds users with similar preferences (Jaccard Similarity)
     */
    private List<User> findSimilarUsers(User currentUser, List<User> allUsers) {
        Map<User, Double> similarities = new HashMap<>();
        
        Set<String> currentUserItems = new HashSet<>();
        currentUserItems.addAll(getUserMovieIds(currentUser));
        currentUserItems.addAll(getUserSeriesIds(currentUser));
        
        for (User otherUser : allUsers) {
            if (otherUser.getId().equals(currentUser.getId())) continue;
            
            Set<String> otherUserItems = new HashSet<>();
            otherUserItems.addAll(getUserMovieIds(otherUser));
            otherUserItems.addAll(getUserSeriesIds(otherUser));
            
            double similarity = calculateJaccardSimilarity(currentUserItems, otherUserItems);
            if (similarity > 0.1) { // Minimum similarity threshold
                similarities.put(otherUser, similarity);
            }
        }
        
        return similarities.entrySet().stream()
            .sorted(Map.Entry.<User, Double>comparingByValue().reversed())
            .limit(5) // Top 5 similar users
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    /**
     * Calculates Jaccard Similarity between two sets
     */
    private double calculateJaccardSimilarity(Set<String> set1, Set<String> set2) {
        if (set1.isEmpty() && set2.isEmpty()) return 0.0;
        
        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);
        
        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);
        
        return (double) intersection.size() / union.size();
    }

    /**
     * returns hybrid recommendations (Content-based and Collaborative Filtering)
     */
    public List<RecommendationResponseDTO> getHybridRecommendations(String userId) {
        List<RecommendationResponseDTO> contentBased = getRecommendationsForUser(userId);
        List<RecommendationResponseDTO> collaborative = getCollaborativeRecommendations(userId);
        
        // Combine both approaches with weighting
        Map<String, RecommendationResponseDTO> hybridMap = new HashMap<>();
        
        // Content-based recommendations (70% weighting)
        contentBased.forEach(rec -> {
            String key = rec.getType() + "_" + rec.getId();
            rec.setScore(rec.getScore() * 0.7);
            rec.setReason("Content-based: " + rec.getReason());
            hybridMap.put(key, rec);
        });
        
        // Collaborative recommendations (30% weighting) 
        collaborative.forEach(rec -> {
            String key = rec.getType() + "_" + rec.getId();
            if (hybridMap.containsKey(key)) {
                // Combine scores when both methods have the same recommendation
                RecommendationResponseDTO existing = hybridMap.get(key);
                existing.setScore(existing.getScore() + (rec.getScore() * 0.3));
                existing.setReason("Hybrid: " + existing.getReason() + " + Community recommendation");
            } else {
                rec.setScore(rec.getScore() * 0.3);
                rec.setReason("Community-based: " + rec.getReason());
                hybridMap.put(key, rec);
            }
        });
        
        return hybridMap.values().stream()
            .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
            .limit(15)
            .collect(Collectors.toList());
    }

    /**
     * smart-recommendations: recommendations based on the time of the day and user behavior
     */
    public List<RecommendationResponseDTO> getSmartRecommendations(String userId) {
        int hour = java.time.LocalTime.now().getHour();
        
        // Different recommendation strategies based on time of day
        if (hour >= 6 && hour < 12) {
            // Morning: Lighter content, comedies, short movies
            return getRecommendationsByMood(userId, "light");
        } else if (hour >= 12 && hour < 18) {
            // Afternoon: Standard recommendations
            return getRecommendationsForUser(userId);
        } else if (hour >= 18 && hour < 22) {
            // Evening: Popular content, series
            return getRecommendationsByMood(userId, "evening");
        } else {
            // Night: Exciting content, thriller, horror
            return getRecommendationsByMood(userId, "night");
        }
    }

    /**
     * Mood-based recommendations
     */
    private List<RecommendationResponseDTO> getRecommendationsByMood(String userId, String mood) {
        List<String> moodGenres;
        String moodDescription;
        
        switch (mood) {
            case "light":
                moodGenres = Arrays.asList("Comedy", "Animation", "Family", "Romance");
                moodDescription = "Perfekt für den Start in den Tag";
                break;
            case "evening":
                moodGenres = Arrays.asList("Drama", "Action", "Adventure", "Crime");
                moodDescription = "Ideal für den Feierabend";
                break;
            case "night":
                moodGenres = Arrays.asList("Thriller", "Horror", "Mystery", "Science Fiction");
                moodDescription = "Spannend für späte Stunden";
                break;
            default:
                return getRecommendationsForUser(userId);
        }
        
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Collections.emptyList();
        }
        
        User user = userOptional.get();
        Set<String> userMovieIds = getUserMovieIds(user);
        Set<String> userSeriesIds = getUserSeriesIds(user);
        
        List<RecommendationResponseDTO> recommendations = new ArrayList<>();
        
        // Movies for the mood
        List<Movie> moodMovies = movieRepository.findAll().stream()
            .filter(movie -> !userMovieIds.contains(movie.getId()))
            .filter(movie -> movie.getGenre() != null && 
                    moodGenres.stream().anyMatch(genre -> 
                        Arrays.asList(movie.getGenre().split(",\\s*")).contains(genre)))
            .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
            .limit(10)
            .collect(Collectors.toList());
            
        // Series for the mood
        List<Series> moodSeries = seriesRepository.findAll().stream()
            .filter(series -> !userSeriesIds.contains(series.getId()))
            .filter(series -> series.getGenre() != null && 
                    moodGenres.stream().anyMatch(genre -> 
                        Arrays.asList(series.getGenre().split(",\\s*")).contains(genre)))
            .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
            .limit(10)
            .collect(Collectors.toList());
        
        moodMovies.forEach(movie -> recommendations.add(new RecommendationResponseDTO(
            movie.getId(),
            movie.getTitle(),
            "movie",
            movie.getRating(),
            moodDescription,
            movie.getPosterUrl()
        )));
        
        moodSeries.forEach(series -> recommendations.add(new RecommendationResponseDTO(
            series.getId(),
            series.getTitle(),
            "series",
            series.getRating(),
            moodDescription,
            series.getPosterUrl()
        )));
        
        return recommendations.stream()
            .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
            .collect(Collectors.toList());
    }
}
