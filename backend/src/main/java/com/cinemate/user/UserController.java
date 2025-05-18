package com.cinemate.user;

import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.movie.Movie;
import com.cinemate.review.DTOs.ReviewResponseDTO;
import com.cinemate.review.Review;
import com.cinemate.review.ReviewService;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.series.Series;
import com.cinemate.user.dtos.UserRequestDTO;
import com.cinemate.user.dtos.UserResponseDTO;
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

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * returns all users
     * @return List<UserResponseDTO>
     */
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * returns the user with the given id
     * @param id
     * @return UserResponseDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * returns the user currently logged in
     * @param authentication
     * @return UserResponseDTO
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication);
    }

    /**
     * returns the list of movies in the watchlist of the user
     * @param id
     * @return List<MovieResponseDTO>
     */
    @GetMapping("/{id}/watchlist/movies")
    public ResponseEntity<List<MovieResponseDTO>> getMovieWatchlist(@PathVariable String id) {
        return userService.getMovieWatchlist(id);
    }

    /**
     * returns the list of movies in the watchlist of the user
     * @param id
     * @return List<SeriesResponseDTO>
     */
    @GetMapping("/{id}/watchlist/series")
    public ResponseEntity<List<SeriesResponseDTO>> getSeriesWatchlist(@PathVariable String id) {
        return userService.getSeriesWatchlist(id);
    }

    /**
     * creates an user
     * @param user
     * @return UserResponseDTO
     */
    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO user) {
        return userService.createUser(user);
    }

    /**
     * updates the user with the given id
     * @param id
     * @param updatedUser
     * @param avatar
     * @return UserResponseDTO
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable String id,
            @RequestPart("user") UserRequestDTO updatedUser,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        return userService.updateUser(id, updatedUser, avatar);
    }

    /**
     * add movie with the given id to the watchlist of the given user
     * @param id
     * @param movieId
     * @return U
     */
    @PutMapping("/{id}/watchlist/movies/{movieId}")
    public ResponseEntity<UserResponseDTO> addMovieToWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.addMovieToWatchlist(id, movieId);
    }

    /**
     * add series with the given id to the watchlist of the given user
     * @param id
     * @param seriesId
     * @return
     */
    @PutMapping("/{id}/watchlist/series/{seriesId}")
    public ResponseEntity<UserResponseDTO> addSeriesToWatchlist(@PathVariable String id, @PathVariable String seriesId) {
        return userService.addSeriesToWatchlist(id, seriesId);
    }

    /**
     * deletes the user with the given id
     * @param id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * removes the movie with the given id from the watchlist of the given user
     * @param id
     * @param movieId
     * @return UserResponseDTO
     */
    @DeleteMapping("/{id}/watchlist/movies/{movieId}")
    public ResponseEntity<UserResponseDTO> removeMovieFromWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.removeMovieFromWatchlist(id, movieId);
    }

    /**
     * removes the series with the given id from the watchlist of the given user
     * @param id
     * @param seriesId
     * @return UserResponseDTO
     */
    @DeleteMapping("/{id}/watchlist/series/{seriesId}")
    public ResponseEntity<UserResponseDTO> removeSeriesFromWatchlist(@PathVariable String id, @PathVariable String seriesId) {
        return userService.removeSeriesFromWatchlist(id, seriesId);
    }

}
