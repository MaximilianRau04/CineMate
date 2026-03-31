package com.cinemate.notification.scheduled;

import com.cinemate.notification.Notification;
import com.cinemate.notification.NotificationRepository;
import com.cinemate.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailRetryService {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    /**
     * Retries failed email notifications
     * Runs every hour to check for unsent notifications older than 5 minutes
     */
    @Scheduled(fixedRate = 3600000)
    public void retryFailedEmails() {
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        
        List<Notification> unsentNotifications = notificationRepository
            .findBySentFalseAndCreatedAtBefore(fiveMinutesAgo);
        
        if (!unsentNotifications.isEmpty()) {
            log.info("Retrying " + unsentNotifications.size() + " failed email notifications...");
            
            for (Notification notification : unsentNotifications) {
                try {
                    notificationService.sendNotification(notification.getId());
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.error("Email retry interrupted");
                    break;
                } catch (Exception e) {
                    log.error("Failed to retry notification " + notification.getId() + ": " + e.getMessage());
                }
            }
        }
    }
}
