package com.cinemate.movie;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface MovieRepository extends MongoRepository<Movie, String> {
  @Query("{ 'actors._id': ?0 }")
  List<Movie> findByActorId(String actorId);

  @Query("{ 'directors._id': ?0 }")
  List<Movie> findByDirectorId(String directorId);

  @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
  List<Movie> findByTitleContainingIgnoreCase(String title);

  Optional<Movie> findByTmdbId(Integer tmdbId);
}
