package com.cinemate.movie;

import com.cinemate.actor.Actor;
import com.cinemate.actor.ActorRepository;
import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.director.DirectorRepository;
import com.cinemate.director.DTOs.DirectorResponseDTO;
import com.cinemate.movie.DTOs.MovieRequestDTO;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository,
                        ActorRepository actorRepository,
                        DirectorRepository directorRepository) {
        this.movieRepository = movieRepository;
        this.actorRepository = actorRepository;
        this.directorRepository = directorRepository;
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
        Movie movie = new Movie(movieDTO);

        if (movieDTO.getDirectorId() != null && !movieDTO.getDirectorId().isEmpty()) {
            directorRepository.findById(movieDTO.getDirectorId())
                    .ifPresent(movie::setDirector);
        }

        if (movieDTO.getActorIds() != null && !movieDTO.getActorIds().isEmpty()) {
            List<Actor> actors = new ArrayList<>();
            for (String actorId : movieDTO.getActorIds()) {
                actorRepository.findById(actorId).ifPresent(actors::add);
            }
            movie.setActors(actors);
        }

        Movie savedMovie = movieRepository.save(movie);
        return ResponseEntity.ok(new MovieResponseDTO(savedMovie));
    }

    public ResponseEntity<MovieResponseDTO> updateMovie(String id, MovieRequestDTO movieDTO) {
        Optional<Movie> optionalMovie = movieRepository.findById(id);
        if (optionalMovie.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie existingMovie = optionalMovie.get();

        if (movieDTO.getTitle() != null) {
            existingMovie.setTitle(movieDTO.getTitle());
        }
        if (movieDTO.getDescription() != null) {
            existingMovie.setDescription(movieDTO.getDescription());
        }
        if (movieDTO.getGenre() != null) {
            existingMovie.setGenre(movieDTO.getGenre());
        }
        if (movieDTO.getReleaseDate() != null) {
            existingMovie.setReleaseDate(movieDTO.getReleaseDate());
        }
        if (movieDTO.getDuration() != null) {
            existingMovie.setDuration(movieDTO.getDuration());
        }
        if (movieDTO.getPosterUrl() != null) {
            existingMovie.setPosterUrl(movieDTO.getPosterUrl());
        }
        if (movieDTO.getCountry() != null) {
            existingMovie.setCountry(movieDTO.getCountry());
        }
        if (movieDTO.getTrailerUrl() != null) {
            existingMovie.setTrailerUrl(movieDTO.getTrailerUrl());
        }

        if (movieDTO.getDirectorId() != null && !movieDTO.getDirectorId().isEmpty()) {
            directorRepository.findById(movieDTO.getDirectorId())
                    .ifPresent(existingMovie::setDirector);
        }

        if (movieDTO.getActorIds() != null && !movieDTO.getActorIds().isEmpty()) {
            List<Actor> actors = new ArrayList<>();
            for (String actorId : movieDTO.getActorIds()) {
                actorRepository.findById(actorId).ifPresent(actors::add);
            }
            existingMovie.setActors(actors);
        }

        Movie savedMovie = movieRepository.save(existingMovie);
        return ResponseEntity.ok(new MovieResponseDTO(savedMovie));
    }

    public void deleteMovie(String id) {
        movieRepository.deleteById(id);
    }

    public Optional<DirectorResponseDTO> getDirectorOfMovie(String movieId) {
        return movieRepository.findById(movieId)
                .map(Movie::getDirector)
                .filter(Objects::nonNull)
                .map(DirectorResponseDTO::new);
    }

    public Optional<List<ActorResponseDTO>> getActorsOfMovie(String movieId) {
        return movieRepository.findById(movieId)
                .map(movie -> {
                    List<Actor> actors = movie.getActors();
                    if (actors == null) {
                        return Collections.<ActorResponseDTO>emptyList();
                    }
                    return actors.stream()
                            .filter(Objects::nonNull)
                            .map(ActorResponseDTO::new)
                            .collect(Collectors.toList());
                });
    }

}