package com.cinemate.notification;

import com.cinemate.movie.Movie;
import com.cinemate.review.Review;
import com.cinemate.review.ReviewRepository;
import com.cinemate.series.Episode;
import com.cinemate.series.Season;
import com.cinemate.series.Series;
import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.social.forum.reply.ForumReply;
import com.cinemate.social.forum.subscription.ForumSubscription;
import com.cinemate.social.forum.subscription.ForumSubscriptionRepository;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AutoNotificationService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ForumSubscriptionRepository forumSubscriptionRepository;

    /**
     * Notifies users when a movie from their watchlist has been released
     * @param movie - the released movie
     */
    public void notifyMovieWatchlistReleased(Movie movie) {
        List<User> users = userRepository.findAll();
        
        users.stream()
            .filter(user -> user.getMovieWatchlist().contains(movie))
            .forEach(user -> {
                String title = "🎬 Film aus deiner Watchlist ist verfügbar!";
                String message = String.format("Der Film '%s' aus deiner Watchlist ist jetzt verfügbar!", movie.getTitle());
                
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("movieId", movie.getId());
                metadata.put("movieTitle", movie.getTitle());
                metadata.put("releaseDate", movie.getReleaseDate());
                
                Notification notification = notificationService.createNotificationWithMetadata(
                    user.getId(), 
                    NotificationType.MOVIE_WATCHLIST_RELEASED, 
                    title, 
                    message,
                    movie.getId(),
                    "movie",
                    metadata
                );
                notificationService.sendNotification(notification.getId());
            });
    }

    /**
     * Notifies users about daily releases from their watchlist
     * @param releasingMovies - movies releasing today
     * @param releasingSeries - series releasing today
     */
    public void notifyDailyReleases(List<Movie> releasingMovies, List<Series> releasingSeries) {
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            List<Movie> userMovies = releasingMovies.stream()
                .filter(movie -> user.getMovieWatchlist().contains(movie))
                .toList();
                
            List<Series> userSeries = releasingSeries.stream()
                .filter(series -> user.getSeriesWatchlist().contains(series))
                .toList();
            
            if (userMovies.isEmpty() && userSeries.isEmpty()) {
                continue;
            }
            
            String title = "🎉 Neue Releases heute!";
            StringBuilder messageBuilder = new StringBuilder("Heute erscheinen Inhalte aus deiner Watchlist:\n\n");
            
            for (Movie movie : userMovies) {
                messageBuilder.append("🎬 ").append(movie.getTitle()).append("\n");
            }
            
            for (Series series : userSeries) {
                messageBuilder.append("📺 ").append(series.getTitle()).append("\n");
            }
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("moviesCount", userMovies.size());
            metadata.put("seriesCount", userSeries.size());
            metadata.put("totalReleases", userMovies.size() + userSeries.size());
            
            Notification notification = notificationService.createNotificationWithMetadata(
                user.getId(),
                NotificationType.NEW_MOVIE_RELEASE,
                title,
                messageBuilder.toString(),
                null,
                "daily_releases",
                metadata
            );
            
            notificationService.sendNotification(notification.getId());
        }
    }

    /**
     * Notifies users when a new season of a series has been added from their watchlist
     * @param series - the series with the new season
     * @param newSeason - the new season
     */
    public void notifySeriesNewSeason(Series series, Season newSeason) {
        List<User> users = userRepository.findAll();
        
        users.stream()
            .filter(user -> user.getSeriesWatchlist().contains(series))
            .forEach(user -> {
                String title = "📺 Neue Staffel verfügbar!";
                String message = String.format("Staffel %d von '%s' ist jetzt verfügbar!", 
                    newSeason.getSeasonNumber(), series.getTitle());
                
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("seriesId", series.getId());
                metadata.put("seriesTitle", series.getTitle());
                metadata.put("seasonNumber", newSeason.getSeasonNumber());
                metadata.put("episodeCount", newSeason.getEpisodes().size());
                
                Notification notification = notificationService.createNotificationWithMetadata(
                    user.getId(), 
                    NotificationType.SERIES_NEW_SEASON, 
                    title, 
                    message,
                    series.getId(),
                    "series",
                    metadata
                );
                notificationService.sendNotification(notification.getId());
            });
    }

    /**
     * Notifies users when a new episode of a series has been added from their watchlist
     * @param series - the series with the new episode
     * @param season - the season with the new episode
     * @param newEpisode - the new episode
     */
    public void notifySeriesNewEpisode(Series series, Season season, Episode newEpisode) {
        List<User> users = userRepository.findAll();
        
        users.stream()
            .filter(user -> user.getSeriesWatchlist().contains(series))
            .forEach(user -> {
                String title = "🆕 Neue Episode verfügbar!";
                String message = String.format("Episode %d von '%s' (Staffel %d) ist jetzt verfügbar!", 
                    newEpisode.getEpisodeNumber(), series.getTitle(), season.getSeasonNumber());
                
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("seriesId", series.getId());
                metadata.put("seriesTitle", series.getTitle());
                metadata.put("seasonNumber", season.getSeasonNumber());
                metadata.put("episodeNumber", newEpisode.getEpisodeNumber());
                metadata.put("episodeTitle", newEpisode.getTitle());
                
                Notification notification = notificationService.createNotificationWithMetadata(
                    user.getId(), 
                    NotificationType.SERIES_NEW_EPISODE, 
                    title, 
                    message,
                    series.getId(),
                    "series",
                    metadata
                );
                notificationService.sendNotification(notification.getId());
            });
    }

    /**
     * Notifies users when the status of a series changes from their watchlist
     * @param series - the series with the changed status
     * @param oldStatus - the old status
     */
    public void notifySeriesStatusChanged(Series series, String oldStatus) {
        List<User> users = userRepository.findAll();
        
        users.stream()
            .filter(user -> user.getSeriesWatchlist().contains(series))
            .forEach(user -> {
                String title = "📊 Serie Status-Update";
                String message = String.format("Der Status von '%s' hat sich von '%s' zu '%s' geändert.", 
                    series.getTitle(), oldStatus, series.getStatus().toString());
                
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("seriesId", series.getId());
                metadata.put("seriesTitle", series.getTitle());
                metadata.put("oldStatus", oldStatus);
                metadata.put("newStatus", series.getStatus().toString());
                
                Notification notification = notificationService.createNotificationWithMetadata(
                    user.getId(), 
                    NotificationType.SERIES_STATUS_CHANGED, 
                    title, 
                    message,
                    series.getId(),
                    "series",
                    metadata
                );
                notificationService.sendNotification(notification.getId());
            });
    }

    /**
     * Notifies users when a movie / series has been evaluated from their watchlist
     * @param review -the new rewiew
     * @param itemTitle - the review title
     * @param itemType - type of item
     */
    public void notifyWatchlistItemReviewed(Review review, String itemTitle, String itemType) {
        List<User> users = userRepository.findAll();
        
        users.stream()
            .filter(user -> {
                if ("movie".equals(itemType)) {
                    return user.getMovieWatchlist().stream()
                        .anyMatch(movie -> movie.getId().equals(review.getItemId()));
                } else if ("series".equals(itemType)) {
                    return user.getSeriesWatchlist().stream()
                        .anyMatch(series -> series.getId().equals(review.getItemId()));
                }
                return false;
            })
            .filter(user -> !user.getId().equals(review.getUserId())) // Nicht den Autor der Bewertung benachrichtigen
            .forEach(user -> {
                String title = "⭐ Neue Bewertung verfügbar";
                String message = String.format("'%s' aus deiner Watchlist wurde mit %.1f Sternen bewertet.", 
                    itemTitle, review.getRating());
                
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("itemId", review.getItemId());
                metadata.put("itemTitle", itemTitle);
                metadata.put("itemType", itemType);
                metadata.put("rating", review.getRating());
                metadata.put("reviewId", review.getId());
                
                Notification notification = notificationService.createNotificationWithMetadata(
                    user.getId(), 
                    NotificationType.WATCHLIST_ITEM_REVIEWED, 
                    title, 
                    message,
                    review.getItemId(),
                    itemType,
                    metadata
                );
                notificationService.sendNotification(notification.getId());
            });
    }

    /**
     * Notifies users when a movie / series has been rated from their favorites
     * @param review - the new review
     * @param itemTitle - the review title
     * @param itemType - type of item
     */
    public void notifyFavoriteItemReviewed(Review review, String itemTitle, String itemType) {
        List<User> users = userRepository.findAll();
        
        users.stream()
            .filter(user -> {
                if ("movie".equals(itemType)) {
                    return user.getMovieFavorites().stream()
                        .anyMatch(movie -> movie.getId().equals(review.getItemId()));
                } else if ("series".equals(itemType)) {
                    return user.getSeriesFavorites().stream()
                        .anyMatch(series -> series.getId().equals(review.getItemId()));
                }
                return false;
            })
            .filter(user -> !user.getId().equals(review.getUserId())) // Nicht den Autor der Bewertung benachrichtigen
            .forEach(user -> {
                String title = "❤️ Bewertung zu deinen Favoriten";
                String message = String.format("'%s' aus deinen Favoriten wurde mit %.1f Sternen bewertet.", 
                    itemTitle, review.getRating());
                
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("itemId", review.getItemId());
                metadata.put("itemTitle", itemTitle);
                metadata.put("itemType", itemType);
                metadata.put("rating", review.getRating());
                metadata.put("reviewId", review.getId());
                
                Notification notification = notificationService.createNotificationWithMetadata(
                    user.getId(), 
                    NotificationType.FAVORITE_ITEM_REVIEWED, 
                    title, 
                    message,
                    review.getItemId(),
                    itemType,
                    metadata
                );
                notificationService.sendNotification(notification.getId());
            });
    }

    /**
     * Notifies users of milestones reached
     * @param userId - the user who reached the milestons
     * @param milestoneType - type of milestone
     * @param count - reached number of milestones
     */
    public void notifyMilestoneReached(String userId, String milestoneType, int count) {
        String title = "🏆 Meilenstein erreicht!";
        String message = "";
        
        switch (milestoneType) {
            case "movies_watched":
                message = String.format("Glückwunsch! Du hast %d Filme geschaut!", count);
                break;
            case "series_watched":
                message = String.format("Glückwunsch! Du hast %d Serien geschaut!", count);
                break;
            case "reviews_written":
                message = String.format("Glückwunsch! Du hast %d Bewertungen geschrieben!", count);
                break;
            case "watchlist_size":
                message = String.format("Deine Watchlist hat %d Einträge erreicht!", count);
                break;
            default:
                message = String.format("Du hast einen Meilenstein erreicht: %s (%d)", milestoneType, count);
        }
        
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("milestoneType", milestoneType);
        metadata.put("count", count);
        
        Notification notification = notificationService.createNotificationWithMetadata(
            userId, 
            NotificationType.MILESTONE_REACHED, 
            title, 
            message,
            null,
            "milestone",
            metadata
        );
        notificationService.sendNotification(notification.getId());
    }

    /**
     * Creates a weekly summary of upcoming releases from the watchlist
     * @param userId - the user for the summary
     */
    public void notifyUpcomingReleases(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return;
        
        User user = userOpt.get();
        Calendar nextWeek = Calendar.getInstance();
        nextWeek.add(Calendar.WEEK_OF_YEAR, 1);
        Date nextWeekDate = nextWeek.getTime();

        List<Movie> upcomingMovies = user.getMovieWatchlist().stream()
            .filter(movie -> movie.getReleaseDate() != null && 
                movie.getReleaseDate().after(new Date()) && 
                movie.getReleaseDate().before(nextWeekDate))
            .collect(Collectors.toList());

        List<Series> upcomingSeries = user.getSeriesWatchlist().stream()
            .filter(series -> series.getReleaseDate() != null && 
                series.getReleaseDate().after(new Date()) && 
                series.getReleaseDate().before(nextWeekDate))
            .collect(Collectors.toList());
        
        if (!upcomingMovies.isEmpty() || !upcomingSeries.isEmpty()) {
            String title = "📅 Kommende Releases diese Woche";
            StringBuilder message = new StringBuilder("Diese Woche erscheinen aus deiner Watchlist:\n");
            
            if (!upcomingMovies.isEmpty()) {
                message.append("🎬 Filme: ");
                message.append(upcomingMovies.stream()
                    .map(Movie::getTitle)
                    .collect(Collectors.joining(", ")));
                message.append("\n");
            }
            
            if (!upcomingSeries.isEmpty()) {
                message.append("📺 Serien: ");
                message.append(upcomingSeries.stream()
                    .map(Series::getTitle)
                    .collect(Collectors.joining(", ")));
            }
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("upcomingMovies", upcomingMovies.size());
            metadata.put("upcomingSeries", upcomingSeries.size());
            
            Notification notification = notificationService.createNotificationWithMetadata(
                userId, 
                NotificationType.UPCOMING_RELEASES, 
                title, 
                message.toString(),
                null,
                "weekly_summary",
                metadata
            );
            notificationService.sendNotification(notification.getId());
        }
    }

    /**
     * Checks and sends milestone notifications for a user
     * @param userId - the user
     */
    public void checkAndNotifyMilestones(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return;
        
        User user = userOpt.get();

        int watchedMoviesCount = user.getMoviesWatched().size();
        if (shouldNotifyMilestone(watchedMoviesCount)) {
            notifyMilestoneReached(userId, "movies_watched", watchedMoviesCount);
        }

        int watchedSeriesCount = user.getSeriesWatched().size();
        if (shouldNotifyMilestone(watchedSeriesCount)) {
            notifyMilestoneReached(userId, "series_watched", watchedSeriesCount);
        }

        long reviewsCount = reviewRepository.countByUserId(userId);
        if (shouldNotifyMilestone((int) reviewsCount)) {
            notifyMilestoneReached(userId, "reviews_written", (int) reviewsCount);
        }

        int watchlistSize = user.getMovieWatchlist().size() + user.getSeriesWatchlist().size();
        if (shouldNotifyMilestone(watchlistSize)) {
            notifyMilestoneReached(userId, "watchlist_size", watchlistSize);
        }
    }

    /**
     * Determines whether a milestone should be sent for a certain number
     * @param count - the number to be checked
     * @return true if a milestone was reached
     */
    private boolean shouldNotifyMilestone(int count) {
        int[] milestones = {5, 10, 25, 50, 100, 250, 500, 1000};
        return Arrays.stream(milestones).anyMatch(milestone -> milestone == count);
    }

    /**
     * Notifies users when a new forum post is created in categories they're interested in
     * @param forumPost - the created forum post
     */
    public void notifyForumPostCreated(ForumPost forumPost) {
        List<User> users = userRepository.findAll();
        
        users.stream()
            .filter(user -> !user.getId().equals(forumPost.getAuthor().getId())) // Don't notify the author
            .forEach(user -> {
                String title = "💬 Neuer Forum-Beitrag";
                String message = String.format("'%s' hat einen neuen Beitrag erstellt: '%s'", 
                    forumPost.getAuthor().getUsername(), forumPost.getTitle());
                
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("forumPostId", forumPost.getId());
                metadata.put("forumPostTitle", forumPost.getTitle());
                metadata.put("category", forumPost.getCategory().toString());
                metadata.put("authorName", forumPost.getAuthor().getUsername());
                
                Notification notification = notificationService.createNotificationWithMetadata(
                    user.getId(), 
                    NotificationType.FORUM_POST_CREATED, 
                    title, 
                    message, 
                    forumPost.getId(),
                    "forum_post",
                    metadata
                );
                
                notificationService.sendNotification(notification.getId());
            });
    }

    /**
     * Notifies subscribed users when someone replies to a forum post they're subscribed to
     * @param forumReply - the created reply
     * @param forumPost - the original post
     */
    public void notifyForumReplyCreated(ForumReply forumReply, ForumPost forumPost) {
        // Get all subscribers to this post
        List<ForumSubscription> subscriptions =
            forumSubscriptionRepository.findByPostIdAndIsActiveTrue(forumPost.getId());
        
        subscriptions.stream()
            .filter(subscription -> !subscription.getUser().getId().equals(forumReply.getAuthor().getId())) // Don't notify the reply author
            .forEach(subscription -> {
                String title = "💬 Neue Antwort auf abonnierten Beitrag";
                String message = String.format("'%s' hat auf den Beitrag '%s' geantwortet", 
                    forumReply.getAuthor().getUsername(), forumPost.getTitle());
                
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("forumPostId", forumPost.getId());
                metadata.put("forumPostTitle", forumPost.getTitle());
                metadata.put("forumReplyId", forumReply.getId());
                metadata.put("replyAuthorName", forumReply.getAuthor().getUsername());
                
                Notification notification = notificationService.createNotificationWithMetadata(
                    subscription.getUser().getId(), 
                    NotificationType.FORUM_REPLY_CREATED, 
                    title, 
                    message, 
                    forumPost.getId(),
                    "forum_post",
                    metadata
                );
                
                notificationService.sendNotification(notification.getId());
            });
    }
}
