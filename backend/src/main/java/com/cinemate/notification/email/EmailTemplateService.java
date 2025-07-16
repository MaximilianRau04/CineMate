package com.cinemate.notification.email;

import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    /**
     * Creates HTML email template for notifications
     * @param title - notification title
     * @param message - notification message
     * @param actionUrl - optional action URL
     * @param actionText - optional action button text
     * @return formatted HTML email
     */
    public String createNotificationEmailTemplate(String title, String message, String actionUrl, String actionText) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CineMate Benachrichtigung</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; }
                    .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; line-height: 1.6; }
                    .action-button { 
                        display: inline-block; 
                        background-color: #e50914; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        margin: 20px 0; 
                    }
                    .footer { 
                        background-color: #f8f8f8; 
                        padding: 20px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #666; 
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎬 CineMate</h1>
                    </div>
                    <div class="content">
                        <h2>%s</h2>
                        <p>%s</p>
                        %s
                    </div>
                    <div class="footer">
                        <p>Du erhältst diese E-Mail, weil du Benachrichtigungen in deinen CineMate-Einstellungen aktiviert hast.</p>
                        <p><a href="http://localhost:3000/profile">Benachrichtigungseinstellungen verwalten</a></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                title, 
                message, 
                actionUrl != null && actionText != null ? 
                    "<a href=\"" + actionUrl + "\" class=\"action-button\">" + actionText + "</a>" : ""
            );
    }

    /**
     * Creates a weekly summary email template
     * @param userName - user's name
     * @param upcomingMovies - number of upcoming movies
     * @param upcomingSeries - number of upcoming series
     * @param content - detailed content
     * @return formatted HTML email
     */
    public String createWeeklySummaryTemplate(String userName, int upcomingMovies, int upcomingSeries, String content) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CineMate Wöchentliche Zusammenfassung</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
                    .stats { display: flex; justify-content: space-around; padding: 20px; background-color: #f8f8f8; }
                    .stat-item { text-align: center; }
                    .stat-number { font-size: 24px; font-weight: bold; color: #e50914; }
                    .content { padding: 20px; line-height: 1.6; }
                    .footer { 
                        background-color: #f8f8f8; 
                        padding: 20px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #666; 
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎬 CineMate</h1>
                        <h2>Deine wöchentliche Zusammenfassung</h2>
                    </div>
                    <div class="stats">
                        <div class="stat-item">
                            <div class="stat-number">%d</div>
                            <div>Neue Filme</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">%d</div>
                            <div>Neue Serien</div>
                        </div>
                    </div>
                    <div class="content">
                        <h3>Hallo %s!</h3>
                        <p>Hier ist deine wöchentliche Zusammenfassung der kommenden Veröffentlichungen aus deiner Watchlist:</p>
                        %s
                        <p><a href="http://localhost:3000/watchlist" style="color: #e50914;">→ Zur Watchlist</a></p>
                    </div>
                    <div class="footer">
                        <p>Du erhältst diese E-Mail, weil du wöchentliche Benachrichtigungen aktiviert hast.</p>
                        <p><a href="http://localhost:3000/profile">Benachrichtigungseinstellungen verwalten</a></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(upcomingMovies, upcomingSeries, userName, content);
    }

    /**
     * Creates milestone email template
     * @param userName - user's name
     * @param milestoneType - type of milestone
     * @param count - milestone count
     * @return formatted HTML email
     */
    public String createMilestoneTemplate(String userName, String milestoneType, int count) {
        String emoji = getMilestoneEmoji(milestoneType);
        String description = getMilestoneDescription(milestoneType, count);
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CineMate Meilenstein</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
                    .milestone { 
                        text-align: center; 
                        padding: 40px 20px; 
                        background: linear-gradient(135deg, #e50914, #ff6b35); 
                        color: white; 
                    }
                    .milestone-number { font-size: 48px; font-weight: bold; margin: 10px 0; }
                    .milestone-emoji { font-size: 64px; margin-bottom: 20px; }
                    .content { padding: 20px; line-height: 1.6; text-align: center; }
                    .footer { 
                        background-color: #f8f8f8; 
                        padding: 20px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #666; 
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎬 CineMate</h1>
                    </div>
                    <div class="milestone">
                        <div class="milestone-emoji">%s</div>
                        <h2>Glückwunsch, %s!</h2>
                        <div class="milestone-number">%d</div>
                        <h3>%s</h3>
                    </div>
                    <div class="content">
                        <p>Du hast einen neuen Meilenstein erreicht! Weiter so!</p>
                        <p><a href="http://localhost:3000/profile" style="color: #e50914;">→ Dein Profil ansehen</a></p>
                    </div>
                    <div class="footer">
                        <p>Du erhältst diese E-Mail, weil du Meilenstein-Benachrichtigungen aktiviert hast.</p>
                        <p><a href="http://localhost:3000/profile">Benachrichtigungseinstellungen verwalten</a></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(emoji, userName, count, description);
    }

    private String getMilestoneEmoji(String milestoneType) {
        return switch (milestoneType) {
            case "movies_watched" -> "🎬";
            case "series_watched" -> "📺";
            case "reviews_written" -> "⭐";
            case "watchlist_size" -> "📋";
            default -> "🏆";
        };
    }

    private String getMilestoneDescription(String milestoneType, int count) {
        return switch (milestoneType) {
            case "movies_watched" -> "Filme geschaut";
            case "series_watched" -> "Serien geschaut";
            case "reviews_written" -> "Bewertungen geschrieben";
            case "watchlist_size" -> "Einträge in der Watchlist";
            default -> "Meilenstein erreicht";
        };
    }

    /**
     * Creates recommendation email template
     * @param userName - user's name
     * @param title - recommendation title
     * @param message - recommendation message
     * @param itemId - item ID
     * @param itemType - "movie" or "series"
     * @param posterUrl - poster image URL
     * @param reason - recommendation reason
     * @param score - recommendation score (0.0 - 1.0)
     * @return formatted HTML email
     */
    public String createRecommendationTemplate(String userName, String title, String message, String itemId, String itemType, String posterUrl, String reason, double score) {
        String actionUrl = itemId != null ? 
            ("movie".equals(itemType) ? "http://localhost:3000/movies/" + itemId : "http://localhost:3000/series/" + itemId) :
            "http://localhost:3000/explore";
            
        String actionText = itemId != null ? 
            ("movie".equals(itemType) ? "Film ansehen" : "Serie ansehen") :
            "Alle Empfehlungen";

        int scorePercentage = (int) (score * 100);
        String posterImage = posterUrl != null && !posterUrl.isEmpty() ? 
            "<img src=\"" + posterUrl + "\" alt=\"Poster\" style=\"max-width: 200px; height: auto; border-radius: 8px; margin: 20px 0;\"/>" : "";

        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CineMate Empfehlung</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
                    .recommendation { 
                        text-align: center; 
                        padding: 30px 20px; 
                        background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
                        color: white; 
                    }
                    .score-badge { 
                        display: inline-block; 
                        background-color: #e50914; 
                        color: white; 
                        padding: 5px 15px; 
                        border-radius: 20px; 
                        font-weight: bold; 
                        margin: 10px 0;
                    }
                    .content { padding: 20px; line-height: 1.6; }
                    .reason-box { 
                        background-color: #f8f9fa; 
                        border-left: 4px solid #e50914; 
                        padding: 15px; 
                        margin: 20px 0; 
                        font-style: italic;
                    }
                    .action-button { 
                        display: inline-block; 
                        background-color: #e50914; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        margin: 20px 0; 
                        font-weight: bold;
                    }
                    .footer { 
                        background-color: #f8f8f8; 
                        padding: 20px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #666; 
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎬 CineMate</h1>
                        <p>Persönliche Empfehlung für %s</p>
                    </div>
                    <div class="recommendation">
                        <h2>✨ %s</h2>
                        %s
                        <div class="score-badge">%d%% Match</div>
                    </div>
                    <div class="content">
                        <p>%s</p>
                        
                        %s
                        
                        <div style="text-align: center;">
                            <a href="%s" class="action-button">%s</a>
                        </div>
                        
                        <p style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:3000/explore" style="color: #e50914;">→ Weitere Empfehlungen entdecken</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>Du erhältst diese E-Mail, weil du Empfehlungsbenachrichtigungen aktiviert hast.</p>
                        <p><a href="http://localhost:3000/profile">Benachrichtigungseinstellungen verwalten</a></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                userName,
                title.replace("Neue Empfehlung: ", ""),
                posterImage,
                scorePercentage,
                message,
                reason != null && !reason.isEmpty() ? 
                    "<div class=\"reason-box\"><strong>Warum diese Empfehlung?</strong><br/>" + reason + "</div>" : "",
                actionUrl,
                actionText
            );
    }
}
