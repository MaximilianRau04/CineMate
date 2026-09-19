package com.cinemate.statistics;

import com.cinemate.statistics.DTOs.FriendStatisticsDTO;
import com.cinemate.statistics.DTOs.UserStatisticsDTO;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class UserStatisticsController {

  private final UserStatisticsService statisticsService;

  /**
   * Get user statistics for a specific period
   *
   * @param userId The user ID
   * @param period The time period (year, month, all)
   * @return User statistics DTO
   */
  @GetMapping("/users/{userId}")
  public ResponseEntity<UserStatisticsDTO> getUserStatistics(
      @PathVariable String userId, @RequestParam(defaultValue = "year") String period) {

    UserStatisticsDTO stats = statisticsService.calculateUserStatistics(userId, period);
    return ResponseEntity.ok(stats);
  }

  /**
   * Get friends comparison statistics
   *
   * @param userId The user ID
   * @return List of friend statistics
   */
  @GetMapping("/users/{userId}/friends-comparison")
  public ResponseEntity<List<FriendStatisticsDTO>> getFriendsComparison(
      @PathVariable String userId) {

    List<FriendStatisticsDTO> friendsStats = statisticsService.getFriendsStatistics(userId);
    return ResponseEntity.ok(friendsStats);
  }
}
