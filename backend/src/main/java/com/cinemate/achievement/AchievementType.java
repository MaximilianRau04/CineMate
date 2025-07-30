package com.cinemate.achievement;

public enum AchievementType {
    REVIEWS("Bewertungen"),
    MOVIES_WATCHED("Filme geschaut"),
    SERIES_WATCHED("Serien geschaut"),
    TOTAL_HOURS("Gesamte Stunden"),
    FORUM_POSTS("Forum-Beiträge"),
    FORUM_REPLIES("Forum-Antworten"),
    FRIENDS("Freunde"),
    GENRES("Verschiedene Genres"),
    CONSECUTIVE_DAYS("Aufeinanderfolgende Tage"),
    RATINGS_GIVEN("Bewertungen vergeben"),
    SOCIAL_INTERACTIONS("Soziale Interaktionen"),
    MILESTONE("Meilenstein");

    private final String displayName;

    AchievementType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
