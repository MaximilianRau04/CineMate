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
        Optional<Movie> optionalMovie = movieRepository.findById(id);
        if (optionalMovie.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Movie existingMovie = optionalMovie.get();

        if (updatedMovie.getTitle() != null) existingMovie.setTitle(updatedMovie.getTitle());
        if (updatedMovie.getDescription() != null) existingMovie.setDescription(updatedMovie.getDescription());
        if (updatedMovie.getReleaseDate() != null) existingMovie.setReleaseDate(updatedMovie.getReleaseDate());
        if (updatedMovie.getGenre() != null) existingMovie.setGenre(updatedMovie.getGenre());
        if (updatedMovie.getDuration() != null) existingMovie.setDuration(updatedMovie.getDuration());
        if(updatedMovie.getPosterUrl() != null) existingMovie.setPosterUrl(updatedMovie.getPosterUrl());

        return ResponseEntity.ok(movieRepository.save(existingMovie));
    }

    public void deleteMovie(String id) {
        movieRepository.deleteById(id);
    }
}
