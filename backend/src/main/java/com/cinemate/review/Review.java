package com.cinemate.review;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "reviews")
public class Review {

    @Id
    private java.lang.String id;
    private java.lang.String userId;
    private java.lang.String itemId;
    private double rating;
    private java.lang.String comment;
    private Date date;

    public Review(java.lang.String id, java.lang.String userId, java.lang.String itemId, double rating, java.lang.String comment, Date date) {
        this.id = id;
        this.userId = userId;
        this.itemId = itemId;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
    }

    public java.lang.String getId() {
        return id;
    }

    public void setId(java.lang.String id) {
        this.id = id;
    }

    public java.lang.String getUserId() {
        return userId;
    }

    public void setUserId(java.lang.String userId) {
        this.userId = userId;
    }

    public java.lang.String getItemId() {
        return itemId;
    }

    public void setItemId(java.lang.String itemId) {
        this.itemId = itemId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public java.lang.String getComment() {
        return comment;
    }

    public void setComment(java.lang.String comment) {
        this.comment = comment;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

}
