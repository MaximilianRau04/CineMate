package com.cinemate.streaming;

import com.cinemate.streaming.DTOs.StreamingAvailabilityResponseDTO;
import com.cinemate.streaming.DTOs.StreamingProviderRequestDTO;
import com.cinemate.streaming.DTOs.StreamingProviderResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/streaming")
public class StreamingController {

    private final StreamingProviderService providerService;
    private final StreamingAvailabilityService availabilityService;
    
    @Autowired
    public StreamingController(StreamingProviderService providerService,
                               StreamingAvailabilityService availabilityService) {
        this.providerService = providerService;
        this.availabilityService = availabilityService;
    }
    
    /**
     * Get all active streaming providers
     * @return List of StreamingProviderResponseDTO
     */
    @GetMapping("/providers")
    public ResponseEntity<List<StreamingProviderResponseDTO>> getAllActiveProviders() {
        return providerService.getAllActiveProviders();
    }
    
    /**
     * Get all streaming providers (including inactive)
     * @return List of StreamingProviderResponseDTO
     */
    @GetMapping("/providers/all")
    public ResponseEntity<List<StreamingProviderResponseDTO>> getAllProviders() {
        return providerService.getAllProviders();
    }
    
    /**
     * Get streaming providers by country
     * @param country
     * @return List of StreamingProviderResponseDTO
     */
    @GetMapping("/providers/country/{country}")
    public ResponseEntity<List<StreamingProviderResponseDTO>> getProvidersByCountry(@PathVariable String country) {
        return providerService.getProvidersByCountry(country);
    }
    
    /**
     * Get streaming provider by ID
     * @param id
     * @return StreamingProviderResponseDTO
     */
    @GetMapping("/providers/{id}")
    public ResponseEntity<StreamingProviderResponseDTO> getProviderById(@PathVariable String id) {
        return providerService.getProviderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create a new streaming provider
     * @param providerDTO
     * @return StreamingProviderResponseDTO
     */
    @PostMapping("/providers")
    public ResponseEntity<StreamingProviderResponseDTO> createProvider(@RequestBody StreamingProviderRequestDTO providerDTO) {
        return providerService.createProvider(providerDTO);
    }
    
    /**
     * Update a streaming provider
     * @param id
     * @param providerDTO
     * @return StreamingProviderResponseDTO
     */
    @PutMapping("/providers/{id}")
    public ResponseEntity<StreamingProviderResponseDTO> updateProvider(@PathVariable String id,
                                                                     @RequestBody StreamingProviderRequestDTO providerDTO) {
        return providerService.updateProvider(id, providerDTO);
    }
    
    /**
     * Delete a streaming provider
     * @param id
     * @return ResponseEntity
     */
    @DeleteMapping("/providers/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable String id) {
        return providerService.deleteProvider(id);
    }
    
    /**
     * Toggle provider active status
     * @param id
     * @return StreamingProviderResponseDTO
     */
    @PatchMapping("/providers/{id}/toggle")
    public ResponseEntity<StreamingProviderResponseDTO> toggleProviderStatus(@PathVariable String id) {
        return providerService.toggleProviderStatus(id);
    }
    
    /**
     * Get streaming availability for a specific media
     * @param mediaId
     * @param mediaType
     * @return List of StreamingAvailabilityResponseDTO
     */
    @GetMapping("/availability/{mediaType}/{mediaId}")
    public ResponseEntity<List<StreamingAvailabilityResponseDTO>> getAvailabilityForMedia(
            @PathVariable String mediaId, @PathVariable String mediaType) {
        return availabilityService.getAvailabilityForMedia(mediaId, mediaType);
    }
    
    /**
     * Get streaming availability for a specific media and region
     * @param mediaId
     * @param mediaType
     * @param region
     * @return List of StreamingAvailabilityResponseDTO
     */
    @GetMapping("/availability/{mediaType}/{mediaId}/region/{region}")
    public ResponseEntity<List<StreamingAvailabilityResponseDTO>> getAvailabilityForMediaAndRegion(
            @PathVariable String mediaId, @PathVariable String mediaType, @PathVariable String region) {
        return availabilityService.getAvailabilityForMediaAndRegion(mediaId, mediaType, region);
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
    @PostMapping("/availability/{mediaType}/{mediaId}")
    public ResponseEntity<StreamingAvailabilityResponseDTO> addAvailability(
            @PathVariable String mediaId,
            @PathVariable String mediaType,
            @RequestParam String providerId,
            @RequestParam String availabilityType,
            @RequestParam String region,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) String quality,
            @RequestParam(required = false) String url) {
        
        return availabilityService.addAvailability(mediaId, mediaType, providerId, availabilityType,
                region, price, currency, quality, url);
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
    @PutMapping("/availability/{availabilityId}")
    public ResponseEntity<StreamingAvailabilityResponseDTO> updateAvailability(
            @PathVariable String availabilityId,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) String quality,
            @RequestParam(required = false) String url) {
        
        return availabilityService.updateAvailability(availabilityId, price, currency, quality, url);
    }
    
    /**
     * Delete streaming availability
     * @param availabilityId
     * @return ResponseEntity
     */
    @DeleteMapping("/availability/{availabilityId}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable String availabilityId) {
        return availabilityService.deleteAvailability(availabilityId);
    }
    
    /**
     * Delete all availability for a specific media
     * @param mediaId
     * @param mediaType
     * @return ResponseEntity
     */
    @DeleteMapping("/availability/{mediaType}/{mediaId}")
    public ResponseEntity<Void> deleteAllAvailabilityForMedia(@PathVariable String mediaId, @PathVariable String mediaType) {
        return availabilityService.deleteAllAvailabilityForMedia(mediaId, mediaType);
    }
    
    /**
     * Clean up availability records with null providers
     * This is a maintenance endpoint
     * @return ResponseEntity
     */
    @PostMapping("/availability/cleanup")
    public ResponseEntity<String> cleanupNullProviders() {
        availabilityService.cleanupNullProviders();
        return ResponseEntity.ok("Cleanup completed successfully");
    }
    
    /**
     * Reset all providers to default values
     * This is a maintenance endpoint
     * @return ResponseEntity
     */
    @PostMapping("/providers/reset")
    public ResponseEntity<String> resetProviders() {
        return providerService.resetToDefaultProviders();
    }
}
