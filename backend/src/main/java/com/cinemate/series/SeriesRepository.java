package com.cinemate.series;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SeriesRepository extends MongoRepository<Series, String> {
    @Query("{ 'actors._id': ?0 }")
    List<Series> findByActorId(String actorId);
    @Query("{ 'directors._id': ?0 }")
    List<Series> findByDirectorId(String directorId);
    
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Series> findByNameContainingIgnoreCase(String name);
}
