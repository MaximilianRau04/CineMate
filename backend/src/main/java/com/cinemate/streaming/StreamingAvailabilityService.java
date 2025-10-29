package com.cinemate.streaming;

import com.cinemate.streaming.DTOs.StreamingAvailabilityResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StreamingAvailabilityService {
    
    private final StreamingAvailabilityRepository availabilityRepository;
    private final StreamingProviderRepository providerRepository;
    
    /**
     * Get streaming availability for a specific media
     * @param mediaId
     * @param mediaType
     * @return List of StreamingAvailabilityResponseDTO
     */
    public ResponseEntity<List<StreamingAvailabilityResponseDTO>> getAvailabilityForMedia(String mediaId, String mediaType) {
        MediaType type = MediaType.valueOf(mediaType.toUpperCase());
        List<StreamingAvailability> availabilities = availabilityRepository.findByMediaIdAndMediaType(mediaId, type);
        
        List<StreamingAvailabilityResponseDTO> response = availabilities.stream()
                .filter(availability -> availability.getProvider() != null) // Filtere null-Provider heraus
                .map(StreamingAvailabilityResponseDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get streaming availability for a specific media and region
     * @param mediaId
     * @param mediaType
     * @param region
     * @return List of StreamingAvailabilityResponseDTO
     */
    public ResponseEntity<List<StreamingAvailabilityResponseDTO>> getAvailabilityForMediaAndRegion(
            String mediaId, String mediaType, String region) {
        MediaType type = MediaType.valueOf(mediaType.toUpperCase());
        List<StreamingAvailability> availabilities = availabilityRepository
                .findByMediaIdAndMediaTypeAndRegion(mediaId, type, region);
        
        List<StreamingAvailabilityResponseDTO> response = availabilities.stream()
                .filter(availability -> availability.getProvider() != null) // Filtere null-Provider heraus
                .map(StreamingAvailabilityResponseDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Add streaming availability for media
     * @param mediaId
     * @param mediaType
     * @param providerId
     * @param availabilityType
     * @param region
     * @param price
     * @param currency
     * @param quality
     * @param url
     * @return StreamingAvailabilityResponseDTO
     */
    public ResponseEntity<StreamingAvailabilityResponseDTO> addAvailability(
            String mediaId, String mediaType, String providerId, String availabilityType,
            String region, Double price, String currency, String quality, String url) {
        
        MediaType type = MediaType.valueOf(mediaType.toUpperCase());
        AvailabilityType avType = AvailabilityType.valueOf(availabilityType.toUpperCase());
        
        StreamingProvider provider = providerRepository.findById(providerId).orElse(null);
        if (provider == null) {
            return ResponseEntity.badRequest().build();
        }
        
        StreamingAvailability availability = new StreamingAvailability(mediaId, type, provider, avType, region);
        availability.setPrice(price);
        availability.setCurrency(currency);
        availability.setQuality(quality);
        availability.setUrl(url);
        availability.setLastUpdated(new Date());
        
        StreamingAvailability savedAvailability = availabilityRepository.save(availability);
        return ResponseEntity.ok(new StreamingAvailabilityResponseDTO(savedAvailability));
    }
    
    /**
     * Update streaming availability
     * @param availabilityId
     * @param price
     * @param currency
     * @param quality
     * @param url
     * @return StreamingAvailabilityResponseDTO
     */
    public ResponseEntity<StreamingAvailabilityResponseDTO> updateAvailability(
            String availabilityId, Double price, String currency, String quality, String url) {
        
        StreamingAvailability availability = availabilityRepository.findById(availabilityId).orElse(null);
        if (availability == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (price != null) availability.setPrice(price);
        if (currency != null) availability.setCurrency(currency);
        if (quality != null) availability.setQuality(quality);
        if (url != null) availability.setUrl(url);
        availability.setLastUpdated(new Date());
        
        StreamingAvailability savedAvailability = availabilityRepository.save(availability);
        return ResponseEntity.ok(new StreamingAvailabilityResponseDTO(savedAvailability));
    }
    
    /**
     * Delete streaming availability
     * @param availabilityId
     * @return ResponseEntity
     */
    public ResponseEntity<Void> deleteAvailability(String availabilityId) {
        if (!availabilityRepository.existsById(availabilityId)) {
            return ResponseEntity.notFound().build();
        }
        
        availabilityRepository.deleteById(availabilityId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Delete all availability for a specific media
     * @param mediaId
     * @param mediaType
     * @return ResponseEntity
     */
    public ResponseEntity<Void> deleteAllAvailabilityForMedia(String mediaId, String mediaType) {
        MediaType type = MediaType.valueOf(mediaType.toUpperCase());
        availabilityRepository.deleteByMediaIdAndMediaType(mediaId, type);
        return ResponseEntity.noContent().build();
    }
}
