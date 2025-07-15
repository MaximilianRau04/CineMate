package com.cinemate.social.points;

public enum PointsType {
    REVIEW(10),
    WATCH(5),
    SOCIAL(15),
    ACHIEVEMENT(25);
    
    private final int defaultPoints;
    
    PointsType(int defaultPoints) {
        this.defaultPoints = defaultPoints;
    }
    
    public int getDefaultPoints() {
        return defaultPoints;
    }
}
