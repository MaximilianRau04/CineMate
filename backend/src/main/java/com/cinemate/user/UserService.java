package com.cinemate.user;

import com.cinemate.movies.Movie;
import com.cinemate.movies.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final MovieRepository movieRepository;

    @Autowired
    public UserService(UserRepository userRepository, MovieRepository movieRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    /**
     *
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

    /**
     * returns the movies in the watchlist of the given user
     * @param userId
     * @return List<Movie>
     */
    public ResponseEntity<List<Movie>> getWatchlist(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        return ResponseEntity.ok(user.getWatchlist());
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

    /**
     * deletes the movie with the given id from the watchlist of the given user
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
}
