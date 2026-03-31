package com.cinemate.notification.scheduled;

import com.cinemate.notification.AutoNotificationService;
import com.cinemate.recommendation.RecommendationNotificationService;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduledNotificationService {

    private final AutoNotificationService autoNotificationService;
    private final RecommendationNotificationService recommendationNotificationService;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

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
                log.error("Error sending weekly notification to user " + user.getId() + ": " + e.getMessage());
            }
        });
    }

    /**
     * sends personalized recommendations to all users
     * executed every Wednesday at 2pm
     */
    @Scheduled(cron = "0 0 14 * * WED")
    public void sendWeeklyRecommendations() {
        log.info("Starting weekly recommendation notifications at " + new java.util.Date());

        try {
            recommendationNotificationService.sendRecommendationNotificationsToAllUsers(3);
            log.info("Weekly recommendation notifications completed successfully");
        } catch (Exception e) {
            log.error("Error sending weekly recommendation notifications: " + e.getMessage());
        }
    }

    /**
     * sends personalized recommendation summaries to all users
     * executed every Friday at 6pm
     */
    @Scheduled(cron = "0 0 18 * * FRI")
    public void sendWeeklyRecommendationSummaries() {
        log.info("Starting weekly recommendation summary notifications at " + new java.util.Date());

        try {
            recommendationNotificationService.sendSummaryRecommendationNotificationsToAllUsers(5);
            log.info("Weekly recommendation summary notifications completed successfully");
        } catch (Exception e) {
            log.error("Error sending weekly recommendation summary notifications: " + e.getMessage());
        }
    }

    /**
     * checks daily for new releases (release date = today)
     * executed every day at 9am
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void checkDailyReleases() {
        log.info("Starting daily release check at " + new java.util.Date());
        
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
                log.info("No releases found for today");
                return;
            }
            
            log.info("Found " + releasingMoviesToday.size() + " movies and " +
                              releasingSeriesToday.size() + " series releasing today");
            
            // Notify users using the AutoNotificationService
            autoNotificationService.notifyDailyReleases(releasingMoviesToday, releasingSeriesToday);
            
            log.info("Daily release check completed successfully");
        } catch (Exception e) {
            log.error("Error during daily release check: " + e.getMessage());
        }
    }
}
