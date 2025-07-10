package com.cinemate.streaming;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(collection = "streaming_availability")
public class StreamingAvailability {
    
    @Id
    private String id;
    @Field("media_id")
    private String mediaId;
    @Field("media_type")
    private MediaType mediaType;
    @DBRef
    private StreamingProvider provider;
    @Field("availability_type")
    private AvailabilityType availabilityType;
    private Double price;
    private String currency;
    private String quality;
    private String url;
    @Field("available_from")
    private Date availableFrom;
    @Field("available_until")
    private Date availableUntil;
    @Field("region")
    private String region;
    @Field("last_updated")
    private Date lastUpdated;

    public StreamingAvailability() {
        this.lastUpdated = new Date();
    }

    public StreamingAvailability(String mediaId, MediaType mediaType, StreamingProvider provider, 
                               AvailabilityType availabilityType, String region) {
        this.mediaId = mediaId;
        this.mediaType = mediaType;
        this.provider = provider;
        this.availabilityType = availabilityType;
        this.region = region;
        this.lastUpdated = new Date();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMediaId() {
        return mediaId;
    }

    public void setMediaId(String mediaId) {
        this.mediaId = mediaId;
    }

    public MediaType getMediaType() {
        return mediaType;
    }

    public void setMediaType(MediaType mediaType) {
        this.mediaType = mediaType;
    }

    public StreamingProvider getProvider() {
        return provider;
    }

    public void setProvider(StreamingProvider provider) {
        this.provider = provider;
    }

    public AvailabilityType getAvailabilityType() {
        return availabilityType;
    }

    public void setAvailabilityType(AvailabilityType availabilityType) {
        this.availabilityType = availabilityType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Date getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(Date availableFrom) {
        this.availableFrom = availableFrom;
    }

    public Date getAvailableUntil() {
        return availableUntil;
    }

    public void setAvailableUntil(Date availableUntil) {
        this.availableUntil = availableUntil;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
