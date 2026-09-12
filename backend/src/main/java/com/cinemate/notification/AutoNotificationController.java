package com.cinemate.notification;

import com.cinemate.notification.scheduled.ScheduledNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class AutoNotificationController {

    private final AutoNotificationService autoNotificationService;
    private final ScheduledNotificationService scheduledNotificationService;

    /**
     * Manual trigger for milestone check of a user
     * @param userId - User-ID
     * @return ResponseEntity
     */
    @PostMapping("/check-milestones/{userId}")
    public ResponseEntity<String> checkMilestones(@PathVariable String userId) {
        autoNotificationService.checkAndNotifyMilestones(userId);
        return ResponseEntity.ok("Meilenstein-Überprüfung für User " + userId + " durchgeführt.");
    }

    /**
     *Manual trigger for weekly releases for a user
     * @param userId Die User-ID
     * @return ResponseEntity
     */
    @PostMapping("/upcoming-releases/{userId}")
    public ResponseEntity<String> sendUpcomingReleases(@PathVariable String userId) {
        autoNotificationService.notifyUpcomingReleases(userId);
        return ResponseEntity.ok("Wöchentliche Release-Benachrichtigung für User " + userId + " gesendet.");
    }

    /**
     * Manual trigger for all weekly notifications
     * @return ResponseEntity
     */
    @PostMapping("/trigger-weekly")
    public ResponseEntity<String> triggerWeeklyNotifications() {
        scheduledNotificationService.sendWeeklyUpcomingReleases();
        return ResponseEntity.ok("Wöchentliche Benachrichtigungen für alle User gesendet.");
    }

    /**
     * Manual trigger for daily release check
     * @return ResponseEntity
     */
    @PostMapping("/trigger-daily")
    public ResponseEntity<String> triggerDailyReleaseCheck() {
        scheduledNotificationService.checkDailyReleases();
        return ResponseEntity.ok("Tägliche Release-Überprüfung durchgeführt.");
    }
}
