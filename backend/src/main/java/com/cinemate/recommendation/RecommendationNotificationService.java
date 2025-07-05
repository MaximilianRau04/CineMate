package com.cinemate.recommendation;

import com.cinemate.notification.Notification;
import com.cinemate.notification.NotificationService;
import com.cinemate.notification.NotificationType;
import com.cinemate.recommendation.DTOs.RecommendationResponseDTO;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RecommendationNotificationService {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Sends personalized recommendations as notifications to a user
     * @param userId The user's ID
     * @param maxRecommendations Maximum number of recommendations per notification
     */
    public void sendRecommendationNotifications(String userId, int maxRecommendations) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return;
        }

        User user = userOpt.get();
        
        // Check if user has recommendation notifications enabled
        if (!shouldSendRecommendationNotification(user)) {
            return;
        }

        List<RecommendationResponseDTO> recommendations = recommendationService.getRecommendationsForUser(userId);
        
        if (recommendations.isEmpty()) {
            return;
        }

        // Send only the best recommendations
        List<RecommendationResponseDTO> topRecommendations = recommendations.stream()
                .limit(maxRecommendations)
                .toList();

        // Create individual notifications for each recommendation
        for (RecommendationResponseDTO recommendation : topRecommendations) {
            sendSingleRecommendationNotification(user, recommendation);
        }
    }

    /**
     * Sends a single recommendation notification
     * @param user The user
     * @param recommendation The recommendation
     */
    private void sendSingleRecommendationNotification(User user, RecommendationResponseDTO recommendation) {
        String title = String.format("Neue Empfehlung: %s", recommendation.getTitle());
        String message = String.format("Wir empfehlen dir %s '%s'. %s", 
                recommendation.getType().equals("movie") ? "den Film" : "die Serie",
                recommendation.getTitle(),
                recommendation.getReason());

        // Metadata for the notification
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("score", recommendation.getScore());
        metadata.put("reason", recommendation.getReason());
        metadata.put("posterUrl", recommendation.getPosterUrl());

        // Create and send notification with metadata
        Notification notification = notificationService.createNotificationWithMetadata(
                user.getId(),
                NotificationType.RECOMMENDATION,
                title,
                message,
                recommendation.getId(),
                recommendation.getType(),
                metadata
        );

        notificationService.sendNotification(notification.getId());
    }

    /**
     * Sends a summary notification with multiple recommendations
     * @param user The user
     * @param recommendations The list of recommendations
     */
    private void sendSummaryRecommendationNotification(User user, List<RecommendationResponseDTO> recommendations) {
        String title = "Neue personalisierte Empfehlungen für dich!";
        
        StringBuilder messageBuilder = new StringBuilder();
        messageBuilder.append("Wir haben ").append(recommendations.size()).append(" neue Empfehlungen für dich:\n\n");
        
        for (RecommendationResponseDTO rec : recommendations) {
            messageBuilder.append("• ").append(rec.getTitle())
                    .append(" (").append(rec.getType().equals("movie") ? "Film" : "Serie").append(")\n");
        }

        // Metadata with all recommendations
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("recommendations", recommendations);
        metadata.put("count", recommendations.size());

        // Create and send notification with metadata
        Notification notification = notificationService.createNotificationWithMetadata(
                user.getId(),
                NotificationType.RECOMMENDATION,
                title,
                messageBuilder.toString(),
                null,
                "recommendations",
                metadata
        );

        notificationService.sendNotification(notification.getId());
    }

    /**
     * Sends recommendations to all users
     * @param maxRecommendationsPerUser Maximum number of recommendations per user
     */
    public void sendRecommendationNotificationsToAllUsers(int maxRecommendationsPerUser) {
        List<User> users = userRepository.findAll();
        
        users.forEach(user -> {
            try {
                sendRecommendationNotifications(user.getId(), maxRecommendationsPerUser);
            } catch (Exception e) {
                System.err.println("Error sending recommendation notifications to user " + 
                        user.getId() + ": " + e.getMessage());
            }
        });
    }

    /**
     * Checks if recommendation notifications should be sent to the user
     * @param user The user
     * @return true if notifications should be sent
     */
    private boolean shouldSendRecommendationNotification(User user) {
        // Check if user has notifications enabled in general
        if (!user.isWebNotificationsEnabled() && !user.isEmailNotificationsEnabled()) {
            return false;
        }

        // Check if user has specifically enabled recommendation notifications
        return user.getNotificationPreferences().stream()
                .filter(pref -> pref.getType() == NotificationType.RECOMMENDATION)
                .findFirst()
                .map(pref -> pref.isWebEnabled() || pref.isEmailEnabled())
                .orElse(true);
    }

    /**
     * Sends immediate recommendations based on new user activity
     * @param userId The user's ID
     * @param trigger The trigger for the recommendation (e.g. "new_favorite", "new_rating")
     */
    public void sendTriggeredRecommendations(String userId, String trigger) {
        sendRecommendationNotifications(userId, 3);
    }
}
