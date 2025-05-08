package com.cinemate.actor;

import com.cinemate.director.Director;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/actors")
public class ActorController {

    private final ActorRepository actorRepository;

    @Autowired
    public ActorController(ActorRepository actorRepository) {
        this.actorRepository = actorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Actor>> getAllActors() {
        return ResponseEntity.ok(actorRepository.findAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<Actor>> getActorById(@PathVariable String id) {
        return ResponseEntity.ok(actorRepository.findById(id));
    }

    @PostMapping
    public ResponseEntity<Actor> createActor(@RequestBody Actor actor) {
        return ResponseEntity.ok(actorRepository.save(actor));
    }

    @PutMapping("{id}")
    public ResponseEntity<Actor> updateActor(@PathVariable String id, @RequestBody Actor updatedActor) {
        Optional<Actor> optionalActor = actorRepository.findById(id);
        if (optionalActor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Actor existingActor = optionalActor.get();

        if (updatedActor.getName() != null) existingActor.setName(updatedActor.getName());
        if (updatedActor.getBirthday() != null) existingActor.setBirthday(updatedActor.getBirthday());
        if (updatedActor.getBiography() != null) existingActor.setBiography(updatedActor.getBiography());
        if (updatedActor.getImage() != null) existingActor.setImage(updatedActor.getImage());

        return ResponseEntity.ok(existingActor);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteActor(@PathVariable String id) {
        actorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
