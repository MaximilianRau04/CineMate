package com.cinemate.social.points;

import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PointsService {
    
    private final UserPointsRepository userPointsRepository;
    private final UserRepository userRepository;

    /**
     * Awards points to a user based on the specified point type and custom points value.
     *
     * @param userId       the unique identifier of the user to whom points are awarded
     * @param pointsType   the type of points to be awarded; determines default points if no custom points are specified
     * @param customPoints the custom number of points to be awarded; overrides default points if greater than zero
     * @return a ResponseEntity containing the result of the operation;
     */
    public ResponseEntity<?> awardPoints(String userId, PointsType pointsType, int customPoints) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOpt.get();

            UserPoints userPoints = userPointsRepository.findByUser_Id(userId)
                .orElse(new UserPoints(user));
            
            int pointsToAward = customPoints > 0 ? customPoints : pointsType.getDefaultPoints();
            userPoints.addPoints(pointsType, pointsToAward);
            
            userPointsRepository.save(userPoints);
            
            return ResponseEntity.ok("Points awarded successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error awarding points: " + e.getMessage());
        }
    }

    /**
     * Awards points to a user based on the specified point type using its default point value.
     *
     * @param userId     the unique identifier of the user to whom points are awarded
     * @param pointsType the type of points to be awarded; determines the default point value
     * @return a ResponseEntity containing the result of the operation
     */
    public ResponseEntity<?> awardPoints(String userId, PointsType pointsType) {
        return awardPoints(userId, pointsType, 0);
    }

    /**
     * Retrieves the UserPoints object associated with the specified user ID.
     *
     * @param userId the unique identifier of the user whose point record is to be retrieved
     * @return a ResponseEntity containing the UserPoints object if found or successfully created;
     */
    public ResponseEntity<UserPoints> getUserPoints(String userId) {
        try {
            Optional<UserPoints> userPointsOpt = userPointsRepository.findByUserId(userId);
            if (userPointsOpt.isEmpty()) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.badRequest().build();
                }
                
                UserPoints newUserPoints = new UserPoints(userOpt.get());
                userPointsRepository.save(newUserPoints);
                return ResponseEntity.ok(newUserPoints);
            }
            
            return ResponseEntity.ok(userPointsOpt.get());
            
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Retrieves the UserPointsDTO object associated with the specified user ID.
     *
     * @param userId the unique identifier of the user whose point record is to be retrieved
     * @return a ResponseEntity containing the UserPointsDTO object if found or successfully created
     */
    public ResponseEntity<UserPointsDTO> getUserPointsDTO(String userId) {
        try {
            Optional<UserPoints> userPointsOpt = userPointsRepository.findByUser_Id(userId);
            if (userPointsOpt.isEmpty()) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.badRequest().build();
                }
                
                UserPoints newUserPoints = new UserPoints(userOpt.get());
                userPointsRepository.save(newUserPoints);
                return ResponseEntity.ok(new UserPointsDTO(newUserPoints));
            }
            
            return ResponseEntity.ok(new UserPointsDTO(userPointsOpt.get()));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Retrieves the top users ranked by their total points as DTOs, limited to a specified number.
     * This method avoids circular reference issues by returning DTOs instead of full entities.
     *
     * @param limit the maximum number of users to include in the leaderboard; must be greater than 0
     * @return a ResponseEntity containing a list of UserPointsDTO objects representing the users and their points
     */
    public ResponseEntity<List<UserPointsDTO>> getLeaderboardDTO(int limit) {
        try {
            
            List<UserPoints> leaderboard;
            if (limit <= 10) {
                leaderboard = userPointsRepository.findTop10ByOrderByTotalPointsDesc();
            } else {
                leaderboard = userPointsRepository.findAllOrderByTotalPointsDesc();
                if (leaderboard.size() > limit) {
                    leaderboard = leaderboard.subList(0, limit);
                }
            }

            Map<String, UserPoints> uniqueEntries = new LinkedHashMap<>();
            for (int i = 0; i < leaderboard.size(); i++) {
                UserPoints entry = leaderboard.get(i);
                String userId = entry.getUser().getId();
                
                if (!uniqueEntries.containsKey(userId) || 
                    entry.getTotalPoints() > uniqueEntries.get(userId).getTotalPoints()) {
                    uniqueEntries.put(userId, entry);
                }
            }
            
            List<UserPointsDTO> leaderboardDTO = uniqueEntries.values().stream()
                .map(UserPointsDTO::new)
                .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(leaderboardDTO);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Cleans up duplicate UserPoints entries for a user
     */
    public ResponseEntity<?> cleanupDuplicateUserPoints(String userId) {
        try {
            
            List<UserPoints> allUserPoints = userPointsRepository.findAllByUser_Id(userId);
            
            if (allUserPoints.size() <= 1) {
                return ResponseEntity.ok("No duplicates found");
            }
            
            // Find the one with the most points (keep the best one)
            UserPoints bestUserPoints = allUserPoints.stream()
                .max((a, b) -> Integer.compare(a.getTotalPoints(), b.getTotalPoints()))
                .orElse(allUserPoints.get(0));
            
            // Delete all others
            for (UserPoints up : allUserPoints) {
                if (!up.getId().equals(bestUserPoints.getId())) {
                    System.out.println("DEBUG: Deleting UserPoints with " + up.getTotalPoints() + " points (ID: " + up.getId() + ")");
                    userPointsRepository.delete(up);
                }
            }
            
            return ResponseEntity.ok("Cleaned up " + (allUserPoints.size() - 1) + " duplicate entries");
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error during cleanup: " + e.getMessage());
        }
    }
}
