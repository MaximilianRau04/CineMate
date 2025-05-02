package com.cinemate.user;

import com.cinemate.movie.Movie;
import com.cinemate.review.DTOs.ReviewResponseDTO;
import com.cinemate.review.Review;
import com.cinemate.review.ReviewService;
import com.cinemate.series.Series;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ReviewService reviewService;

    @Autowired
    public UserController(UserService userService, ReviewService reviewService) {
        this.userService = userService;
        this.reviewService = reviewService;
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
    @GetMapping("/{id}/watchlist/movies")
    public ResponseEntity<List<Movie>> getMovieWatchlist(@PathVariable String id) {
        return userService.getMovieWatchlist(id);
    }

    @GetMapping("/{id}/watchlist/series")
    public ResponseEntity<List<Series>> getSeriesWatchlist(@PathVariable String id) {
        return userService.getSeriesWatchlist(id);
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> updateUser(
            @PathVariable String id,
            @RequestPart("user") User updatedUser,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        return userService.updateUser(id, updatedUser, avatar);
    }

    /**
     * add movie with the given id to the watchlist of the given user
     * @param id
     * @param movieId
     * @return User
     */
    @PutMapping("/{id}/watchlist/movies/{movieId}")
    public ResponseEntity<User> addMovieToWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.addMovieToWatchlist(id, movieId);
    }

    /**
     * add series with the given id to the watchlist of the given user
     * @param id
     * @param seriesId
     * @return User
     */
    @PutMapping("/{id}/watchlist/series/{seriesId}")
    public ResponseEntity<User> addSeriesToWatchlist(@PathVariable String id, @PathVariable String seriesId) {
        return userService.addSeriesToWatchlist(id, seriesId);
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
    @DeleteMapping("/{id}/watchlist/movies/{movieId}")
    public ResponseEntity<User> removeMovieFromWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.removeMovieFromWatchlist(id, movieId);
    }

    @DeleteMapping("/{id}/watchlist/series/{seriesId}")
    public ResponseEntity<User> removeSeriesFromWatchlist(@PathVariable String id, @PathVariable String seriesId) {
        return userService.removeSeriesFromWatchlist(id, seriesId);
    }

}
