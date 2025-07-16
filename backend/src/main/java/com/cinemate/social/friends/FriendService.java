package com.cinemate.social.friends;

import com.cinemate.notification.NotificationService;
import com.cinemate.notification.NotificationType;
import com.cinemate.social.points.PointsService;
import com.cinemate.social.points.PointsType;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import com.cinemate.user.dtos.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendService {
    
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final PointsService pointsService;
    
    @Autowired
    public FriendService(FriendRepository friendRepository, 
                        UserRepository userRepository,
                        NotificationService notificationService,
                        PointsService pointsService) {
        this.friendRepository = friendRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.pointsService = pointsService;
    }

    /**
     * Sends a friend request from one user to another.
     *
     * @param currentUserId the ID of the user sending the friend request
     * @param targetUserId the ID of the user receiving the friend request
     * @return a ResponseEntity containing either a success message or an error message
     */
    public ResponseEntity<?> sendFriendRequest(String currentUserId, String targetUserId) {
        try {
            if (currentUserId.equals(targetUserId)) {
                return ResponseEntity.badRequest().body("Cannot send friend request to yourself");
            }
            
            Optional<User> currentUserOpt = userRepository.findById(currentUserId);
            Optional<User> targetUserOpt = userRepository.findById(targetUserId);
            
            if (currentUserOpt.isEmpty() || targetUserOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User currentUser = currentUserOpt.get();
            User targetUser = targetUserOpt.get();
            
            // Check if friendship already exists
            Optional<Friend> existingFriendship = friendRepository.findFriendshipBetweenUsers(currentUser, targetUser);
            if (existingFriendship.isPresent()) {
                return ResponseEntity.badRequest().body("Friendship request already exists");
            }

            Friend friendRequest = new Friend(currentUser, targetUser);
            friendRepository.save(friendRequest);
            
            // Send notification
            notificationService.sendNotification(
                targetUserId,
                NotificationType.FRIEND_REQUEST,
                "Neue Freundschaftsanfrage",
                String.format("%s möchte dein Freund werden!", currentUser.getUsername())
            );
            
            // Award points for social interaction
            pointsService.awardPoints(currentUserId, PointsType.SOCIAL, 5);
            
            return ResponseEntity.ok("Friend request sent successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending friend request: " + e.getMessage());
        }
    }

    /**
     * Accepts a friend request for the specified user and friendship ID.rs.
     *
     * @param currentUserId the ID of the user accepting the friend request
     * @param friendshipId the ID of the friendship request being accepted
     * @return a ResponseEntity containing a success message if the request is accepted
     */
    public ResponseEntity<?> acceptFriendRequest(String currentUserId, String friendshipId) {
        try {
            
            Optional<Friend> friendshipOpt = friendRepository.findById(friendshipId);
            if (friendshipOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Friend request not found");
            }
            
            Friend friendship = friendshipOpt.get();
            
            // Verify the current user is the recipient
            if (!friendship.getRecipient().getId().equals(currentUserId)) {
                return ResponseEntity.status(403).body("Not authorized to accept this request");
            }
            
            if (friendship.getStatus() != FriendshipStatus.PENDING) {
                return ResponseEntity.badRequest().body("Friend request is not pending");
            }
            
            // Accept the friendship
            friendship.setStatus(FriendshipStatus.ACCEPTED);
            friendship.setAcceptedAt(new Date());
            friendRepository.save(friendship);
            
            // Send notification to requester
            notificationService.sendNotification(
                friendship.getRequester().getId(),
                NotificationType.FRIEND_REQUEST,
                "Freundschaftsanfrage akzeptiert",
                String.format("%s hat deine Freundschaftsanfrage akzeptiert!", friendship.getRecipient().getUsername())
            );
            
            // Award points to both users
            pointsService.awardPoints(currentUserId, PointsType.SOCIAL, 10);
            pointsService.awardPoints(friendship.getRequester().getId(), PointsType.SOCIAL, 10);
            
            return ResponseEntity.ok("Friend request accepted");
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error accepting friend request: " + e.getMessage());
        }
    }

    /**
     * Declines a friend request for the given user and friendship ID.
     *
     * @param currentUserId the ID of the user declining the friend request
     * @param friendshipId the ID of the friendship request to be declined
     * @return a ResponseEntity containing a message indicating the result of the operation
     */
    public ResponseEntity<?> declineFriendRequest(String currentUserId, String friendshipId) {
        try {
            Optional<Friend> friendshipOpt = friendRepository.findById(friendshipId);
            if (friendshipOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Friend request not found");
            }
            
            Friend friendship = friendshipOpt.get();
            
            // Verify the current user is the recipient
            if (!friendship.getRecipient().getId().equals(currentUserId)) {
                return ResponseEntity.status(403).body("Not authorized to decline this request");
            }
            
            friendship.setStatus(FriendshipStatus.DECLINED);
            friendRepository.save(friendship);
            
            return ResponseEntity.ok("Friend request declined");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error declining friend request: " + e.getMessage());
        }
    }

    /**
     * Retrieves the list of friends for a given user.
     *
     * @param userId the ID of the user whose friends are to be retrieved
     * @return a ResponseEntity containing a list of UserResponseDTO objects representing the user's friends,
     */
    public ResponseEntity<List<UserResponseDTO>> getFriends(String userId) {
        try {
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            User user = userOpt.get();
            
            List<Friend> friendships = friendRepository.findAcceptedFriendshipsByUser(user);
            
            List<UserResponseDTO> friends = friendships.stream()
                .map(friendship -> {
                    User friend = friendship.getRequester().getId().equals(userId) 
                        ? friendship.getRecipient() 
                        : friendship.getRequester();
                    return new UserResponseDTO(friend);
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(friends);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Retrieves a list of pending friend requests received by the specified user.
     *
     * @param userId the ID of the user whose pending friend requests are to be retrieved
     * @return a ResponseEntity containing a list of FriendRequestDTO objects representing the pending friend requests
     */
    public ResponseEntity<List<FriendRequestDTO>> getPendingRequests(String userId) {
        try {
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            User user = userOpt.get();
            
            List<Friend> pendingRequests = friendRepository.findByRecipientAndStatus(user, FriendshipStatus.PENDING);
            
            List<FriendRequestDTO> requests = pendingRequests.stream()
                .map(FriendRequestDTO::new)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(requests);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Removes an existing friendship between two users. If the friendship does not exist
     * or if either user is not found, an appropriate response is returned.
     *
     * @param currentUserId the ID of the current user initiating the removal of a friend
     * @param friendUserId the ID of the friend to be removed
     * @return a ResponseEntity containing the result of the operation
     */
    public ResponseEntity<?> removeFriend(String currentUserId, String friendUserId) {
        try {
            Optional<User> currentUserOpt = userRepository.findById(currentUserId);
            Optional<User> friendUserOpt = userRepository.findById(friendUserId);
            
            if (currentUserOpt.isEmpty() || friendUserOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User currentUser = currentUserOpt.get();
            User friendUser = friendUserOpt.get();
            
            Optional<Friend> friendshipOpt = friendRepository.findAcceptedFriendshipBetweenUsers(currentUser, friendUser);
            if (friendshipOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Friendship not found");
            }
            
            friendRepository.delete(friendshipOpt.get());
            
            return ResponseEntity.ok("Friend removed successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error removing friend: " + e.getMessage());
        }
    }
}
