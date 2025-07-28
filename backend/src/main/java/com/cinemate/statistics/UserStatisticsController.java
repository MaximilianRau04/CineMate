package com.cinemate.statistics;

import com.cinemate.statistics.dto.FriendStatisticsDTO;
import com.cinemate.statistics.dto.UserStatisticsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserStatisticsController {

    private final UserStatisticsService statisticsService;

    /**
     * Get user statistics for a specific period
     * @param userId The user ID
     * @param period The time period (year, month, all)
     * @return User statistics DTO
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserStatisticsDTO> getUserStatistics(
            @PathVariable String userId,
            @RequestParam(defaultValue = "year") String period) {
        
        try {
            System.out.println("Received request for userId: " + userId + ", period: " + period);
            UserStatisticsDTO stats = statisticsService.calculateUserStatistics(userId, period);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error in getUserStatistics: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get friends comparison statistics
     * @param userId The user ID
     * @return List of friend statistics
     */
    @GetMapping("/users/{userId}/friends-comparison")
    public ResponseEntity<List<FriendStatisticsDTO>> getFriendsComparison(
            @PathVariable String userId) {
        
        try {
            List<FriendStatisticsDTO> friendsStats = statisticsService.getFriendsStatistics(userId);
            return ResponseEntity.ok(friendsStats);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
