package com.cinemate.streaming.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StreamingProviderRequestDTO {
    
    @NotNull
    private String name;
    private String logoUrl;
    private String websiteUrl;
    private String country;
    private boolean subscriptionRequired;
    private boolean rentalAvailable;
    private boolean purchaseAvailable;

}
