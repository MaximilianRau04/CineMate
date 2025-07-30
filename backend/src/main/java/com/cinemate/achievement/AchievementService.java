package com.cinemate.achievement;

import com.cinemate.achievement.dto.AchievementDTO;
import com.cinemate.achievement.dto.UserAchievementDTO;
import com.cinemate.achievement.repository.AchievementRepository;
import com.cinemate.achievement.repository.UserAchievementRepository;
import com.cinemate.achievement.events.AchievementCheckEvent;
import com.cinemate.social.forum.ForumService;
import com.cinemate.social.friends.FriendRepository;
import com.cinemate.social.friends.FriendshipStatus;
import com.cinemate.social.points.PointsEventListener;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import com.cinemate.review.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ForumService forumService;
    private final FriendRepository friendRepository;
    private final PointsEventListener pointsEventListener;

    @Autowired
    public AchievementService(AchievementRepository achievementRepository,
                             UserAchievementRepository userAchievementRepository,
                             UserRepository userRepository,
                             ReviewRepository reviewRepository,
                             ForumService forumService,
                             FriendRepository friendRepository,
                             PointsEventListener pointsEventListener) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.forumService = forumService;
        this.friendRepository = friendRepository;
        this.pointsEventListener = pointsEventListener;
    }

    /**
     * Initialize default achievements in the database
     */
    public void initializeDefaultAchievements() {
        if (achievementRepository.count() == 0) {
            createDefaultAchievements();
        }
    }

    private void createDefaultAchievements() {
        List<Achievement> achievements = new ArrayList<>();

        // Review achievements
        achievements.add(new Achievement("Erster Kritiker", "Schreibe deine erste Bewertung", 
            "fas fa-star", "badge-warning", AchievementType.REVIEWS, 1, 25));
        achievements.add(new Achievement("Kritiker", "Schreibe 10 Bewertungen", 
            "fas fa-star-half-alt", "badge-warning", AchievementType.REVIEWS, 10, 50));
        achievements.add(new Achievement("Meisterkritiker", "Schreibe 50 Bewertungen", 
            "fas fa-crown", "badge-warning", AchievementType.REVIEWS, 50, 100));
        achievements.add(new Achievement("CineGuru", "Schreibe 100 Bewertungen", 
            "fas fa-trophy", "badge-gold", AchievementType.REVIEWS, 100, 200));

        // Movie achievements
        achievements.add(new Achievement("Filmfan", "Schaue 10 Filme", 
            "fas fa-film", "badge-primary", AchievementType.MOVIES_WATCHED, 10, 50));
        achievements.add(new Achievement("Kinogänger", "Schaue 50 Filme", 
            "fas fa-video", "badge-primary", AchievementType.MOVIES_WATCHED, 50, 100));
        achievements.add(new Achievement("Movie Buff", "Schaue 100 Filme", 
            "fas fa-theater-masks", "badge-primary", AchievementType.MOVIES_WATCHED, 100, 200));

        // Series achievements
        achievements.add(new Achievement("Serien Starter", "Schaue 5 Serien",
            "fas fa-tv", "badge-info", AchievementType.SERIES_WATCHED, 5, 50));
        achievements.add(new Achievement("Serien Binger", "Schaue 25 Serien",
            "fas fa-couch", "badge-info", AchievementType.SERIES_WATCHED, 25, 100));
        achievements.add(new Achievement("Serien Addict", "Schaue 50 Serien",
            "fas fa-bed", "badge-info", AchievementType.SERIES_WATCHED, 50, 200));

        // Forum achievements
        achievements.add(new Achievement("Diskutant", "Schreibe 10 Forum-Beiträge", 
            "fas fa-comments", "badge-success", AchievementType.FORUM_POSTS, 10, 75));
        achievements.add(new Achievement("Moderator", "Schreibe 50 Forum-Beiträge", 
            "fas fa-user-tie", "badge-success", AchievementType.FORUM_POSTS, 50, 150));

        // Social achievements
        achievements.add(new Achievement("Gesellig", "Finde 5 Freunde", 
            "fas fa-user-friends", "badge-secondary", AchievementType.FRIENDS, 5, 75));
        achievements.add(new Achievement("Social Butterfly", "Finde 20 Freunde", 
            "fas fa-users", "badge-secondary", AchievementType.FRIENDS, 20, 150));

        // Time achievements
        achievements.add(new Achievement("Marathoner", "Schaue 100 Stunden", 
            "fas fa-clock", "badge-danger", AchievementType.TOTAL_HOURS, 100, 100));
        achievements.add(new Achievement("Zeitreisender", "Schaue 500 Stunden", 
            "fas fa-history", "badge-danger", AchievementType.TOTAL_HOURS, 500, 250));

        achievementRepository.saveAll(achievements);
    }

    /**
     * Retrieves a list of all active achievements.
     *
     * @return a ResponseEntity containing a list of AchievementDTO objects if successful,
     */
    public ResponseEntity<List<AchievementDTO>> getAllAchievements() {
        try {
            List<Achievement> achievements = achievementRepository.findByIsActiveTrue();
            List<AchievementDTO> achievementDTOs = achievements.stream()
                .map(AchievementDTO::new)
                .collect(Collectors.toList());
            return ResponseEntity.ok(achievementDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get user's achievements (both unlocked and in progress)
     *
     * @return a ResponseEntity containing a list of UserAchievementDTO objects if successful,
     */
    public ResponseEntity<List<UserAchievementDTO>> getUserAchievements(String userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<UserAchievement> userAchievements = userAchievementRepository.findByUserIdOrderByUnlockedAtDesc(userId);
            List<UserAchievementDTO> userAchievementDTOs = userAchievements.stream()
                .map(UserAchievementDTO::new)
                .collect(Collectors.toList());

            return ResponseEntity.ok(userAchievementDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get only unlocked achievements for a user
     *
     * @return a ResponseEntity containing a list of UserAchievementDTO objects if successful,
     */
    public ResponseEntity<List<UserAchievementDTO>> getUserUnlockedAchievements(String userId) {
        try {
            List<UserAchievement> unlockedAchievements = userAchievementRepository.findByUserIdAndUnlockedAtIsNotNull(userId);
            List<UserAchievementDTO> userAchievementDTOs = unlockedAchievements.stream()
                .map(UserAchievementDTO::new)
                .collect(Collectors.toList());

            return ResponseEntity.ok(userAchievementDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Check and update user achievements based on their current statistics
     */
    public void checkUserAchievements(String userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) return;

            User user = userOpt.get();

            // Check review achievements
            long reviewCount = reviewRepository.countByUserId(userId);
            checkAndUpdateAchievements(user, AchievementType.REVIEWS, (int) reviewCount);

            // Check friend achievements
            List<com.cinemate.social.friends.Friend> friendships = friendRepository.findAcceptedFriendshipsByUser(user);
            long friendCount = friendships.size();
            checkAndUpdateAchievements(user, AchievementType.FRIENDS, (int) friendCount);

            // Check forum post achievements
            long forumPostCount = forumService.getPostCountByAuthor(userId);
            checkAndUpdateAchievements(user, AchievementType.FORUM_POSTS, (int) forumPostCount);

            // TODO: Add more achievement checks based on statistics service
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Event listener for achievement checks
     */
    @EventListener
    public void handleAchievementCheckEvent(AchievementCheckEvent event) {
        checkUserAchievements(event.getUserId());
    }

    /**
     * Checks and updates the user's progress towards achievements of a specific type.
     * If the user's progress meets or exceeds the threshold of an achievement, the achievement is unlocked
     * and points are awarded. Updates existing achievements or creates new ones for the user as needed.
     *
     * @param user the user whose achievements are being updated
     * @param type the type of achievements to be checked and updated
     * @param currentCount the user's current progress or count towards the achievements
     */
    private void checkAndUpdateAchievements(User user, AchievementType type, int currentCount) {
        List<Achievement> typeAchievements = achievementRepository.findByTypeAndIsActiveTrue(type);
        
        for (Achievement achievement : typeAchievements) {
            Optional<UserAchievement> existingUserAchievement = 
                userAchievementRepository.findByUserIdAndAchievementId(user.getId(), achievement.getId());

            if (existingUserAchievement.isPresent()) {
                // Update progress
                UserAchievement userAchievement = existingUserAchievement.get();
                userAchievement.setProgress(currentCount);
                
                // Check if achievement should be unlocked
                if (currentCount >= achievement.getThreshold() && userAchievement.getUnlockedAt() == null) {
                    userAchievement.setUnlockedAt(new java.util.Date());
                    // Award achievement points
                    pointsEventListener.onAchievementUnlocked(user.getId(), achievement.getPoints());
                }
                
                userAchievementRepository.save(userAchievement);
            } else {
                // Create new user achievement
                UserAchievement userAchievement = new UserAchievement(user, achievement, currentCount);
                
                // Check if it should be unlocked immediately
                if (currentCount >= achievement.getThreshold()) {
                    pointsEventListener.onAchievementUnlocked(user.getId(), achievement.getPoints());
                } else {
                    userAchievement.setUnlockedAt(null);
                }
                
                userAchievementRepository.save(userAchievement);
            }
        }
    }

    /**
     * Get achievement statistics for a user
     *
     * @return a ResponseEntity containing an AchievementStatsDTO object if successful,
     */
    public ResponseEntity<AchievementStatsDTO> getUserAchievementStats(String userId) {
        try {
            long totalAchievements = achievementRepository.findByIsActiveTrue().size();
            long unlockedAchievements = userAchievementRepository.countByUserIdAndUnlockedAtIsNotNull(userId);
            
            AchievementStatsDTO stats = new AchievementStatsDTO();
            stats.setTotalAchievements((int) totalAchievements);
            stats.setUnlockedAchievements((int) unlockedAchievements);
            stats.setProgressPercentage(totalAchievements > 0 ? 
                (double) unlockedAchievements / totalAchievements * 100.0 : 0.0);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    public static class AchievementStatsDTO {
        private int totalAchievements;
        private int unlockedAchievements;
        private double progressPercentage;
        
        public int getTotalAchievements() { return totalAchievements; }
        public void setTotalAchievements(int totalAchievements) { this.totalAchievements = totalAchievements; }

        public int getUnlockedAchievements() { return unlockedAchievements; }
        public void setUnlockedAchievements(int unlockedAchievements) { this.unlockedAchievements = unlockedAchievements; }

        public double getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }
    }
}
