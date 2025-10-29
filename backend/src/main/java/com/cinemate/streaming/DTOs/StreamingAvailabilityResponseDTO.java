package com.cinemate.streaming.DTOs;

import com.cinemate.streaming.AvailabilityType;
import com.cinemate.streaming.MediaType;
import com.cinemate.streaming.StreamingAvailability;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
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

    public StreamingAvailabilityResponseDTO(StreamingAvailability availability) {
        this.id = availability.getId();
        this.mediaId = availability.getMediaId();
        this.mediaType = availability.getMediaType();
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
}
