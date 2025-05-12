package com.cinemate.movie;

import com.cinemate.actor.Actor;
import com.cinemate.actor.ActorRepository;
import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.director.DTOs.DirectorResponseDTO;
import com.cinemate.director.Director;
import com.cinemate.director.DirectorRepository;
import com.cinemate.movie.DTOs.MovieRequestDTO;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public ResponseEntity<List<MovieResponseDTO>> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        List<MovieResponseDTO> movieDTOs = movies.stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(movieDTOs);
    }

    public Optional<MovieResponseDTO> getMovieById(String id) {
        return movieRepository.findById(id)
                .map(MovieResponseDTO::new);
    }

    public ResponseEntity<MovieResponseDTO> createMovie(MovieRequestDTO movieDTO) {
        Movie movie = buildMovieFromDTO(null, movieDTO);
        Movie savedMovie = movieRepository.save(movie);
        return ResponseEntity.ok(new MovieResponseDTO(savedMovie));
    }

    public ResponseEntity<MovieResponseDTO> updateMovie(String id, MovieRequestDTO movieDTO) {
        Optional<Movie> optionalMovie = movieRepository.findById(id);
        if (optionalMovie.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie updatedMovie = buildMovieFromDTO(id, movieDTO);
        Movie savedMovie = movieRepository.save(updatedMovie);
        return ResponseEntity.ok(new MovieResponseDTO(savedMovie));
    }

    public void deleteMovie(String id) {
        movieRepository.deleteById(id);
    }

    public Optional<DirectorResponseDTO> getDirectorOfMovie(String movieId) {
        return movieRepository.findById(movieId)
                .map(movie -> new DirectorResponseDTO(movie.getDirector()));
    }

    public Optional<List<ActorResponseDTO>> getActorsOfMovie(String movieId) {
        return movieRepository.findById(movieId)
                .map(movie -> movie.getActors().stream()
                        .map(ActorResponseDTO::new)
                        .collect(Collectors.toList()));
    }

    private Movie buildMovieFromDTO(String id, MovieRequestDTO movieDTO) {
        MovieResponseDTO dto = new MovieResponseDTO(
                id,
                movieDTO.getTitle(),
                movieDTO.getDescription(),
                movieDTO.getGenre(),
                0.0,
                0,
                movieDTO.getReleaseDate(),
                movieDTO.getDuration(),
                movieDTO.getPosterUrl(),
                movieDTO.getCountry(),
                movieDTO.getTrailerUrl()
        );

        return new Movie(movieDTO);
    }
}