package com.cinemate.streaming.DTOs;

import jakarta.validation.constraints.NotNull;

public class StreamingProviderRequestDTO {
    
    @NotNull
    private String name;
    private String logoUrl;
    private String websiteUrl;
    private String country;
    private boolean subscriptionRequired;
    private boolean rentalAvailable;
    private boolean purchaseAvailable;

    public StreamingProviderRequestDTO() {}

    // Getters and Setters
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
}
