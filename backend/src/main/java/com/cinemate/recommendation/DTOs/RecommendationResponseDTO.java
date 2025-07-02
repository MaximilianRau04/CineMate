package com.cinemate.recommendation.DTOs;

public class RecommendationResponseDTO {
    private String id;
    private String title;
    private String type;
    private double score;
    private String reason;
    private String posterUrl;

    public RecommendationResponseDTO(String id, String title, String type, double score, String reason, String posterUrl) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.score = score;
        this.reason = reason;
        this.posterUrl = posterUrl;
    }

    public RecommendationResponseDTO() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
}
