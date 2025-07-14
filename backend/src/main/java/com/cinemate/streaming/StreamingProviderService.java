package com.cinemate.streaming;

import com.cinemate.streaming.DTOs.StreamingProviderRequestDTO;
import com.cinemate.streaming.DTOs.StreamingProviderResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StreamingProviderService {
    
    private final StreamingProviderRepository providerRepository;
    private final StreamingAvailabilityRepository availabilityRepository;
    
    @Autowired
    public StreamingProviderService(StreamingProviderRepository providerRepository,
                                   StreamingAvailabilityRepository availabilityRepository) {
        this.providerRepository = providerRepository;
        this.availabilityRepository = availabilityRepository;
    }
    
    /**
     * Get all active streaming providers
     * @return List of StreamingProviderResponseDTO
     */
    public ResponseEntity<List<StreamingProviderResponseDTO>> getAllActiveProviders() {
        List<StreamingProvider> providers = providerRepository.findByActiveTrue();
        List<StreamingProviderResponseDTO> response = providers.stream()
                .map(StreamingProviderResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all streaming providers
     * @return List of StreamingProviderResponseDTO
     */
    public ResponseEntity<List<StreamingProviderResponseDTO>> getAllProviders() {
        List<StreamingProvider> providers = providerRepository.findAll();
        List<StreamingProviderResponseDTO> response = providers.stream()
                .map(StreamingProviderResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get streaming providers by country
     * @param country
     * @return List of StreamingProviderResponseDTO
     */
    public ResponseEntity<List<StreamingProviderResponseDTO>> getProvidersByCountry(String country) {
        List<StreamingProvider> providers = providerRepository.findByCountryAndActiveTrue(country);
        List<StreamingProviderResponseDTO> response = providers.stream()
                .map(StreamingProviderResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get streaming provider by ID
     * @param id
     * @return StreamingProviderResponseDTO
     */
    public Optional<StreamingProviderResponseDTO> getProviderById(String id) {
        return providerRepository.findById(id)
                .map(StreamingProviderResponseDTO::new);
    }
    
    /**
     * Create a new streaming provider
     * @param providerDTO
     * @return StreamingProviderResponseDTO
     */
    public ResponseEntity<StreamingProviderResponseDTO> createProvider(StreamingProviderRequestDTO providerDTO) {
        StreamingProvider provider = new StreamingProvider(
                providerDTO.getName(),
                providerDTO.getLogoUrl(),
                providerDTO.getWebsiteUrl(),
                providerDTO.getCountry(),
                providerDTO.isSubscriptionRequired(),
                providerDTO.isRentalAvailable(),
                providerDTO.isPurchaseAvailable()
        );
        
        StreamingProvider savedProvider = providerRepository.save(provider);
        return ResponseEntity.ok(new StreamingProviderResponseDTO(savedProvider));
    }
    
    /**
     * Update a streaming provider
     * @param id
     * @param providerDTO
     * @return StreamingProviderResponseDTO
     */
    public ResponseEntity<StreamingProviderResponseDTO> updateProvider(String id, StreamingProviderRequestDTO providerDTO) {
        Optional<StreamingProvider> existingProvider = providerRepository.findById(id);
        
        if (existingProvider.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        StreamingProvider provider = existingProvider.get();
        provider.setName(providerDTO.getName());
        provider.setLogoUrl(providerDTO.getLogoUrl());
        provider.setWebsiteUrl(providerDTO.getWebsiteUrl());
        provider.setCountry(providerDTO.getCountry());
        provider.setSubscriptionRequired(providerDTO.isSubscriptionRequired());
        provider.setRentalAvailable(providerDTO.isRentalAvailable());
        provider.setPurchaseAvailable(providerDTO.isPurchaseAvailable());
        
        StreamingProvider savedProvider = providerRepository.save(provider);
        return ResponseEntity.ok(new StreamingProviderResponseDTO(savedProvider));
    }
    
    /**
     * Delete a streaming provider
     * @param id
     * @return ResponseEntity
     */
    public ResponseEntity<Void> deleteProvider(String id) {
        if (!providerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Lösche erst alle StreamingAvailability-Einträge, die auf diesen Provider verweisen
        availabilityRepository.deleteByProviderId(id);
        
        // Dann lösche den Provider
        providerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Toggle provider active status
     * @param id
     * @return StreamingProviderResponseDTO
     */
    public ResponseEntity<StreamingProviderResponseDTO> toggleProviderStatus(String id) {
        Optional<StreamingProvider> existingProvider = providerRepository.findById(id);
        
        if (existingProvider.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        StreamingProvider provider = existingProvider.get();
        provider.setActive(!provider.isActive());
        
        StreamingProvider savedProvider = providerRepository.save(provider);
        return ResponseEntity.ok(new StreamingProviderResponseDTO(savedProvider));
    }
    
    /**
     * Bereinige verwaiste StreamingAvailability-Einträge (für Provider, die nicht mehr existieren)
     * @return Anzahl der bereinigten Einträge
     */
    public int cleanupOrphanedAvailabilities() {
        List<StreamingAvailability> allAvailabilities = availabilityRepository.findAll();
        List<StreamingAvailability> orphanedAvailabilities = allAvailabilities.stream()
                .filter(availability -> availability.getProvider() == null)
                .collect(Collectors.toList());
                
        if (!orphanedAvailabilities.isEmpty()) {
            List<String> orphanedIds = orphanedAvailabilities.stream()
                    .map(StreamingAvailability::getId)
                    .collect(Collectors.toList());
            availabilityRepository.deleteAllById(orphanedIds);
        }
        
        return orphanedAvailabilities.size();
    }
}
