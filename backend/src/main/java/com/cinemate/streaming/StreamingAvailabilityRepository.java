package com.cinemate.streaming;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StreamingAvailabilityRepository extends MongoRepository<StreamingAvailability, String> {
    
    List<StreamingAvailability> findByMediaIdAndMediaType(String mediaId, MediaType mediaType);
    
    List<StreamingAvailability> findByMediaIdAndMediaTypeAndRegion(String mediaId, MediaType mediaType, String region);
    
    List<StreamingAvailability> findByProvider(StreamingProvider provider);
    
    List<StreamingAvailability> findByAvailabilityType(AvailabilityType availabilityType);
    
    void deleteByMediaIdAndMediaType(String mediaId, MediaType mediaType);
}
