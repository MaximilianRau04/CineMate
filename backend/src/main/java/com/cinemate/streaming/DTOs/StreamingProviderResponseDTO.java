package com.cinemate.streaming.DTOs;

import com.cinemate.streaming.StreamingProvider;

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

    public StreamingProviderResponseDTO() {}

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

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public boolean isSubscriptionRequired() {
        return subscriptionRequired;
    }

    public void setSubscriptionRequired(boolean subscriptionRequired) {
        this.subscriptionRequired = subscriptionRequired;
    }

    public boolean isRentalAvailable() {
        return rentalAvailable;
    }

    public void setRentalAvailable(boolean rentalAvailable) {
        this.rentalAvailable = rentalAvailable;
    }

    public boolean isPurchaseAvailable() {
        return purchaseAvailable;
    }

    public void setPurchaseAvailable(boolean purchaseAvailable) {
        this.purchaseAvailable = purchaseAvailable;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
}
