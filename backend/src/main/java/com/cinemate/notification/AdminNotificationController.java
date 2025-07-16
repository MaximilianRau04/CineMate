package com.cinemate.notification;

import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body("Nur Admins können Benachrichtigungen senden");
        }

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
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body("Nur Admins können Benutzerlisten abrufen");
        }

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
        
        if (principal instanceof User) {
            User user = (User) principal;
            return "ADMIN".equals(user.getRole().toString());
        }
        
        return false;
    }
}
