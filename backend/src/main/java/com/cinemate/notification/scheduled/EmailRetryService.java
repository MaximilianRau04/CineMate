package com.cinemate.notification.scheduled;

import com.cinemate.notification.Notification;
import com.cinemate.notification.NotificationRepository;
import com.cinemate.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmailRetryService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

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
            System.out.println("Retrying " + unsentNotifications.size() + " failed email notifications...");
            
            for (Notification notification : unsentNotifications) {
                try {
                    notificationService.sendNotification(notification.getId());
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.err.println("Email retry interrupted");
                    break;
                } catch (Exception e) {
                    System.err.println("Failed to retry notification " + notification.getId() + ": " + e.getMessage());
                }
            }
        }
    }
}
