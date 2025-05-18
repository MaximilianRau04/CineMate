package com.cinemate.review.DTOs;


public class ReviewRequestDTO {
    private String id;
    private String userId;
    private String itemId;
    private double rating;
    private String comment;
    private String type;

    public ReviewRequestDTO(String id, String userId, java.lang.String itemId, double rating, String comment, String type) {
        this.id = id;
        this.userId = userId;
        this.itemId = itemId;
        this.rating = rating;
        this.comment = comment;
        this.type = type;
    }

    ReviewRequestDTO() {}

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
