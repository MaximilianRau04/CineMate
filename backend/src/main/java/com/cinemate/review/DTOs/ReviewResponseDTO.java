package com.cinemate.review.DTOs;

import com.cinemate.review.Review;

import java.util.Date;

public class ReviewResponseDTO {
    private String id;
    private String itemId;
    private double rating;
    private String comment;
    private Date date;

    public ReviewResponseDTO(String id, String itemId, double rating, String comment, Date date) {
        this.id = id;
        this.itemId = itemId;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
    }

    public ReviewResponseDTO() {
    }
    
    public ReviewResponseDTO(Review review) {
        this.id = review.getId();
        this.itemId = review.getItemId();
        this.comment = review.getComment();
        this.rating = review.getRating();
        this.date = review.getDate();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }
}
