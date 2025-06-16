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

    /**
     * check if the notification type is enabled
     * @param user
     * @param type
     * @param isEmail
     * @return boolean
     */
    private boolean isNotificationTypeEnabled(User user, NotificationType type, boolean isEmail) {
        return user.getNotificationPreferences().stream()
                .filter(pref -> pref.getType() == type)
                .findFirst()
                .map(pref -> isEmail ? pref.isEmailEnabled() : pref.isWebEnabled())
                .orElse(true);
    }

    /**
     * returns notifications of user
     * @param userId
     * @return List<Notification>
     */
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * returns unread notifications of user
     * @param userId
     * @return List<Notification>
     */
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    /**
     * returns count of unread notifications
     * @param userId
     * @return long
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    /**
     * crates a notification
     * @param userId
     * @param type
     * @param title
     * @param message
     * @return Notification
     */
    public Notification createNotification(String userId, NotificationType type, String title, String message) {
        Notification notification = new Notification(userId, type, title, message);
        return notificationRepository.save(notification);
    }

    /**
     * creates a notification with metadata
     * @param userId
     * @param type
     * @param title
     * @param message
     * @param itemId
     * @param itemType
     * @param metadata
     * @return Notification
     */
    public Notification createNotificationWithMetadata(String userId, NotificationType type, String title,
                                                       String message, String itemId, String itemType,
                                                       Map<String, Object> metadata) {
        Notification notification = new Notification(userId, type, title, message);
        notification.setItemId(itemId);
        notification.setItemType(itemType);
        notification.setMetadata(metadata);
        return notificationRepository.save(notification);
    }

    /**
     * sends a notification
     * @param notificationId
     */
    @Async
    public void sendNotification(String notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isEmpty()) return;

        Notification notification = notificationOpt.get();
        Optional<User> userOpt = userRepository.findById(notification.getUserId());
        if (userOpt.isEmpty()) return;

        User user = userOpt.get();

        boolean shouldSendEmail = user.isEmailNotificationsEnabled() && isNotificationTypeEnabled(user, notification.getType(), true);
        boolean shouldSendWeb = user.isWebNotificationsEnabled() && isNotificationTypeEnabled(user, notification.getType(), false);

        if (shouldSendEmail) {
            emailService.sendNotificationEmail(user.getEmail(), notification.getTitle(), notification.getMessage());
        }

        if (shouldSendWeb) {
            messagingTemplate.convertAndSendToUser(user.getId(), "/queue/notifications", notification);
        }

        notification.setSent(true);
        notification.setSentAt(new Date());
        notificationRepository.save(notification);
    }

    /**
     * mark a notification as read
     * @param notificationId
     */
    public void markAsRead(String notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            notification.setReadAt(new Date());
            notificationRepository.save(notification);
        }
    }

    /**
     * marks all notifications of user as read
     * @param userId
     */
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);

        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(new Date());
        });

        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * deletes a notification
     * @param notificationId
     */
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}

