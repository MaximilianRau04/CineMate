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
     * @param userId
     * @return list of recommendations
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
     * @param user
     * @return set of genres
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
     * Extracts preferred actors for the user
     * @param user
     * @return set of actorIds
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
     * Extracts preferred directors for the user
     * @param user
     * @return set of directorIds
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
     * Calculates a content score for a given movie based on preferred genres, actors, and directors.
     *
     * @param movie the movie for which the content score is calculated
     * @param preferredGenres a set of genres preferred by the user
     * @param preferredActors a set of actor IDs preferred by the user
     * @param preferredDirectors a set of director IDs preferred by the user
     * @return the calculated content score as a double value
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
     * Calculates a content score for a series based on the user's preferences for genres,
     * actors, and directors, as well as the series' rating.
     *
     * @param series the Series object containing details about the series, such as genres, actors, directors, and rating
     * @param preferredGenres a set of genres preferred by the user
     * @param preferredActors a set of actor IDs preferred by the user
     * @param preferredDirectors a set of director IDs preferred by the user
     * @return the calculated content score as a double value based on the matching criteria and weights
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
     * Retrieves a set of unique movie IDs associated with the given user.
     * This includes movies from the user's favorite list, watched list, and watchlist.
     *
     * @param user the user whose movie IDs are to be retrieved
     * @return a set of unique movie IDs from the user's favorite, watched, and watchlist movies
     */
    private Set<String> getUserMovieIds(User user) {
        Set<String> movieIds = new HashSet<>();
        user.getMovieFavorites().forEach(movie -> movieIds.add(movie.getId()));
        user.getMoviesWatched().forEach(movie -> movieIds.add(movie.getId()));
        user.getMovieWatchlist().forEach(movie -> movieIds.add(movie.getId()));
        return movieIds;
    }

    /**
     * Retrieves a set of unique series IDs associated with a user by combining
     * their favorite series, watched series, and series in the watchlist.
     *
     * @param user the user whose series IDs are to be retrieved
     * @return a set containing unique series IDs from the user's favorites, watched list, and watchlist
     */
    private Set<String> getUserSeriesIds(User user) {
        Set<String> seriesIds = new HashSet<>();
        user.getSeriesFavorites().forEach(series -> seriesIds.add(series.getId()));
        user.getSeriesWatched().forEach(series -> seriesIds.add(series.getId()));
        user.getSeriesWatchlist().forEach(series -> seriesIds.add(series.getId()));
        return seriesIds;
    }

    /**
     * Generates a reason describing why a specific movie might align with a user's preferences,
     * based on genres, actors, and directors.
     *
     * @param movie The movie for which the reason is being generated. Contains details such as genre, actors, and directors.
     * @param preferredGenres A set of the user's preferred genres to be matched with the movie's genres.
     * @param preferredActors A set of the user's preferred actors to be matched with the movie's actors.
     * @param preferredDirectors A set of the user's preferred directors to be matched with the movie's directors.
     * @return A string describing the reason why the movie corresponds to the user's preferences, or a default message if no matches are found.
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

    /**
     * Generates a reason string explaining why a given series is recommended based on the user's
     * preferred genres, actors, and directors.
     *
     * @param series the series for which the reason is being generated
     * @param preferredGenres the set of genres preferred by the user
     * @param preferredActors the set of actors preferred by the user
     * @param preferredDirectors the set of directors preferred by the user
     * @return a string explaining the reasons for recommending the series based on matches with
     *         the user's preferences
     */
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
     * Fetches a list of trending recommendations, including movies and series,
     * based on a weighted score derived from their ratings and number of reviews.
     * The returned list combines top-rated movies and series, converts them into
     *
     * @return A list of {@link RecommendationResponseDTO} objects representing
     *         trending movies and series.
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
     * Retrieves a list of recommendations based on the specified genre.
     * The recommendations include both movies and series, ranked by their ratings.
     *
     * @param genre the genre used to filter the movies and series recommendations
     * @return a list of {@link RecommendationResponseDTO} containing the recommended movies
     *         and series for the specified genre
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
     * Generates a list of recommendations based on a collaborative filtering approach.
     * Finds users with similar preferences to the provided user and recommends their favorite
     * movies and series that the current user has not yet engaged with.
     *
     * @param userId the unique identifier of the user for whom the recommendations are to be generated
     * @return a list of {@code RecommendationResponseDTO} objects containing recommended movies
     *         and series along with their details and scores; returns an empty list if no similar
     *         users or recommendations are found
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
     * Finds and returns a list of users similar to the given user based on shared interests such as movies and series.
     *
     * @param currentUser the user for whom similar users are being searched
     * @param allUsers the list of all available users to compare against
     * @return a list of up to 5 users who are most similar to the current user, sorted in descending order of similarity
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
     * Calculates the Jaccard similarity between two sets of strings.
     * The Jaccard similarity is defined as the size of the intersection
     * divided by the size of the union of the two sets.
     *
     * @param set1 the first set of strings
     * @param set2 the second set of strings
     * @return the Jaccard similarity as a double value. Returns 0.0 if both sets are empty.
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
     * Generates a hybrid recommendation list by combining content-based and collaborative filtering approaches
     * with specific weightings. Content-based recommendations are given a 70% weighting, while
     * collaborative recommendations are weighted at 30%.
     *
     * @param userId The unique identifier of the user for whom the hybrid recommendations are being generated.
     * @return A list of RecommendationResponseDTO objects representing the hybrid recommendations, sorted
     *         by their scores in descending order and limited to 15 items.
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
     * Provides smart content recommendations for a user based on the time of day.
     * The method leverages different recommendation strategies to suggest content
     * aligning with the user's potential mood or preference for a specific time window.
     *
     * @param userId a unique identifier for the user requesting recommendations
     * @return a list of RecommendationResponseDTO objects containing the smart recommendations for the user
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
     * Provides a list of recommended movies and series based on the user's mood and preferences.
     * The recommendations are filtered by mood-specific genres and exclude content the user has already watched.
     *
     * @param userId The unique identifier of the user for whom recommendations are generated.
     * @param mood The mood of the user, which determines the genre and tone of content to be recommended.
     *             Supported moods include "light", "evening", and "night".
     * @return A list of recommendations containing movies and series tailored to the user's mood,
     *         or an empty list if the user is not found or there are no recommendations available.
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
