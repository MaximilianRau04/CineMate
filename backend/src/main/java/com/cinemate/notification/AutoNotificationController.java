package com.cinemate.notification;

import com.cinemate.notification.scheduled.ScheduledNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class AutoNotificationController {

    @Autowired
    private AutoNotificationService autoNotificationService;

    @Autowired
    private ScheduledNotificationService scheduledNotificationService;

    /**
     * Manual trigger for milestone check of a user
     * @param userId - User-ID
     * @return ResponseEntity
     */
    @PostMapping("/check-milestones/{userId}")
    public ResponseEntity<String> checkMilestones(@PathVariable String userId) {
        try {
            autoNotificationService.checkAndNotifyMilestones(userId);
            return ResponseEntity.ok("Meilenstein-Überprüfung für User " + userId + " durchgeführt.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler bei Meilenstein-Überprüfung: " + e.getMessage());
        }
    }

    /**
     *Manual trigger for weekly releases for a user
     * @param userId Die User-ID
     * @return ResponseEntity
     */
    @PostMapping("/upcoming-releases/{userId}")
    public ResponseEntity<String> sendUpcomingReleases(@PathVariable String userId) {
        try {
            autoNotificationService.notifyUpcomingReleases(userId);
            return ResponseEntity.ok("Wöchentliche Release-Benachrichtigung für User " + userId + " gesendet.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler bei Release-Benachrichtigung: " + e.getMessage());
        }
    }

    /**
     * Manual trigger for all weekly notifications
     * @return ResponseEntity
     */
    @PostMapping("/trigger-weekly")
    public ResponseEntity<String> triggerWeeklyNotifications() {
        try {
            scheduledNotificationService.sendWeeklyUpcomingReleases();
            return ResponseEntity.ok("Wöchentliche Benachrichtigungen für alle User gesendet.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler bei wöchentlichen Benachrichtigungen: " + e.getMessage());
        }
    }
}
