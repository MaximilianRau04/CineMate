package com.cinemate.recommendation.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponseDTO {
    private String id;
    private String title;
    private String type;
    private double score;
    private String reason;
    private String posterUrl;
}
