package com.cinemate.movie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieRepository.findAll());
    }

    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    public ResponseEntity<Movie> createMovie(Movie movie) {
        return ResponseEntity.ok(movieRepository.save(movie));
    }


    public ResponseEntity<Movie> updateMovie(String id, Movie updatedMovie) {
        updatedMovie.setId(id);
        return ResponseEntity.ok(movieRepository.save(updatedMovie));
    }

    public void deleteMovie(String id) {
        movieRepository.deleteById(id);
    }
}
