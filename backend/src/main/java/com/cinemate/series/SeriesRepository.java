package com.cinemate.series;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface SeriesRepository extends MongoRepository<Series, String> {
  @Query("{ 'actors._id': ?0 }")
  List<Series> findByActorId(String actorId);

  @Query("{ 'directors._id': ?0 }")
  List<Series> findByDirectorId(String directorId);

  @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
  List<Series> findByNameContainingIgnoreCase(String name);

  Optional<Series> findByTmdbId(Integer tmdbId);
}
