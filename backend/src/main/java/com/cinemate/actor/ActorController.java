package com.cinemate.actor;

import com.cinemate.actor.DTOs.ActorRequestDTO;
import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.director.Director;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/actors")
public class ActorController {

    private final ActorService actorService;

    @Autowired
    public ActorController(ActorService actorService) {
        this.actorService = actorService;
    }

    @GetMapping
    public ResponseEntity<List<ActorResponseDTO>> getAllActors() {
        List<ActorResponseDTO> actors = actorService.getAllActors();
        return ResponseEntity.ok(actors);
    }

    @GetMapping("{id}")
    public ResponseEntity<ActorResponseDTO> getActorById(@PathVariable String id) {
        Optional<ActorResponseDTO> actor = actorService.getActorById(id);
        return actor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ActorResponseDTO> createActor(@RequestBody ActorRequestDTO actorRequestDTO) {
        ActorResponseDTO actorResponseDTO = actorService.createActor(actorRequestDTO);
        return ResponseEntity.ok(actorResponseDTO);
    }

    @PutMapping("{id}")
    public ResponseEntity<ActorResponseDTO> updateActor(@PathVariable String id, @RequestBody ActorRequestDTO updatedActorDTO) {
        Optional<ActorResponseDTO> updatedActor = actorService.updateActor(id, updatedActorDTO);
        return updatedActor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteActor(@PathVariable String id) {
        actorService.deleteActor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{actorId}/movies")
    public ResponseEntity<List<MovieResponseDTO>> getMoviesByActor(@PathVariable String actorId) {
        List<MovieResponseDTO> movies = actorService.getMoviesByActorId(actorId);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("{actorId}/series")
    public ResponseEntity<List<SeriesResponseDTO>> getSeriesByActor(@PathVariable String actorId) {
        List<SeriesResponseDTO> series = actorService.getSeriesByActorId(actorId);
        return ResponseEntity.ok(series);
    }
}
