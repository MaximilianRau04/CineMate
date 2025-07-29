package com.cinemate.notification;

import com.cinemate.notification.email.EmailService;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.cinemate.user.Role.ADMIN;

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
            sendEmailForNotificationType(notification, user);
        }

        if (shouldSendWeb) {
            messagingTemplate.convertAndSendToUser(user.getId(), "/queue/notifications", notification);
        }

        notification.setSent(true);
        notification.setSentAt(new Date());
        notificationRepository.save(notification);
    }

    /**
     * Creates and sends a notification in one step
     * @param userId
     * @param type
     * @param title
     * @param message
     */
    @Async
    public void sendNotification(String userId, NotificationType type, String title, String message) {
        Notification notification = createNotification(userId, type, title, message);
        sendNotification(notification.getId());
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
     * deletes a notification by id
     * @param notificationId
     */
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    /**
     * deletes all notifications for a specific user
     * @param userId
     */
    public void deleteAllUserNotifications(String userId) {
        List<Notification> userNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notificationRepository.deleteAll(userNotifications);
    }

    /**
     * Sends specialized emails based on a notification type
     * @param notification
     * @param user
     */
    private void sendEmailForNotificationType(Notification notification, User user) {
        String actionUrl = null;
        String actionText = null;

        if (notification.getItemId() != null) {
            switch (notification.getType()) {
                case MOVIE_WATCHLIST_RELEASED:
                case WATCHLIST_ITEM_REVIEWED:
                    if ("movie".equals(notification.getItemType())) {
                        actionUrl = "http://localhost:3000/movies/" + notification.getItemId();
                        actionText = "Film ansehen";
                    }
                    break;
                case SERIES_NEW_SEASON:
                case SERIES_NEW_EPISODE:
                case SERIES_STATUS_CHANGED:
                    if ("series".equals(notification.getItemType())) {
                        actionUrl = "http://localhost:3000/series/" + notification.getItemId();
                        actionText = "Serie ansehen";
                    }
                    break;
                case MILESTONE_REACHED:
                    actionUrl = "http://localhost:3000/profile";
                    actionText = "Profil ansehen";
                    break;
                case UPCOMING_RELEASES:
                    actionUrl = "http://localhost:3000/watchlist";
                    actionText = "Zur Watchlist";
                    break;
                case RECOMMENDATION:
                    if ("movie".equals(notification.getItemType())) {
                        actionUrl = "http://localhost:3000/movies/" + notification.getItemId();
                        actionText = "Film ansehen";
                    } else if ("series".equals(notification.getItemType())) {
                        actionUrl = "http://localhost:3000/series/" + notification.getItemId();
                        actionText = "Serie ansehen";
                    } else if ("recommendations".equals(notification.getItemType())) {
                        actionUrl = "http://localhost:3000/explore";
                        actionText = "Alle Empfehlungen ansehen";
                    }
                    break;
                default:
                    break;
            }
        }

        switch (notification.getType()) {
            case MILESTONE_REACHED:
                if (notification.getMetadata() != null) {
                    String milestoneType = (String) notification.getMetadata().get("milestoneType");
                    Integer count = (Integer) notification.getMetadata().get("count");
                    if (milestoneType != null && count != null) {
                        emailService.sendMilestoneEmail(user.getId(), milestoneType, count);
                        return;
                    }
                }
                break;
            case UPCOMING_RELEASES:
                if (notification.getMetadata() != null) {
                    Integer upcomingMovies = (Integer) notification.getMetadata().get("upcomingMovies");
                    Integer upcomingSeries = (Integer) notification.getMetadata().get("upcomingSeries");
                    if (upcomingMovies != null && upcomingSeries != null) {
                        emailService.sendWeeklySummaryEmail(
                            user.getId(), 
                            notification.getTitle(), 
                            notification.getMessage(),
                            upcomingMovies,
                            upcomingSeries
                        );
                        return;
                    }
                }
                break;
            case RECOMMENDATION:
                if (notification.getMetadata() != null) {
                    String posterUrl = (String) notification.getMetadata().get("posterUrl");
                    String reason = (String) notification.getMetadata().get("reason");
                    Double score = (Double) notification.getMetadata().get("score");
                    
                    emailService.sendRecommendationEmail(
                        user.getId(),
                        notification.getTitle(),
                        notification.getMessage(),
                        notification.getItemId(),
                        notification.getItemType(),
                        posterUrl,
                        reason,
                        score != null ? score : 0.0
                    );
                    return;
                }
                break;
            default:
                break;
        }

        emailService.sendTemplatedNotificationEmail(
            user.getEmail(), 
            notification.getTitle(), 
            notification.getMessage(),
            actionUrl,
            actionText
        );
    }

    /**
     * Sends notification to all admin users
     * @param type
     * @param title
     * @param message
     */
    @Async
    public void sendNotificationToAdmins(NotificationType type, String title, String message) {
        List<User> adminUsers = userRepository.findByRole(ADMIN);
        
        for (User admin : adminUsers) {
            try {
                sendNotification(admin.getId(), type, title, message);
            } catch (Exception e) {
                System.err.println("Fehler beim Senden der Benachrichtigung an Admin " + admin.getUsername() + ": " + e.getMessage());
            }
        }
    }

    /**
     * Sends notification to a specific user or all users (for admin panel)
     * @param type
     * @param title
     * @param message
     * @param targetUserId - if null, sends to all users
     */
    @Async
    public void sendAdminNotification(NotificationType type, String title, String message, String targetUserId) {
        if (targetUserId != null) {
            try {
                sendNotification(targetUserId, type, title, message);
            } catch (Exception e) {
                System.err.println("Fehler beim Senden der Admin-Benachrichtigung an User " + targetUserId + ": " + e.getMessage());
            }
        } else {
            List<User> allUsers = userRepository.findAll();
            for (User user : allUsers) {
                try {
                    sendNotification(user.getId(), type, title, message);
                } catch (Exception e) {
                    System.err.println("Fehler beim Senden der Admin-Benachrichtigung an User " + user.getUsername() + ": " + e.getMessage());
                }
            }
        }
    }
}