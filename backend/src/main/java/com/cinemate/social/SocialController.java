package com.cinemate.social;

import com.cinemate.social.friends.FriendRequestDTO;
import com.cinemate.social.friends.FriendService;
import com.cinemate.social.points.PointsService;
import com.cinemate.social.points.UserPoints;
import com.cinemate.social.points.UserPointsDTO;
import com.cinemate.user.dtos.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social")
@CrossOrigin(origins = "*")
public class SocialController {
    
    private final FriendService friendService;
    private final PointsService pointsService;
    
    @Autowired
    public SocialController(FriendService friendService, PointsService pointsService) {
        this.friendService = friendService;
        this.pointsService = pointsService;
    }
    
    @PostMapping("/friends/request/{targetUserId}")
    public ResponseEntity<?> sendFriendRequest(@PathVariable String targetUserId, Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return friendService.sendFriendRequest(currentUserId, targetUserId);
    }
    
    @PostMapping("/friends/accept/{friendshipId}")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable String friendshipId, Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return friendService.acceptFriendRequest(currentUserId, friendshipId);
    }
    
    @PostMapping("/friends/decline/{friendshipId}")
    public ResponseEntity<?> declineFriendRequest(@PathVariable String friendshipId, Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return friendService.declineFriendRequest(currentUserId, friendshipId);
    }
    
    @GetMapping("/friends")
    public ResponseEntity<List<UserResponseDTO>> getFriends(Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        return friendService.getFriends(currentUserId);
    }
    
    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<UserResponseDTO>> getUserFriends(@PathVariable String userId) {
        return friendService.getFriends(userId);
    }
    
    @GetMapping("/friends/requests")
    public ResponseEntity<List<FriendRequestDTO>> getPendingRequests(Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        return friendService.getPendingRequests(currentUserId);
    }
    
    @DeleteMapping("/friends/{friendUserId}")
    public ResponseEntity<?> removeFriend(@PathVariable String friendUserId, Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return friendService.removeFriend(currentUserId, friendUserId);
    }
    
    @GetMapping("/points")
    public ResponseEntity<UserPointsDTO> getMyPoints(Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        return pointsService.getUserPointsDTO(currentUserId);
    }
    
    @GetMapping("/points/{userId}")
    public ResponseEntity<UserPointsDTO> getUserPoints(@PathVariable String userId) {
        return pointsService.getUserPointsDTO(userId);
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserPointsDTO>> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        return pointsService.getLeaderboardDTO(limit);
    }

    @PostMapping("/points/cleanup")
    public ResponseEntity<?> cleanupDuplicatePoints(Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        // Only allow cleanup for authenticated users (could add admin check here)
        return pointsService.cleanupDuplicateUserPoints();
    }

    private String getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        Object principal = authentication.getPrincipal();
        if (principal instanceof com.cinemate.user.User) {
            return ((com.cinemate.user.User) principal).getId();
        }
        
        return null;
    }
}
