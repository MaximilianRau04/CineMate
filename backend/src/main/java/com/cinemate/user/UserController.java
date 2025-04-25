package com.cinemate.user;

import com.cinemate.movie.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * return all users
     * @return List<User>
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * returns the user currently logged in
     * @param authentication
     * @return User
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication);
    }

    /**
     * returns the list of movies in the watchlist of the user
     * @param id
     * @return List<Movie>
     */
    @GetMapping("/{id}/watchlist")
    public ResponseEntity<List<Movie>> getWatchlist(@PathVariable String id) {
        return userService.getWatchlist(id);
    }

    /**
     * creates an user
     * @param user
     * @return
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    /**
     * add movie with the given id to the watchlist of the given user
     * @param id
     * @param movieId
     * @return User
     */
    @PutMapping("/{id}/watchlist/{movieId}")
    public ResponseEntity<User> addMovieToWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.addMovieToWatchlist(id, movieId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * deletes the movie with the given id from the watchlist of the given user
     * @param id
     * @param movieId
     * @return User
     */
    @DeleteMapping("/{id}/watchlist/{movieId}")
    public ResponseEntity<User> removeMovieFromWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.removeMovieFromWatchlist(id, movieId);
    }

}
