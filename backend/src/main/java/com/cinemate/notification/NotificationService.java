package com.cinemate.notification;


import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Notification createNotification(String userId, NotificationType type, String title, String message) {
        Notification notification = new Notification(userId, type, title, message);
        return notificationRepository.save(notification);
    }

    public Notification createNotificationWithMetadata(String userId, NotificationType type, String title,
                                                       String message, String relatedItemId, String relatedItemType,
                                                       Map<String, Object> metadata) {
        Notification notification = new Notification(userId, type, title, message);
        notification.setItemId(relatedItemId);
        notification.setItemType(relatedItemType);
        notification.setMetadata(metadata);
        return notificationRepository.save(notification);
    }

    @Async
    public void sendNotification(String notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isEmpty()) return;

        Notification notification = notificationOpt.get();
        Optional<User> userOpt = userRepository.findById(notification.getUserId());
        if (userOpt.isEmpty()) return;

        User user = userOpt.get();

        // Check user preferences
        boolean shouldSendEmail = user.isEmailNotificationsEnabled() && isNotificationTypeEnabled(user, notification.getType(), true);
        boolean shouldSendWeb = user.isWebNotificationsEnabled() && isNotificationTypeEnabled(user, notification.getType(), false);

        // Send email notification
        if (shouldSendEmail) {
            emailService.sendNotificationEmail(user.getEmail(), notification.getTitle(), notification.getMessage());
        }

        // Send web notification via WebSocket
        if (shouldSendWeb) {
            messagingTemplate.convertAndSendToUser(user.getId(), "/queue/notifications", notification);
        }

        // Mark as sent
        notification.setSent(true);
        notification.setSentAt(new Date());
        notificationRepository.save(notification);
    }

    private boolean isNotificationTypeEnabled(User user, NotificationType type, boolean isEmail) {
        return user.getNotificationPreferences().stream()
                .filter(pref -> pref.getType() == type)
                .findFirst()
                .map(pref -> isEmail ? pref.isEmailEnabled() : pref.isWebEnabled())
                .orElse(true);
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            notification.setReadAt(new Date());
            notificationRepository.save(notification);
        }
    }

    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        LocalDateTime now = LocalDateTime.now();

        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(new Date());
        });

        notificationRepository.saveAll(unreadNotifications);
    }

    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}

