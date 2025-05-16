package com.cinemate.movie;

import com.cinemate.actor.Actor;
import com.cinemate.actor.ActorRepository;
import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.director.Director;
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

    /**
     * Adds an actor to a movie
     * @param movieId
     * @param actorId
     * @return ResponseEntity with list of actors or not found
     */
    public ResponseEntity<List<ActorResponseDTO>> addActorToMovie(String movieId, String actorId) {
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

        return ResponseEntity.ok(movie.getActors().stream()
                .map(ActorResponseDTO::new)
                .collect(Collectors.toList()));
    }

    /**
     * Removes an actor from a movie
     * @param movieId
     * @param actorId
     * @return ResponseEntity with list of remaining actors or not found
     */
    public ResponseEntity<List<ActorResponseDTO>> removeActorFromMovie(String movieId, String actorId) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        Optional<Actor> optionalActor = actorRepository.findById(actorId);

        if (optionalMovie.isEmpty() || optionalActor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie movie = optionalMovie.get();
        Actor actor = optionalActor.get();

        if (movie.getActors() != null) {
            movie.getActors().removeIf(a -> a.getId().equals(actorId));

            if (actor.getMovies() != null) {
                actor.getMovies().removeIf(m -> m.getId().equals(movieId));
                actorRepository.save(actor);
            }

            movieRepository.save(movie);
        }

        List<ActorResponseDTO> actorDTOs = new ArrayList<>();
        if (movie.getActors() != null) {
            for (Actor a : movie.getActors()) {
                ActorResponseDTO dto = new ActorResponseDTO();
                dto.setId(a.getId());
                dto.setName(a.getName());
                dto.setBirthday(a.getBirthday());
                dto.setImage(a.getImage());
                dto.setBiography(a.getBiography());
                actorDTOs.add(dto);
            }
        }

        return ResponseEntity.ok(actorDTOs);
    }

    /**
     * Sets a director to a movie
     * @param movieId
     * @param directorId
     * @return ResponseEntity with updated director or not found
     */
    public ResponseEntity<DirectorResponseDTO> setDirectorToMovie(String movieId, String directorId) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        Optional<Director> optionalDirector = directorRepository.findById(directorId);

        if (optionalMovie.isEmpty() || optionalDirector.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie movie = optionalMovie.get();
        Director director = optionalDirector.get();

        Director oldDirector = movie.getDirector();
        if (oldDirector != null && oldDirector.getMovies() != null) {
            oldDirector.getMovies().remove(movie);
            directorRepository.save(oldDirector);
        }

        movie.setDirector(director);

        if (director.getMovies() == null) {
            director.setMovies(new ArrayList<>());
        }

        if (!director.getMovies().contains(movie)) {
            director.getMovies().add(movie);
        }

        directorRepository.save(director);
        movieRepository.save(movie);

        return ResponseEntity.ok(new DirectorResponseDTO(director));
    }

    /**
     * Removes the director from a movie
     * @param movieId
     * @return ResponseEntity with null director or not found
     */
    public ResponseEntity<DirectorResponseDTO> removeDirectorFromMovie(String movieId) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);

        if (optionalMovie.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie movie = optionalMovie.get();
        Director oldDirector = movie.getDirector();

        if (oldDirector != null) {
            if (oldDirector.getMovies() != null) {
                oldDirector.getMovies().remove(movie);
                directorRepository.save(oldDirector);
            }

            movie.setDirector(null);
            movieRepository.save(movie);
        }

        return ResponseEntity.ok(null);
    }
}