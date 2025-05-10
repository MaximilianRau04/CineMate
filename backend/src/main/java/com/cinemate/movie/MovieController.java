package com.cinemate.movie;

import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.director.DTOs.DirectorResponseDTO;
import com.cinemate.movie.DTOs.MovieRequestDTO;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /**
     * returns all movies
     * @return List<Movie>
     */
    @GetMapping
    public ResponseEntity<List<MovieResponseDTO>> getAllMovies() {
        return movieService.getAllMovies();
    }

    /**
     * returns the movie object with the given id
     * @param id
     * @return Movie
     */
    @GetMapping("/{id}")
    public ResponseEntity<MovieResponseDTO> getMovieById(@PathVariable String id) {
        return movieService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * creates a movie
     * @param movie
     * @return Movie
     */
    @PostMapping
    public ResponseEntity<MovieResponseDTO> createMovie(@RequestBody MovieRequestDTO movie) {
        return movieService.createMovie(movie);
    }

    /**
     * updates the movie with the given id
     * @param id
     * @param movie
     * @return Movie
     */
    @PutMapping("/{id}")
    public ResponseEntity<MovieResponseDTO> updateMovie(@PathVariable String id, @RequestBody MovieRequestDTO movie) {
        return movieService.updateMovie(id, movie);
    }

    /**
     * deletes the movie with the given id
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * returns the director of the movie
     * @param id
     * @return DirectorResponseDTO
     */
    @GetMapping("/{id}/director")
    public ResponseEntity<DirectorResponseDTO> getDirectorOfMovie(@PathVariable String id) {
        return movieService.getDirectorOfMovie(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * returns the actors of the movie
     * @param id
     * @return List<ActorResponseDTO>
     */
    @GetMapping("/{id}/actors")
    public ResponseEntity<List<ActorResponseDTO>> getActorsOfMovie(@PathVariable String id) {
        return movieService.getActorsOfMovie(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
