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

    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Nicht eingeloggt");
        }

        // Überprüfen, welcher Typ der Principal ist
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
        user.setPassword(null);  // Passwort nicht zurückgeben

        return ResponseEntity.ok(user);
    }

    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();

        users.forEach(user -> user.setPassword(null));

        return ResponseEntity.ok(users);
    }

    public ResponseEntity<List<Movie>> getWatchlist(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();  // Wenn der Nutzer nicht gefunden wird
        }

        User user = userOptional.get();
        return ResponseEntity.ok(user.getWatchlist());  // Gibt die Watchlist des Nutzers zurück
    }

    // Methode zum Hinzufügen eines Films zur Watchlist eines Nutzers
    public ResponseEntity<User> addMovieToWatchlist(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();  // Wenn der Nutzer oder Film nicht gefunden wird
        }

        User user = userOptional.get();
        Movie movie = movieOptional.get();

        // Füge den Film zur Watchlist hinzu
        user.addMovieToWatchlist(movie);
        userRepository.save(user);  // Speichere den Nutzer

        return ResponseEntity.ok(user);  // Erfolgreiches Hinzufügen
    }

    // Methode zum Entfernen eines Films aus der Watchlist eines Nutzers
    public ResponseEntity<User> removeMovieFromWatchlist(String userId, String movieId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (userOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();  // Wenn der Nutzer oder Film nicht gefunden wird
        }

        User user = userOptional.get();
        Movie movie = movieOptional.get();

        // Entferne den Film aus der Watchlist, wenn er vorhanden ist
        user.removeMovieFromWatchlist(movie);
        userRepository.save(user);  // Speichere den geänderten Nutzer

        return ResponseEntity.ok(user);  // Erfolgreiches Entfernen
    }
}
