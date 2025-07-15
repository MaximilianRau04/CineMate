package com.cinemate.social.forum;

public enum ForumCategory {
    GENERAL("Allgemeine Diskussion"),
    MOVIE_DISCUSSION("Film-Diskussion"),
    SERIES_DISCUSSION("Serien-Diskussion"),
    RECOMMENDATIONS("Empfehlungen"),
    REVIEWS("Bewertungen"),
    NEWS("News & Updates"),
    OFF_TOPIC("Off-Topic");
    
    private final String displayName;
    
    ForumCategory(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
