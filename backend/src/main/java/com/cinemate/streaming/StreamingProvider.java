package com.cinemate.streaming;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "streaming_providers")
@Getter
@Setter
@NoArgsConstructor
public class StreamingProvider {
    
    @Id
    private String id;
    @NotNull
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
}
