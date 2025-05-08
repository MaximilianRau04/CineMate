package com.cinemate.director;

import com.cinemate.actor.Actor;
import com.cinemate.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/directors")
public class DirectorController {

    private final DirectorRepository directorRepository;

    @Autowired
    public DirectorController(DirectorRepository directorRepository) {
        this.directorRepository = directorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Director>> getAllDirectors() {
        return ResponseEntity.ok(directorRepository.findAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<Director>> getDirectorById(@PathVariable String id) {
        return ResponseEntity.ok(directorRepository.findById(id));
    }

    @PostMapping
    public ResponseEntity<Director> createDirector(@RequestBody Director director) {
        return ResponseEntity.ok(directorRepository.save(director));
    }

    @PutMapping("{id}")
    public ResponseEntity<Director> updateDirector(@PathVariable String id, @RequestBody Director updatedDirector) {
        Optional<Director> optionalDirector = directorRepository.findById(id);
        if (optionalDirector.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Director existingDirector = optionalDirector.get();

        if (updatedDirector.getName() != null) existingDirector.setName(updatedDirector.getName());
        if (updatedDirector.getBirthday() != null) existingDirector.setBirthday(updatedDirector.getBirthday());
        if (updatedDirector.getBiography() != null) existingDirector.setBiography(updatedDirector.getBiography());
        if (updatedDirector.getImage() != null) existingDirector.setImage(updatedDirector.getImage());

        return ResponseEntity.ok(existingDirector);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteDirector(@PathVariable String id) {
        directorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
