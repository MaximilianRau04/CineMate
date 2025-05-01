package com.cinemate.user;

import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.review.Review;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    @Autowired
    public UserService(UserRepository userRepository, MovieRepository movieRepository, SeriesRepository seriesRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
    }

    /**
     * returns the currently logged in user
     * @param authentication
     * @return user
     */
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Nicht eingeloggt");
        }

        // Check what type of client is the principal is
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
        user.setPassword(null);  // password is not returned

        return ResponseEntity.ok(user);
    }

    /**
     * returns all users
     * @return List<User>
     */
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    /**
     * returns the movies in the watchlist of the given user
     * @param userId
     * @return List<Movie>
     */
    public ResponseEntity<List<Movie>> getMovieWatchlist(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        return ResponseEntity.ok(user.getMovieWatchlist());
    }

    /**
     * returns the series  in the watchlist of the given user
     * @param userId
     * @return List<Series>
     */
    public ResponseEntity<List<Series>> getSeriesWatchlist(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        return ResponseEntity.ok(user.getSeriesWatchlist());
    }

    /**
     * creates an user
     * @param user
     * @return User
     */
    public ResponseEntity<User> createUser(User user) {
        return ResponseEntity.ok(userRepository.save(user));
    }

    /**
     * updates an user
     * @param id
     * @param updatedUser
     * @return User
     */
    public ResponseEntity<User> updateUser(String id, User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User existingUser = optionalUser.get();

        if (updatedUser.getUsername() != null) existingUser.setUsername(updatedUser.getUsername());
        if (updatedUser.getPassword() != null) existingUser.setPassword(updatedUser.getPassword());
        if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getBio() != null) existingUser.setBio(updatedUser.getBio());
        if (updatedUser.getAvatarUrl() != null) existingUser.setAvatarUrl(updatedUser.getAvatarUrl());

        return ResponseEntity.ok(userRepository.save(existingUser));
    }

    /**
     * add series with the given id to the watchlist of the given user
     * @param userId
     * @param seriesId
     * @return User
     */
    public ResponseEntity<User> addSeriesToWatchlist(String userId, String seriesId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);

        if (userOptional.isEmpty() || seriesOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Series series = seriesOptional.get();

        user.addSeriesToWatchlist(series);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    /**
     * add movie with the given id to the watchlist of the given user
     * @param userId
     * @param movieId
     * @return User
     */
    public ResponseEntity<User> addMovieToWatchlist(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Movie movie = movieOptional.get();

        user.addMovieToWatchlist(movie);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    /**
     * removes the movie with the given id from the watchlist of the given user
     * @param userId
     * @param movieId
     * @return User
     */
    public ResponseEntity<User> removeMovieFromWatchlist(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Movie movie = movieOptional.get();

        user.removeMovieFromWatchlist(movie);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    /**
     * removes the series with the given id from the watchlist of the given user
     * @param userId
     * @param seriesId
     * @return User
     */
    public ResponseEntity<User> removeSeriesFromWatchlist(String userId, String seriesId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);

        if (userOptional.isEmpty() || seriesOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        Series series = seriesOptional.get();

        user.removeSeriesFromWatchlist(series);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}
