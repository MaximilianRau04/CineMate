package com.cinemate.user;

import com.cinemate.exceptions.AlreadyInWatchlistException;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import com.cinemate.user.dtos.UserRequestDTO;
import com.cinemate.user.dtos.UserResponseDTO;
import com.cinemate.notification.events.UserActivityEvent;
import com.cinemate.recommendation.utils.RecommendationTriggerUtil;
import com.cinemate.social.points.PointsEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final RecommendationTriggerUtil recommendationTrigger;
    private final PointsEventListener pointsEventListener;

    @Autowired
    public UserService(UserRepository userRepository, MovieRepository movieRepository,
                       SeriesRepository seriesRepository, ApplicationEventPublisher eventPublisher,
                       RecommendationTriggerUtil recommendationTrigger, PointsEventListener pointsEventListener) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
        this.eventPublisher = eventPublisher;
        this.recommendationTrigger = recommendationTrigger;
        this.pointsEventListener = pointsEventListener;
    }

    /**
     * returns the currently logged in user
     * @param authentication
     * @return userResponseDTO
     */
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Nicht eingeloggt");
        }

        Object principal = authentication.getPrincipal();
        String username;

        if (principal instanceof String) {
            username = (String) principal;
        } else if (principal instanceof User) {
            username = ((User) principal).getUsername();
        } else {
            return ResponseEntity.status(500).body("Unerwarteter Authentication-Typ");
        }

        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body("User nicht gefunden");
        }

        User user = optionalUser.get();
        UserResponseDTO userResponseDTO = new UserResponseDTO(user);

        return ResponseEntity.ok(userResponseDTO);
    }

    /**
     * returns all users
     * @return List<UserResponseDTO>
     */
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> userResponseDTOs = userRepository.findAll().stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userResponseDTOs);
    }

    /**
     * returns the user with the given id
     * @param id
     * @return Optional<UserResponseDTO>
     */
    public Optional<UserResponseDTO> getUserById(String id) {
        return userRepository.findById(id).map(UserResponseDTO::new);
    }

    /**
     * returns the movies in the watchlist of the given user
     * @param userId
     * @return List<Movie>
     */
    public ResponseEntity<List<MovieResponseDTO>> getMovieWatchlist(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        List<MovieResponseDTO> movieDTOs = user.getMovieWatchlist().stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(movieDTOs);
    }

    /**
     * returns the series in the watchlist of the given user
     * @param userId
     * @return List<Series>
     */
    public ResponseEntity<List<SeriesResponseDTO>> getSeriesWatchlist(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        List<SeriesResponseDTO> seriesDTOs = user.getSeriesWatchlist().stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(seriesDTOs);
    }

    /**
     * creates an user
     * @param userRequestDTO
     * @return UserResponseDTO
     */
    public ResponseEntity<UserResponseDTO> createUser(UserRequestDTO userRequestDTO) {
        User user = new User(userRequestDTO);
        User savedUser = userRepository.save(user);
        UserResponseDTO userResponseDTO = new UserResponseDTO(savedUser);

        return ResponseEntity.ok(userResponseDTO);
    }


    /**
     * updates an user
     * @param id
     * @param userRequestDTO
     * @param avatar
     * @return UserResponseDTO
     */
    public ResponseEntity<UserResponseDTO> updateUser(String id, UserRequestDTO userRequestDTO, MultipartFile avatar) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = optionalUser.get();

        if (userRequestDTO.getUsername() != null) existingUser.setUsername(userRequestDTO.getUsername());
        if (userRequestDTO.getPassword() != null) existingUser.setPassword(userRequestDTO.getPassword());
        if (userRequestDTO.getEmail() != null) existingUser.setEmail(userRequestDTO.getEmail());
        if (userRequestDTO.getBio() != null) existingUser.setBio(userRequestDTO.getBio());
        if (userRequestDTO.getRole() != null) existingUser.setRole(userRequestDTO.getRole());

        if (userRequestDTO.isRemoveAvatar()) {
            if (existingUser.getAvatarUrl() != null) {
                Path oldAvatarPath = Paths.get(existingUser.getAvatarUrl().substring(1));
                try {
                    Files.deleteIfExists(oldAvatarPath);
                } catch (IOException e) {
                    System.out.println("Fehler beim Löschen des alten Avatars: " + e.getMessage());
                }
            }
            existingUser.setAvatarUrl(null);
        } else if (avatar != null && !avatar.isEmpty()) {
            try {
                String filename = UUID.randomUUID() + "_" + avatar.getOriginalFilename();
                Path path = Paths.get("uploads").resolve(filename);
                Files.createDirectories(path.getParent());
                Files.copy(avatar.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                existingUser.setAvatarUrl("/uploads/" + filename);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        User updatedUser = userRepository.save(existingUser);
        UserResponseDTO userResponseDTO = new UserResponseDTO(updatedUser);

        return ResponseEntity.ok(userResponseDTO);
    }

    /**
     * deletes the user with the given id
     * @param id
     */
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    /**
     * add movie with the given id to the watchlist of the given user
     * @param userId
     * @param movieId
     * @return List<MovieResponseDTO>
     */
    public ResponseEntity<List<MovieResponseDTO>> addMovieToWatchlist(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Movie movie = movieOptional.get();

        if (user.getMovieWatchlist().contains(movie)) {
            throw new AlreadyInWatchlistException(
                    String.format("Film mit ID '%s' ist bereits in der Watchlist von Benutzer '%s'.", movieId, userId));
        }

        user.addMovieToWatchlist(movie);
        User savedUser = userRepository.save(user);

        eventPublisher.publishEvent(new UserActivityEvent(this, userId, UserActivityEvent.ActivityType.WATCHLIST_ITEM_ADDED, movieId));

        recommendationTrigger.triggerOnWatchlistUpdate(userId, movieId, "movie");

        List<MovieResponseDTO> movieDTOs = savedUser.getMovieWatchlist().stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(movieDTOs);
    }

    /**
     * add series with the given id to the watchlist of the given user
     * @param userId
     * @param seriesId
     * @return List<SeriesResponseDTO>
     */
    public ResponseEntity<List<SeriesResponseDTO>> addSeriesToWatchlist(String userId, String seriesId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);

        if (userOptional.isEmpty() || seriesOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Series series = seriesOptional.get();

        if (user.getSeriesWatchlist().contains(series)) {
            throw new AlreadyInWatchlistException(
                    String.format("Serie mit ID '%s' ist bereits in der Watchlist von Benutzer '%s'.", seriesId, userId));
        }

        user.addSeriesToWatchlist(series);
        User savedUser = userRepository.save(user);

        eventPublisher.publishEvent(new UserActivityEvent(this, userId, UserActivityEvent.ActivityType.WATCHLIST_ITEM_ADDED, seriesId));

        recommendationTrigger.triggerOnWatchlistUpdate(userId, seriesId, "series");

        List<SeriesResponseDTO> seriesDTOs = savedUser.getSeriesWatchlist().stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(seriesDTOs);
    }

    /**
     * removes the movie with the given id from the watchlist of the given user
     * @param userId
     * @param movieId
     */
    public void removeMovieFromWatchlist(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isPresent() && movieOptional.isPresent()) {
            User user = userOptional.get();
            Movie movie = movieOptional.get();

            user.removeMovieFromWatchlist(movie);
            userRepository.save(user);
        }
    }

    /**
     * removes the series with the given id from the watchlist of the given user
     * @param userId
     * @param seriesId
     */
    public void removeSeriesFromWatchlist(String userId, String seriesId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);

        if (userOptional.isPresent() && seriesOptional.isPresent()) {
            User user = userOptional.get();
            Series series = seriesOptional.get();

            user.removeSeriesFromWatchlist(series);
            userRepository.save(user);
        }
    }

    /**
     * returns the favorite movies of the given user
     * @param userId
     * @return List<MovieResponseDTO>
     */
    public ResponseEntity<List<MovieResponseDTO>> getMovieFavorites(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        List<MovieResponseDTO> movieDTOs = user.getMovieFavorites().stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(movieDTOs);
    }

    /**
     * returns the favorite series of the given user
     * @param userId
     * @return List<SeriesResponseDTO>
     */
    public ResponseEntity<List<SeriesResponseDTO>> getSeriesFavorites(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        List<SeriesResponseDTO> seriesDTOs = user.getSeriesFavorites().stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(seriesDTOs);
    }

    /**
     * add movie with the given id to the favorites of the given user
     * @param userId
     * @param movieId
     * @return List<MovieResponseDTO>
     */
    public ResponseEntity<List<MovieResponseDTO>> addMovieToFavorites(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Movie movie = movieOptional.get();

        if (user.getMovieFavorites().contains(movie)) {
            throw new AlreadyInWatchlistException(
                    String.format("Film mit ID '%s' ist bereits in den Favoriten von Benutzer '%s'.", movieId, userId));
        }

        user.addMovieToFavorites(movie);
        User savedUser = userRepository.save(user);

        recommendationTrigger.triggerOnNewFavorite(userId, movieId, "movie");

        List<MovieResponseDTO> movieDTOs = savedUser.getMovieFavorites().stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(movieDTOs);
    }

    /**
     * add series with the given id to the favorites of the given user
     * @param userId
     * @param seriesId
     * @return List<SeriesResponseDTO>
     */
    public ResponseEntity<List<SeriesResponseDTO>> addSeriesToFavorites(String userId, String seriesId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);

        if (userOptional.isEmpty() || seriesOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Series series = seriesOptional.get();

        if (user.getSeriesFavorites().contains(series)) {
            throw new AlreadyInWatchlistException(
                    String.format("Serie mit ID '%s' ist bereits in den Favoriten von Benutzer '%s'.", seriesId, userId));
        }

        user.addSeriesToFavorites(series);
        User savedUser = userRepository.save(user);

        recommendationTrigger.triggerOnNewFavorite(userId, seriesId, "series");

        List<SeriesResponseDTO> seriesDTOs = savedUser.getSeriesFavorites().stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(seriesDTOs);
    }

    /**
     * removes the movie with the given id from the favorites of the given user
     * @param userId
     * @param movieId
     */
    public void removeMovieFromFavorites(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isPresent() && movieOptional.isPresent()) {
            User user = userOptional.get();
            Movie movie = movieOptional.get();

            user.removeMovieFromFavorites(movie);
            userRepository.save(user);
        }
    }

    /**
     * removes the series with the given id from the favorites of the given user
     * @param userId
     * @param seriesId
     */
    public void removeSeriesFromFavorites(String userId, String seriesId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);

        if (userOptional.isPresent() && seriesOptional.isPresent()) {
            User user = userOptional.get();
            Series series = seriesOptional.get();

            user.removeSeriesFromFavorites(series);
            userRepository.save(user);
        }
    }

    /**
     * returns the watched movies of the given user
     * @param userId
     * @return List<MovieResponseDTO>
     */
    public ResponseEntity<List<MovieResponseDTO>> getMoviesWatched(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        List<MovieResponseDTO> movieDTOs = user.getMoviesWatched().stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(movieDTOs);
    }

    /**
     * returns the watched series of the given user
     * @param userId
     * @return List<SeriesResponseDTO>
     */
    public ResponseEntity<List<SeriesResponseDTO>> getSeriesWatched(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        List<SeriesResponseDTO> seriesDTOs = user.getSeriesWatched().stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(seriesDTOs);
    }

    /**
     * add movie with the given id to the watched list of the given user
     * @param userId
     * @param movieId
     * @return List<MovieResponseDTO>
     */
    public ResponseEntity<List<MovieResponseDTO>> addMovieToWatched(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Movie movie = movieOptional.get();

        if (user.getMoviesWatched().contains(movie)) {
            throw new AlreadyInWatchlistException(
                    String.format("Film mit ID '%s' ist bereits in der Watched-Liste von Benutzer '%s'.", movieId, userId));
        }

        user.addMovieToWatched(movie);
        User savedUser = userRepository.save(user);

        // Award points for watching a movie
        pointsEventListener.onContentWatched(userId);

        eventPublisher.publishEvent(new UserActivityEvent(this, userId, UserActivityEvent.ActivityType.MOVIE_WATCHED, movieId));

        recommendationTrigger.triggerOnWatched(userId, movieId, "movie");

        List<MovieResponseDTO> movieDTOs = savedUser.getMoviesWatched().stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(movieDTOs);
    }

    /**
     * add series with the given id to the watched list of the given user
     * @param userId
     * @param seriesId
     * @return List<SeriesResponseDTO>
     */
    public ResponseEntity<List<SeriesResponseDTO>> addSeriesToWatched(String userId, String seriesId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);

        if (userOptional.isEmpty() || seriesOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Series series = seriesOptional.get();

        if (user.getSeriesWatched().contains(series)) {
            throw new AlreadyInWatchlistException(
                    String.format("Serie mit ID '%s' ist bereits in der Watched-Liste von Benutzer '%s'.", seriesId, userId));
        }

        user.addSeriesToWatched(series);
        User savedUser = userRepository.save(user);

        // Award points for watching a series
        pointsEventListener.onContentWatched(userId);

        eventPublisher.publishEvent(new UserActivityEvent(this, userId, UserActivityEvent.ActivityType.SERIES_WATCHED, seriesId));

        recommendationTrigger.triggerOnWatched(userId, seriesId, "series");

        List<SeriesResponseDTO> seriesDTOs = savedUser.getSeriesWatched().stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(seriesDTOs);
    }

    /**
     * removes the movie with the given id from the watched list of the given user
     * @param userId
     * @param movieId
     */
    public void removeMovieFromWatched(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isPresent() && movieOptional.isPresent()) {
            User user = userOptional.get();
            Movie movie = movieOptional.get();

            user.removeMovieFromWatched(movie);
            userRepository.save(user);
        }
    }

    /**
     * removes the series with the given id from the watched list of the given user
     * @param userId
     * @param seriesId
     */
    public void removeSeriesFromWatched(String userId, String seriesId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);

        if (userOptional.isPresent() && seriesOptional.isPresent()) {
            User user = userOptional.get();
            Series series = seriesOptional.get();

            user.removeSeriesFromWatched(series);
            userRepository.save(user);
        }
    }
}