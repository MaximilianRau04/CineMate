package com.cinemate.streaming;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(collection = "streaming_availability")
@Getter
@Setter
public class StreamingAvailability {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
}
