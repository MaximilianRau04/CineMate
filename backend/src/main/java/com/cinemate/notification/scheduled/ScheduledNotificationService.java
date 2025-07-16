package com.cinemate.notification.scheduled;

import com.cinemate.notification.AutoNotificationService;
import com.cinemate.recommendation.RecommendationNotificationService;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class ScheduledNotificationService {

    @Autowired
    private AutoNotificationService autoNotificationService;

    @Autowired
    private RecommendationNotificationService recommendationNotificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private SeriesRepository seriesRepository;

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
     * sends personalized recommendation summaries to all users
     * executed every Friday at 6pm
     */
    @Scheduled(cron = "0 0 18 * * FRI")
    public void sendWeeklyRecommendationSummaries() {
        System.out.println("Starting weekly recommendation summary notifications at " + new java.util.Date());
        
        try {
            recommendationNotificationService.sendSummaryRecommendationNotificationsToAllUsers(5);
            System.out.println("Weekly recommendation summary notifications completed successfully");
        } catch (Exception e) {
            System.err.println("Error sending weekly recommendation summary notifications: " + e.getMessage());
        }
    }

    /**
     * checks daily for new releases (release date = today)
     * executed every day at 9am
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void checkDailyReleases() {
        System.out.println("Starting daily release check at " + new java.util.Date());
        
        try {
            // Get today's date (beginning of day)
            Calendar today = Calendar.getInstance();
            today.set(Calendar.HOUR_OF_DAY, 0);
            today.set(Calendar.MINUTE, 0);
            today.set(Calendar.SECOND, 0);
            today.set(Calendar.MILLISECOND, 0);
            Date todayStart = today.getTime();
            
            // Get end of today
            today.set(Calendar.HOUR_OF_DAY, 23);
            today.set(Calendar.MINUTE, 59);
            today.set(Calendar.SECOND, 59);
            today.set(Calendar.MILLISECOND, 999);
            Date todayEnd = today.getTime();
            
            // Find movies and series releasing today
            List<Movie> releasingMoviesToday = movieRepository.findAll().stream()
                .filter(movie -> movie.getReleaseDate() != null &&
                    !movie.getReleaseDate().before(todayStart) &&
                    !movie.getReleaseDate().after(todayEnd))
                .toList();
                
            List<Series> releasingSeriesToday = seriesRepository.findAll().stream()
                .filter(series -> series.getReleaseDate() != null &&
                    !series.getReleaseDate().before(todayStart) &&
                    !series.getReleaseDate().after(todayEnd))
                .toList();
            
            if (releasingMoviesToday.isEmpty() && releasingSeriesToday.isEmpty()) {
                System.out.println("No releases found for today");
                return;
            }
            
            System.out.println("Found " + releasingMoviesToday.size() + " movies and " + 
                              releasingSeriesToday.size() + " series releasing today");
            
            // Notify users using the AutoNotificationService
            autoNotificationService.notifyDailyReleases(releasingMoviesToday, releasingSeriesToday);
            
            System.out.println("Daily release check completed successfully");
        } catch (Exception e) {
            System.err.println("Error during daily release check: " + e.getMessage());
        }
    }
}
