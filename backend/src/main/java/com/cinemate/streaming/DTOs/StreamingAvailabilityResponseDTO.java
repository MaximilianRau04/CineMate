package com.cinemate.streaming.DTOs;

import com.cinemate.streaming.AvailabilityType;
import com.cinemate.streaming.MediaType;
import com.cinemate.streaming.StreamingAvailability;

import java.util.Date;

public class StreamingAvailabilityResponseDTO {
    
    private String id;
    private String mediaId;
    private MediaType mediaType;
    private StreamingProviderResponseDTO provider;
    private AvailabilityType availabilityType;
    private Double price;
    private String currency;
    private String quality;
    private String url;
    private Date availableFrom;
    private Date availableUntil;
    private String region;
    private Date lastUpdated;

    public StreamingAvailabilityResponseDTO() {}

    public StreamingAvailabilityResponseDTO(StreamingAvailability availability) {
        this.id = availability.getId();
        this.mediaId = availability.getMediaId();
        this.mediaType = availability.getMediaType();
        // Null-Check für Provider, da gelöschte Provider zu null führen können
        this.provider = availability.getProvider() != null ? 
            new StreamingProviderResponseDTO(availability.getProvider()) : null;
        this.availabilityType = availability.getAvailabilityType();
        this.price = availability.getPrice();
        this.currency = availability.getCurrency();
        this.quality = availability.getQuality();
        this.url = availability.getUrl();
        this.availableFrom = availability.getAvailableFrom();
        this.availableUntil = availability.getAvailableUntil();
        this.region = availability.getRegion();
        this.lastUpdated = availability.getLastUpdated();
    }

    // Getters and Setters
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

    public StreamingProviderResponseDTO getProvider() {
        return provider;
    }

    public void setProvider(StreamingProviderResponseDTO provider) {
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
