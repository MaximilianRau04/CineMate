package com.cinemate.movie;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MovieRepository extends MongoRepository<Movie, String> {
    @Query("{ 'actors._id': ?0 }")
    List<Movie> findByActorId(String actorId);

    @Query("{ 'directors._id': ?0 }")
    List<Movie> findByDirectorId(String directorId);
}
