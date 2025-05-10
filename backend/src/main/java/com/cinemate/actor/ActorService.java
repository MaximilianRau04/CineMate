package com.cinemate.actor;

import com.cinemate.actor.DTOs.ActorRequestDTO;
import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.movie.MovieRepository;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.series.SeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ActorService {

    private final ActorRepository actorRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    @Autowired
    public ActorService(ActorRepository actorRepository, MovieRepository movieRepository, SeriesRepository seriesRepository) {
        this.actorRepository = actorRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
    }

    public List<ActorResponseDTO> getAllActors() {
        return actorRepository.findAll().stream()
                .map(ActorResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<ActorResponseDTO> getActorById(String id) {
        return actorRepository.findById(id).map(ActorResponseDTO::new);
    }

    public ActorResponseDTO createActor(ActorRequestDTO actorRequestDTO) {
        Actor actor = new Actor(actorRequestDTO);
        Actor savedActor = actorRepository.save(actor);
        return new ActorResponseDTO(savedActor);
    }

    public Optional<ActorResponseDTO> updateActor(String id, ActorRequestDTO updatedActorDTO) {
        Optional<Actor> optionalActor = actorRepository.findById(id);
        if (optionalActor.isEmpty()) {
            return Optional.empty();
        }

        Actor actor = optionalActor.get();
        if (updatedActorDTO.getName() != null) actor.setName(updatedActorDTO.getName());
        if (updatedActorDTO.getBirthday() != null) actor.setBirthday(updatedActorDTO.getBirthday());
        if (updatedActorDTO.getBiography() != null) actor.setBiography(updatedActorDTO.getBiography());
        if (updatedActorDTO.getImage() != null) actor.setImage(updatedActorDTO.getImage());

        Actor updatedActor = actorRepository.save(actor);
        return Optional.of(new ActorResponseDTO(updatedActor));
    }

    public void deleteActor(String id) {
        actorRepository.deleteById(id);
    }

    public List<MovieResponseDTO> getMoviesByActorId(String actorId) {
        return movieRepository.findByActorId(actorId).stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<SeriesResponseDTO> getSeriesByActorId(String actorId) {
        return seriesRepository.findByActorId(actorId).stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());
    }

}
