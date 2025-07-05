package com.cinemate.recommendation;

import com.cinemate.recommendation.DTOs.RecommendationResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final RecommendationNotificationService recommendationNotificationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService, RecommendationNotificationService recommendationNotificationService) {
        this.recommendationService = recommendationService;
        this.recommendationNotificationService = recommendationNotificationService;
    }

    /**
     * return personal recommendations for a user
     * @param userId - id of the user
     * @return list of recommendations
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationResponseDTO>> getRecommendationsForUser(@PathVariable String userId) {
        List<RecommendationResponseDTO> recommendations = recommendationService.getRecommendationsForUser(userId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * returns popular/trending content (for new user)
     * @return list of recommendations
     */
    @GetMapping("/trending")
    public ResponseEntity<List<RecommendationResponseDTO>> getTrendingRecommendations() {
        List<RecommendationResponseDTO> trending = recommendationService.getTrendingRecommendations();
        return ResponseEntity.ok(trending);
    }

    /**
     * returns recommendations based on genre
     * @param genre - the desired genre
     * @return list of genre recommendations
     */
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<RecommendationResponseDTO>> getRecommendationsByGenre(@PathVariable String genre) {
        List<RecommendationResponseDTO> recommendations = recommendationService.getRecommendationsByGenre(genre);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * returns recommendations content-based + collaborative
     * @param userId - id of the user
     * @return list of recommendations
     */
    @GetMapping("/user/{userId}/hybrid")
    public ResponseEntity<List<RecommendationResponseDTO>> getHybridRecommendations(@PathVariable String userId) {
        List<RecommendationResponseDTO> recommendations = recommendationService.getHybridRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * returns smart-recommendations based on the time of the day
     * @param userId - id of the user
     * @return list of recommendations
     */
    @GetMapping("/user/{userId}/smart")
    public ResponseEntity<List<RecommendationResponseDTO>> getSmartRecommendations(@PathVariable String userId) {
        List<RecommendationResponseDTO> recommendations = recommendationService.getSmartRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * returns recommendations based on similar users and their preferences
     * @param userId - id of the user
     * @return list of recommendations
     */
    @GetMapping("/user/{userId}/collaborative")
    public ResponseEntity<List<RecommendationResponseDTO>> getCollaborativeRecommendations(@PathVariable String userId) {
        List<RecommendationResponseDTO> recommendations = recommendationService.getCollaborativeRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * sends recommendation notifications to a specific user
     * @param maxRecommendations - max number of notifications per user (optional, standard: 3)
     * @return Confirmation of success
     */
    @PostMapping("/notify/{userId}")
    public ResponseEntity<String> sendRecommendationNotifications(
            @PathVariable String userId,
            @RequestParam(defaultValue = "3") int maxRecommendations) {

        try {
            recommendationNotificationService.sendRecommendationNotifications(userId, maxRecommendations);
            return ResponseEntity.ok("Empfehlungsbenachrichtigungen erfolgreich gesendet für Benutzer: " + userId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler beim Senden der Empfehlungsbenachrichtigungen: " + e.getMessage());
        }
    }

    /**
     * sends recommendation notifications to all users
     * @param maxRecommendations - max number of notifications per user (optional, standard: 3)
     * @return Confirmation of success
     */
    @PostMapping("/notify/all")
    public ResponseEntity<String> sendRecommendationNotificationsToAll(
            @RequestParam(defaultValue = "3") int maxRecommendations) {

        try {
            recommendationNotificationService.sendRecommendationNotificationsToAllUsers(maxRecommendations);
            return ResponseEntity.ok("Empfehlungsbenachrichtigungen erfolgreich an alle Benutzer gesendet");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler beim Senden der Empfehlungsbenachrichtigungen: " + e.getMessage());
        }
    }

    /**
     * sends triggered recommendations based on user activity
     * @param userId - id of the user
     * @param trigger the trigger (e.g. "new_favorite", "new_rating")
     * @return Confirmation of success
     */
    @PostMapping("/notify/{userId}/triggered")
    public ResponseEntity<String> sendTriggeredRecommendations(
            @PathVariable String userId,
            @RequestParam String trigger) {

        try {
            recommendationNotificationService.sendTriggeredRecommendations(userId, trigger);
            return ResponseEntity.ok("Getriggerte Empfehlungsbenachrichtigungen erfolgreich gesendet für Benutzer: " + userId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler beim Senden der getriggerten Empfehlungsbenachrichtigungen: " + e.getMessage());
        }
    }
}
