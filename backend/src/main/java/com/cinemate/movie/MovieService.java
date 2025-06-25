package com.cinemate.movie;

import com.cinemate.actor.Actor;
import com.cinemate.actor.ActorRepository;
import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.director.Director;
import com.cinemate.director.DirectorRepository;
import com.cinemate.director.DTOs.DirectorResponseDTO;
import com.cinemate.movie.DTOs.MovieRequestDTO;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.notification.events.MovieReleasedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public MovieService(MovieRepository movieRepository,
                        ActorRepository actorRepository,
                        DirectorRepository directorRepository,
                        ApplicationEventPublisher eventPublisher) {
        this.movieRepository = movieRepository;
        this.actorRepository = actorRepository;
        this.directorRepository = directorRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * return all movies
     * @return List<MovieResponseDTO>
     */
    public ResponseEntity<List<MovieResponseDTO>> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        List<MovieResponseDTO> movieDTOs = movies.stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(movieDTOs);
    }

    /**
     * returns the movie with the given id
     * @param id
     * @return MovieResponseDTO
     */
    public Optional<MovieResponseDTO> getMovieById(String id) {
        return movieRepository.findById(id)
                .map(MovieResponseDTO::new);
    }

    /**
     * creates a movie
     * @param movieDTO
     * @return MovieResponseDTO
     */
    public ResponseEntity<MovieResponseDTO> createMovie(MovieRequestDTO movieDTO) {
        Movie movie = new Movie(movieDTO);
        Movie savedMovie = movieRepository.save(movie);

        if (movie.getReleaseDate() != null && !movie.getReleaseDate().after(new Date())) {
            eventPublisher.publishEvent(new MovieReleasedEvent(this, savedMovie));
        }
        
        return ResponseEntity.ok(new MovieResponseDTO(savedMovie));
    }

    /**
     * updates the movie with the given id
     * @param id
     * @param movieDTO
     * @return MovieResponseDTO
     */
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

        Date oldReleaseDate = existingMovie.getReleaseDate();
        Date newReleaseDate = movieDTO.getReleaseDate();
        boolean wasJustReleased = false;
        
        if (newReleaseDate != null && oldReleaseDate != null) {
            Date now = new Date();
            wasJustReleased = oldReleaseDate.after(now) && !newReleaseDate.after(now);
        }
        
        Movie savedMovie = movieRepository.save(existingMovie);

        if (wasJustReleased) {
            eventPublisher.publishEvent(new MovieReleasedEvent(this, savedMovie));
        }
        
        return ResponseEntity.ok(new MovieResponseDTO(savedMovie));
    }

    /**
     * deletes the movie with the given id
     * @param id
     */
    public void deleteMovie(String id) {
        movieRepository.deleteById(id);
    }

    /**
     * returns the director of the movie
     *
     * @param movieId
     * @return DirectorResponseDTO
     */
    public Optional<List<DirectorResponseDTO>> getDirectorsOfMovie(String movieId) {
        return movieRepository.findById(movieId)
                .map(movie -> {
                    List<Director> directors = movie.getDirectors();
                    if (directors == null) {
                        return Collections.<DirectorResponseDTO>emptyList();
                    }
                    return directors.stream()
                            .filter(Objects::nonNull)
                            .map(DirectorResponseDTO::new)
                            .collect(Collectors.toList());
                });
    }

    /**
     * returns the actors of the movie
     * @param movieId
     * @return List<ActorResponseDTO>
     */
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

    /**
     * Adds an actor to a movie
     * @param movieId
     * @param actorId
     * @return the added actor
     */
    public ResponseEntity<ActorResponseDTO> addActorToMovie(String movieId, String actorId) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        Optional<Actor> optionalActor = actorRepository.findById(actorId);

        if (optionalMovie.isEmpty() || optionalActor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie movie = optionalMovie.get();
        Actor actor = optionalActor.get();

        if (movie.getActors() == null) {
            movie.setActors(new ArrayList<>());
        }

        if (!movie.getActors().contains(actor)) {
            movie.getActors().add(actor);

            if (actor.getMovies() == null) {
                actor.setMovies(new ArrayList<>());
            }

            if (!actor.getMovies().contains(movie)) {
                actor.getMovies().add(movie);
            }

            actorRepository.save(actor);
            movieRepository.save(movie);
        }

        ActorResponseDTO addedActor = new ActorResponseDTO(actor);
        return ResponseEntity.ok(addedActor);
    }

    /**
     * Removes an actor from a movie
     * @param movieId
     * @param actorId
     * @return ResponseEntity with list of remaining actors or not found
     */
    public ResponseEntity<Void> removeActorFromMovie(String movieId, String actorId) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        Optional<Actor> optionalActor = actorRepository.findById(actorId);

        if (optionalMovie.isEmpty() || optionalActor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie movie = optionalMovie.get();
        Actor actor = optionalActor.get();

        if (movie.getActors() != null) {
            boolean removed = movie.getActors().removeIf(a -> a.getId().equals(actorId));

            if (removed && actor.getMovies() != null) {
                actor.getMovies().removeIf(m -> m.getId().equals(movieId));
                actorRepository.save(actor);
            }

            movieRepository.save(movie);
        }

        return ResponseEntity.noContent().build();
    }

    /**
     * Sets a director to a movie
     * @param movieId
     * @param directorId
     * @return ResponseEntity with updated director or not found
     */
    public ResponseEntity<DirectorResponseDTO> addDirectorToMovie(String movieId, String directorId) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        Optional<Director> optionalDirector = directorRepository.findById(directorId);

        if (optionalMovie.isEmpty() || optionalDirector.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie movie = optionalMovie.get();
        Director director = optionalDirector.get();

        if (movie.getDirectors() == null) {
            movie.setDirectors(new ArrayList<>());
        }

        if (!movie.getDirectors().contains(director)) {
            movie.getDirectors().add(director);

            if (director.getMovies() == null) {
                director.setMovies(new ArrayList<>());
            }

            if (!director.getMovies().contains(movie)) {
                director.getMovies().add(movie);
            }

            directorRepository.save(director);
            movieRepository.save(movie);
        }

        DirectorResponseDTO addedDirector = new DirectorResponseDTO(director);
        return ResponseEntity.ok(addedDirector);
    }

    /**
     * Removes an director from a movie
     * @param movieId
     * @param directorId
     * @return ResponseEntity with list of remaining directors or not found
     */
    public ResponseEntity<Void> removeDirectorFromMovie(String movieId, String directorId) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        Optional<Director> optionalDirector = directorRepository.findById(directorId);

        if (optionalMovie.isEmpty() || optionalDirector.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie movie = optionalMovie.get();
        Director director = optionalDirector.get();

        if (movie.getDirectors() != null) {
            boolean removed = movie.getDirectors().removeIf(a -> a.getId().equals(directorId));

            if (removed && director.getMovies() != null) {
                director.getMovies().removeIf(m -> m.getId().equals(movieId));
                directorRepository.save(director);
            }

            movieRepository.save(movie);
        }

        return ResponseEntity.noContent().build();
    }
}