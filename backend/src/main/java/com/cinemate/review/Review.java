package com.cinemate.review;

import com.cinemate.review.DTOs.ReviewRequestDTO;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    @NotNull
    private String userId;
    @NotNull
    private String itemId;
    private double rating;
    private String comment;
    private Date date;

    public Review(ReviewRequestDTO review) {
        this.id = review.getId();
        this.userId = review.getUserId();
        this.itemId = review.getItemId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.date = new Date();
    }

}
