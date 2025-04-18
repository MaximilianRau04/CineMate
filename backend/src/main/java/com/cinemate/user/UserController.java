package com.cinemate.user;

import com.cinemate.movies.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication);
    }

    @GetMapping("/{id}/watchlist")
    public ResponseEntity<List<Movie>> getWatchlist(@PathVariable String id) {
        return userService.getWatchlist(id);
    }

    @PutMapping("/{id}/watchlist/{movieId}")
    public ResponseEntity<User> addMovieToWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.addMovieToWatchlist(id, movieId);
    }

    @DeleteMapping("/{id}/watchlist/{movieId}")
    public ResponseEntity<User> removeMovieFromWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.removeMovieFromWatchlist(id, movieId);
    }

}
