package com.cinemate.streaming;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StreamingProviderRepository extends MongoRepository<StreamingProvider, String> {
    
    List<StreamingProvider> findByActiveTrue();
    
    List<StreamingProvider> findByCountry(String country);
    
    List<StreamingProvider> findByCountryAndActiveTrue(String country);
    
    StreamingProvider findByName(String name);
}
