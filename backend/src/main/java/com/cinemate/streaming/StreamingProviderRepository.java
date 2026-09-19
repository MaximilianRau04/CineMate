package com.cinemate.streaming;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreamingProviderRepository extends MongoRepository<StreamingProvider, String> {

  List<StreamingProvider> findByActiveTrue();

  List<StreamingProvider> findByCountry(String country);

  List<StreamingProvider> findByCountryAndActiveTrue(String country);

  StreamingProvider findByName(String name);
}
