package com.cinemate.notification;

import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/notifications")
@CrossOrigin(origins = "*")
public class AdminNotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Send notification to specific user or all users
     * @param request
     * @param authentication
     * @return ResponseEntity
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestBody NotificationRequest request, Authentication authentication) {
        // TODO: Re-enable admin check when authentication is properly configured
        // if (!isAdmin(authentication)) {
        //     return ResponseEntity.status(403).body("Nur Admins können Benachrichtigungen senden");
        // }

        try {
            notificationService.sendAdminNotification(
                NotificationType.ADMIN_NOTIFICATION,
                request.getTitle(),
                request.getMessage(),
                request.getTargetUserId()
            );

            String target = request.getTargetUserId() != null ? "an einen Benutzer" : "an alle Benutzer";
            return ResponseEntity.ok().body("Benachrichtigung erfolgreich " + target + " gesendet");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fehler beim Senden der Benachrichtigung: " + e.getMessage());
        }
    }

    /**
     * Get all users for admin panel dropdown
     * @param authentication
     * @return ResponseEntity
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        // TODO: Re-enable admin check when authentication is properly configured
        // if (!isAdmin(authentication)) {
        //     return ResponseEntity.status(403).body("Nur Admins können Benutzerlisten abrufen");
        // }

        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users.stream()
                .map(user -> Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()
                ))
                .toList());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fehler beim Laden der Benutzerliste: " + e.getMessage());
        }
    }

    /**
     * Check if the authenticated user is an admin
     * @param authentication
     * @return boolean
     */
    private boolean isAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        String username;

        if (principal instanceof String) {
            username = (String) principal;
        } else if (principal instanceof User) {
            username = ((User) principal).getUsername();
        } else {
            return false;
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.isPresent() && "ADMIN".equals(userOpt.get().getRole());
    }

    /**
     * DTO for notification requests from admin panel
     */
    public static class NotificationRequest {
        private String title;
        private String message;
        private String targetUserId;

        public NotificationRequest() {}

        public NotificationRequest(String title, String message, String targetUserId) {
            this.title = title;
            this.message = message;
            this.targetUserId = targetUserId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getTargetUserId() {
            return targetUserId;
        }

        public void setTargetUserId(String targetUserId) {
            this.targetUserId = targetUserId;
        }
    }
}
