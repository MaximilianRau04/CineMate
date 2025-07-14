package com.cinemate.streaming;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "streaming_providers")
public class StreamingProvider {
    
    @Id
    private String id;
    private String name;
    @Field("logo_url")
    private String logoUrl;
    @Field("website_url")
    private String websiteUrl;
    private String country;
    @Field("subscription_required")
    private boolean subscriptionRequired;
    @Field("rental_available")
    private boolean rentalAvailable;
    @Field("purchase_available")
    private boolean purchaseAvailable;
    @Field("active")
    private boolean active = true;

    public StreamingProvider() {}

    public StreamingProvider(String name, String logoUrl, String websiteUrl, String country, 
                           boolean subscriptionRequired, boolean rentalAvailable, boolean purchaseAvailable) {
        this.name = name;
        this.logoUrl = logoUrl;
        this.websiteUrl = websiteUrl;
        this.country = country;
        this.subscriptionRequired = subscriptionRequired;
        this.rentalAvailable = rentalAvailable;
        this.purchaseAvailable = purchaseAvailable;
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
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
