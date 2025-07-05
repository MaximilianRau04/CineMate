package com.cinemate.notification.scheduled;

import com.cinemate.notification.AutoNotificationService;
import com.cinemate.recommendation.RecommendationNotificationService;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduledNotificationService {

    @Autowired
    private AutoNotificationService autoNotificationService;

    @Autowired
    private RecommendationNotificationService recommendationNotificationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * sends weekly notifications about upcoming releases
     * executed every Monday at 10am
     */
    @Scheduled(cron = "0 0 10 * * MON")
    public void sendWeeklyUpcomingReleases() {
        List<User> users = userRepository.findAll();
        
        users.forEach(user -> {
            try {
                autoNotificationService.notifyUpcomingReleases(user.getId());
            } catch (Exception e) {
                System.err.println("Error sending weekly notification to user " + user.getId() + ": " + e.getMessage());
            }
        });
    }

    /**
     * sends personalized recommendations to all users
     * executed every Wednesday at 2pm
     */
    @Scheduled(cron = "0 0 14 * * WED")
    public void sendWeeklyRecommendations() {
        System.out.println("Starting weekly recommendation notifications at " + new java.util.Date());
        
        try {
            recommendationNotificationService.sendRecommendationNotificationsToAllUsers(3);
            System.out.println("Weekly recommendation notifications completed successfully");
        } catch (Exception e) {
            System.err.println("Error sending weekly recommendation notifications: " + e.getMessage());
        }
    }

    /**
     * checks daily for new releases (release date = today)
     * executed every day at 9am
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void checkDailyReleases() {
        // TODO
        System.out.println("Daily release check executed at " + new java.util.Date());
    }
}
