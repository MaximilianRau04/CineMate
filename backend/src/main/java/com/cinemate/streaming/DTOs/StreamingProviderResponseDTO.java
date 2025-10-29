package com.cinemate.streaming.DTOs;

import com.cinemate.streaming.StreamingProvider;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StreamingProviderResponseDTO {
    
    private String id;
    private String name;
    private String logoUrl;
    private String websiteUrl;
    private String country;
    private boolean subscriptionRequired;
    private boolean rentalAvailable;
    private boolean purchaseAvailable;
    private boolean isActive;

    public StreamingProviderResponseDTO(StreamingProvider provider) {
        this.id = provider.getId();
        this.name = provider.getName();
        this.logoUrl = provider.getLogoUrl();
        this.websiteUrl = provider.getWebsiteUrl();
        this.country = provider.getCountry();
        this.subscriptionRequired = provider.isSubscriptionRequired();
        this.rentalAvailable = provider.isRentalAvailable();
        this.purchaseAvailable = provider.isPurchaseAvailable();
        this.isActive = provider.isActive();
    }

}
