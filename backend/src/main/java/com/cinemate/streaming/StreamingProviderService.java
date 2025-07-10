package com.cinemate.streaming;

import com.cinemate.streaming.DTOs.StreamingProviderRequestDTO;
import com.cinemate.streaming.DTOs.StreamingProviderResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StreamingProviderService {
    
    private final StreamingProviderRepository providerRepository;
    
    @Autowired
    public StreamingProviderService(StreamingProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
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
     * Reset all providers to default values
     * This is a maintenance operation
     * @return ResponseEntity
     */
    public ResponseEntity<String> resetToDefaultProviders() {
        // Delete all existing providers
        providerRepository.deleteAll();
        
        // Create default providers
        List<StreamingProvider> defaultProviders = Arrays.asList(
            new StreamingProvider(
                "Netflix", 
                "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png",
                "https://netflix.com",
                "DE",
                true, false, false
            ),
            new StreamingProvider(
                "Amazon Prime Video", 
                "https://m.media-amazon.com/images/G/01/digital/video/merch/subs/benefit-id/primevideo-logo._CB462908803_.png",
                "https://primevideo.com",
                "DE",
                true, true, true
            ),
            new StreamingProvider(
                "Disney+", 
                "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/D7AEE1F05D10FC37C873176AAA26F777FC1B71E7A6563F36C6B1B497846E1BF1",
                "https://disneyplus.com",
                "DE",
                true, false, false
            ),
            new StreamingProvider(
                "Apple TV+", 
                "https://www.apple.com/apple-tv-plus/images/shared/apple_tv_plus_logo__b64rjp1cov82_large.png",
                "https://tv.apple.com",
                "DE",
                true, true, true
            ),
            new StreamingProvider(
                "Paramount+", 
                "https://www.paramount.com/sites/default/files/2021-02/paramount-plus-logo.png",
                "https://paramountplus.com",
                "DE",
                true, false, false
            ),
            new StreamingProvider(
                "Sky", 
                "https://www.sky.de/static/img/logos/sky-logo-xs.png",
                "https://sky.de",
                "DE",
                true, false, false
            ),
            new StreamingProvider(
                "WOW", 
                "https://www.wowschau.de/static/img/logos/wow-logo.svg",
                "https://wowschau.de",
                "DE",
                true, false, false
            ),
            new StreamingProvider(
                "ARD Mediathek", 
                "https://www.ard.de/static/logos/ard-logo.svg",
                "https://ardmediathek.de",
                "DE",
                false, false, false
            ),
            new StreamingProvider(
                "ZDF Mediathek", 
                "https://www.zdf.de/static/0.122.15133/img/logos/zdf-logo.svg",
                "https://zdf.de",
                "DE",
                false, false, false
            ),
            new StreamingProvider(
                "YouTube", 
                "https://www.youtube.com/img/desktop/yt_1200.png",
                "https://youtube.com",
                "DE",
                false, true, true
            ),
            new StreamingProvider(
                "Joyn", 
                "https://www.joyn.de/static/img/joyn_logo.png",
                "https://joyn.de",
                "DE",
                false, false, false
            ),
            new StreamingProvider(
                "RTL+", 
                "https://www.rtlplus.com/static/img/rtlplus-logo.svg",
                "https://rtlplus.com",
                "DE",
                true, false, false
            )
        );
        
        providerRepository.saveAll(defaultProviders);
        return ResponseEntity.ok("Providers reset to default values successfully. Total providers: " + defaultProviders.size());
    }
}
