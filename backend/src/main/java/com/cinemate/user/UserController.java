package com.cinemate.user;

import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.user.dtos.UserRequestDTO;
import com.cinemate.user.dtos.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
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
     * deletes the user with the given id
     * @param id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * add movie with the given id to the watchlist of the given user
     * @param id
     * @param movieId
     * @return List<MovieResponseDTO>
     */
    @PutMapping("/{id}/watchlist/movies/{movieId}")
    public ResponseEntity<List<MovieResponseDTO>> addMovieToWatchlist(@PathVariable String id, @PathVariable String movieId) {
        return userService.addMovieToWatchlist(id, movieId);
    }

    /**
     * add series with the given id to the watchlist of the given user
     * @param id
     * @param seriesId
     * @return List<SeriesResponseDTO>
     */
    @PutMapping("/{id}/watchlist/series/{seriesId}")
    public ResponseEntity<List<SeriesResponseDTO>> addSeriesToWatchlist(@PathVariable String id, @PathVariable String seriesId) {
        return userService.addSeriesToWatchlist(id, seriesId);
    }

    /**
     * removes the movie with the given id from the watchlist of the given user
     * @param id
     * @param movieId
     */
    @DeleteMapping("/{id}/watchlist/movies/{movieId}")
    public ResponseEntity<Void> removeMovieFromWatchlist(@PathVariable String id, @PathVariable String movieId) {
        userService.removeMovieFromWatchlist(id, movieId);
        return ResponseEntity.noContent().build();
    }

    /**
     * removes the series with the given id from the watchlist of the given user
     * @param id
     * @param seriesId
     */
    @DeleteMapping("/{id}/watchlist/series/{seriesId}")
    public ResponseEntity<Void> removeSeriesFromWatchlist(@PathVariable String id, @PathVariable String seriesId) {
        userService.removeSeriesFromWatchlist(id, seriesId);
        return ResponseEntity.noContent().build();
    }

    /**
     * returns the list of favorite movies of the user
     * @param id
     * @return List<MovieResponseDTO>
     */
    @GetMapping("/{id}/favorites/movies")
    public ResponseEntity<List<MovieResponseDTO>> getMovieFavorites(@PathVariable String id) {
        return userService.getMovieFavorites(id);
    }

    /**
     * returns the list of favorite series of the user
     * @param id
     * @return List<SeriesResponseDTO>
     */
    @GetMapping("/{id}/favorites/series")
    public ResponseEntity<List<SeriesResponseDTO>> getSeriesFavorites(@PathVariable String id) {
        return userService.getSeriesFavorites(id);
    }

    /**
     * add movie with the given id to the favorites of the given user
     * @param id
     * @param movieId
     * @return List<MovieResponseDTO>
     */
    @PutMapping("/{id}/favorites/movies/{movieId}")
    public ResponseEntity<List<MovieResponseDTO>> addMovieToFavorites(@PathVariable String id, @PathVariable String movieId) {
        return userService.addMovieToFavorites(id, movieId);
    }

    /**
     * add series with the given id to the favorites of the given user
     * @param id
     * @param seriesId
     * @return List<SeriesResponseDTO>
     */
    @PutMapping("/{id}/favorites/series/{seriesId}")
    public ResponseEntity<List<SeriesResponseDTO>> addSeriesToFavorites(@PathVariable String id, @PathVariable String seriesId) {
        return userService.addSeriesToFavorites(id, seriesId);
    }

    /**
     * removes the movie with the given id from the favorites of the given user
     * @param id
     * @param movieId
     */
    @DeleteMapping("/{id}/favorites/movies/{movieId}")
    public ResponseEntity<Void> removeMovieFromFavorites(@PathVariable String id, @PathVariable String movieId) {
        userService.removeMovieFromFavorites(id, movieId);
        return ResponseEntity.noContent().build();
    }

    /**
     * removes the series with the given id from the favorites of the given user
     * @param id
     * @param seriesId
     */
    @DeleteMapping("/{id}/favorites/series/{seriesId}")
    public ResponseEntity<Void> removeSeriesFromFavorites(@PathVariable String id, @PathVariable String seriesId) {
        userService.removeSeriesFromFavorites(id, seriesId);
        return ResponseEntity.noContent().build();
    }

// ===== WATCHED ENDPOINTS =====

    /**
     * returns the list of watched movies of the user
     * @param id
     * @return List<MovieResponseDTO>
     */
    @GetMapping("/{id}/watched/movies")
    public ResponseEntity<List<MovieResponseDTO>> getMoviesWatched(@PathVariable String id) {
        return userService.getMoviesWatched(id);
    }

    /**
     * returns the list of watched series of the user
     * @param id
     * @return List<SeriesResponseDTO>
     */
    @GetMapping("/{id}/watched/series")
    public ResponseEntity<List<SeriesResponseDTO>> getSeriesWatched(@PathVariable String id) {
        return userService.getSeriesWatched(id);
    }

    /**
     * add movie with the given id to the watched list of the given user
     * @param id
     * @param movieId
     * @return List<MovieResponseDTO>
     */
    @PutMapping("/{id}/watched/movies/{movieId}")
    public ResponseEntity<List<MovieResponseDTO>> addMovieToWatched(@PathVariable String id, @PathVariable String movieId) {
        return userService.addMovieToWatched(id, movieId);
    }

    /**
     * add series with the given id to the watched list of the given user
     * @param id
     * @param seriesId
     * @return List<SeriesResponseDTO>
     */
    @PutMapping("/{id}/watched/series/{seriesId}")
    public ResponseEntity<List<SeriesResponseDTO>> addSeriesToWatched(@PathVariable String id, @PathVariable String seriesId) {
        return userService.addSeriesToWatched(id, seriesId);
    }

    /**
     * removes the movie with the given id from the watched list of the given user
     * @param id
     * @param movieId
     */
    @DeleteMapping("/{id}/watched/movies/{movieId}")
    public ResponseEntity<Void> removeMovieFromWatched(@PathVariable String id, @PathVariable String movieId) {
        userService.removeMovieFromWatched(id, movieId);
        return ResponseEntity.noContent().build();
    }

    /**
     * removes the series with the given id from the watched list of the given user
     * @param id
     * @param seriesId
     */
    @DeleteMapping("/{id}/watched/series/{seriesId}")
    public ResponseEntity<Void> removeSeriesFromWatched(@PathVariable String id, @PathVariable String seriesId) {
        userService.removeSeriesFromWatched(id, seriesId);
        return ResponseEntity.noContent().build();
    }

}
