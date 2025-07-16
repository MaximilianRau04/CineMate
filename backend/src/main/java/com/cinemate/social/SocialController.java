package com.cinemate.social;

import com.cinemate.social.friends.FriendRequestDTO;
import com.cinemate.social.friends.FriendService;
import com.cinemate.social.points.PointsService;
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

    /**
     * Sends a friend request from the authenticated user to the target user.
     *
     * @param targetUserId the ID of the user to whom the friend request is being sent
     * @param authentication the authentication object containing details about the current user
     * @return a ResponseEntity containing the result of the friend request operation
     */
    @PostMapping("/friends/request/{targetUserId}")
    public ResponseEntity<?> sendFriendRequest(@PathVariable String targetUserId, Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return friendService.sendFriendRequest(currentUserId, targetUserId);
    }

    /**
     * Accepts a pending friend request for the authenticated user.
     *
     * @param friendshipId the ID of the friendship request to be accepted
     * @param authentication the authentication object containing details of the currently authenticated user
     * @return a ResponseEntity containing the result of the operation, including success or error messages
     */
    @PostMapping("/friends/accept/{friendshipId}")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable String friendshipId, Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return friendService.acceptFriendRequest(currentUserId, friendshipId);
    }

    /**
     * Declines a pending friend request for the authenticated user.
     *
     * @param friendshipId the ID of the friendship request to be declined
     * @param authentication the authentication object containing details of the currently authenticated user
     * @return a ResponseEntity containing the result of the operation, such as success or error messages
     */
    @PostMapping("/friends/decline/{friendshipId}")
    public ResponseEntity<?> declineFriendRequest(@PathVariable String friendshipId, Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return friendService.declineFriendRequest(currentUserId, friendshipId);
    }

    /**
     * Retrieves the list of friends for the authenticated user.
     *
     * @param authentication the authentication object containing details of the currently authenticated user
     * @return a ResponseEntity containing a list of UserResponseDTO representing the user's friends,
     */
    @GetMapping("/friends")
    public ResponseEntity<List<UserResponseDTO>> getFriends(Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        return friendService.getFriends(currentUserId);
    }

    /**
     * Retrieves the list of friends for a specified user.
     *
     * @param userId the ID of the user whose friends' list is to be retrieved
     * @return a ResponseEntity containing a list of UserResponseDTO objects that represent the friends of the user
     */
    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<UserResponseDTO>> getUserFriends(@PathVariable String userId) {
        return friendService.getFriends(userId);
    }

    /**
     * Retrieves the list of pending friend requests for the authenticated user.
     *
     * @param authentication the authentication object containing details of the currently authenticated user
     * @return a ResponseEntity containing a list of FriendRequestDTO objects representing the pending friend requests
     */
    @GetMapping("/friends/requests")
    public ResponseEntity<List<FriendRequestDTO>> getPendingRequests(Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        return friendService.getPendingRequests(currentUserId);
    }

    /**
     * Removes a friend for the authenticated user.
     *
     * @param friendUserId the ID of the friend to be removed
     * @param authentication the authentication object containing details of the currently authenticated user
     * @return a ResponseEntity containing the result of the operation, such as success or error messages
     */
    @DeleteMapping("/friends/{friendUserId}")
    public ResponseEntity<?> removeFriend(@PathVariable String friendUserId, Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        return friendService.removeFriend(currentUserId, friendUserId);
    }

    /**
     * Retrieves the current user's points information.
     *
     * @param authentication the authentication object containing details of the currently authenticated user
     * @return a ResponseEntity containing a UserPointsDTO object with the user's points information
     */
    @GetMapping("/points")
    public ResponseEntity<UserPointsDTO> getMyPoints(Authentication authentication) {
        String currentUserId = getCurrentUserId(authentication);
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        return pointsService.getUserPointsDTO(currentUserId);
    }

    /**
     * Retrieves the point information of a specified user.
     *
     * @param userId the ID of the user whose points information is to be retrieved
     * @return a ResponseEntity containing a UserPointsDTO object with the user's points information
     */
    @GetMapping("/points/{userId}")
    public ResponseEntity<UserPointsDTO> getUserPoints(@PathVariable String userId) {
        return pointsService.getUserPointsDTO(userId);
    }

    /**
     * Retrieves the leaderboard information based on user points.
     *
     * @param limit the maximum number of users to include in the leaderboard; defaults to 10 if not specified
     * @return a ResponseEntity containing a list of UserPointsDTO objects representing the users and their points
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserPointsDTO>> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        return pointsService.getLeaderboardDTO(limit);
    }

    /**
     * Retrieves the user ID of the currently authenticated user.
     * @param authentication the Authentication object containing the details of the currently authenticated user
     * @return the user ID of the authenticated user or null
     */
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
