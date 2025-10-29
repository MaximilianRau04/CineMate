package com.cinemate.review.DTOs;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {
    private String id;
    @NotNull
    private String userId;
    @NotNull
    private String itemId;
    private double rating;
    private String comment;
    private String type;

}
