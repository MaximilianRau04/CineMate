package com.cinemate.notification;

import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notification-preferences")
@CrossOrigin(origins = "*")
public class NotificationPreferenceController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get notification preferences for a user
     * @param userId
     * @return List of notification preferences
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationPreference>> getUserNotificationPreferences(@PathVariable String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        List<NotificationPreference> preferences = user.getNotificationPreferences();

        if (preferences.isEmpty()) {
            preferences = createDefaultPreferences();
            user.setNotificationPreferences(preferences);
            userRepository.save(user);
        }

        return ResponseEntity.ok(preferences);
    }

    /**
     * Update notification preferences for a user
     * @param userId
     * @param preferences
     * @return Updated preferences
     */
    @PutMapping("/user/{userId}")
    public ResponseEntity<List<NotificationPreference>> updateUserNotificationPreferences(
            @PathVariable String userId, 
            @RequestBody List<NotificationPreference> preferences) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setNotificationPreferences(preferences);
        userRepository.save(user);

        return ResponseEntity.ok(preferences);
    }

    /**
     * Update global notification settings for a user
     * @param userId
     * @param settings
     * @return ResponseEntity
     */
    @PutMapping("/user/{userId}/global")
    public ResponseEntity<Map<String, Boolean>> updateGlobalNotificationSettings(
            @PathVariable String userId, 
            @RequestBody Map<String, Boolean> settings) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        
        if (settings.containsKey("emailNotificationsEnabled")) {
            user.setEmailNotificationsEnabled(settings.get("emailNotificationsEnabled"));
        }
        
        if (settings.containsKey("webNotificationsEnabled")) {
            user.setWebNotificationsEnabled(settings.get("webNotificationsEnabled"));
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "emailNotificationsEnabled", user.isEmailNotificationsEnabled(),
            "webNotificationsEnabled", user.isWebNotificationsEnabled()
        ));
    }

    /**
     * Get global notification settings for a user
     * @param userId
     * @return Global settings
     */
    @GetMapping("/user/{userId}/global")
    public ResponseEntity<Map<String, Boolean>> getGlobalNotificationSettings(@PathVariable String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
            "emailNotificationsEnabled", user.isEmailNotificationsEnabled(),
            "webNotificationsEnabled", user.isWebNotificationsEnabled()
        ));
    }

    /**
     * Get all available notification types
     * @return List of notification types
     */
    @GetMapping("/types")
    public ResponseEntity<NotificationType[]> getNotificationTypes() {
        return ResponseEntity.ok(NotificationType.values());
    }

    /**
     * Creates default notification preferences for a new user
     * @return List of default preferences
     */
    private List<NotificationPreference> createDefaultPreferences() {
        List<NotificationPreference> defaults = new ArrayList<>();

        for (NotificationType type : NotificationType.values()) {
            boolean isEmailEnabledByDefault = isEmailEnabledByDefault(type);
            defaults.add(new NotificationPreference(type, isEmailEnabledByDefault, true));
        }
        
        return defaults;
    }

    /**
     * Determines which notification types should have email enabled by default
     * @param type
     * @return boolean
     */
    private boolean isEmailEnabledByDefault(NotificationType type) {
        return switch (type) {
            case MOVIE_WATCHLIST_RELEASED,
                 SERIES_NEW_SEASON,
                 UPCOMING_RELEASES,
                 MILESTONE_REACHED,
                 NEW_USER_REGISTERED,
                 ADMIN_NOTIFICATION,
                 WELCOME_NEW_USER -> true;
            case WATCHLIST_ITEM_REVIEWED,
                 FAVORITE_ITEM_REVIEWED,
                 SYSTEM_ANNOUNCEMENT -> false;
            default -> true;
        };
    }
}
