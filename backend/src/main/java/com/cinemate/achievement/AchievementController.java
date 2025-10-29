package com.cinemate.achievement;

import com.cinemate.achievement.DTOs.AchievementDTO;
import com.cinemate.achievement.DTOs.UserAchievementDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:3000")
public class AchievementController {

    private final AchievementService achievementService;

    @Autowired
    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    /**
     * Get all available achievements
     *
     * @return a ResponseEntity containing a list of AchievementDTO objects if successful,
     */
    @GetMapping
    public ResponseEntity<List<AchievementDTO>> getAllAchievements() {
        return achievementService.getAllAchievements();
    }

    /**
     * Get user's achievements (both unlocked and in progress)
     *
     * @return a ResponseEntity containing a list of AchievementDTO objects if successful,
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAchievementDTO>> getUserAchievements(@PathVariable String userId) {
        return achievementService.getUserAchievements(userId);
    }

    /**
     * Get only unlocked achievements for a user
     *
     * @return a ResponseEntity containing a list of AchievementDTO objects if successful,
     */
    @GetMapping("/user/{userId}/unlocked")
    public ResponseEntity<List<UserAchievementDTO>> getUserUnlockedAchievements(@PathVariable String userId) {
        return achievementService.getUserUnlockedAchievements(userId);
    }

    /**
     * Get achievement statistics for a user
     *
     * @return a ResponseEntity containing a AchievementStatsDTO object if successful,
     */
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<AchievementService.AchievementStatsDTO> getUserAchievementStats(@PathVariable String userId) {
        return achievementService.getUserAchievementStats(userId);
    }

    /**
     * Manually trigger achievement check for a user (for testing/admin purposes)
     *
     * @return A ResponseEntity containing a success message if the initialization
     */
    @PostMapping("/user/{userId}/check")
    public ResponseEntity<String> checkUserAchievements(@PathVariable String userId) {
        try {
            achievementService.checkUserAchievements(userId);
            return ResponseEntity.ok("Achievements checked successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error checking achievements: " + e.getMessage());
        }
    }

    /**
     * Initializes the default achievements in the application. This method is used
     * to setup the initial set of achievements in the database if none exist.
     *
     * @return A ResponseEntity containing a success message if the initialization
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeDefaultAchievements() {
        try {
            achievementService.initializeDefaultAchievements();
            return ResponseEntity.ok("Default achievements initialized successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error initializing achievements: " + e.getMessage());
        }
    }
}
