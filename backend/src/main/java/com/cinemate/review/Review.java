package com.cinemate.review;

import com.cinemate.review.DTOs.ReviewRequestDTO;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;
    @NotNull
    private String userId;
    @NotNull
    private String itemId;
    private double rating;
    private String comment;
    private Date date;

    public Review(String id, String userId, String itemId, double rating, String comment, Date date) {
        this.id = id;
        this.userId = userId;
        this.itemId = itemId;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
    }

    public Review(ReviewRequestDTO review) {
        this.id = review.getId();
        this.userId = review.getUserId();
        this.itemId = review.getItemId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.date = new Date();
    }

    public Review() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

}
