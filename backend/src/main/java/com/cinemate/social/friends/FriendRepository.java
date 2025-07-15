package com.cinemate.social.friends;

import com.cinemate.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends MongoRepository<Friend, String> {

    List<Friend> findByRequesterAndStatus(User requester, FriendshipStatus status);
    List<Friend> findByRecipientAndStatus(User recipient, FriendshipStatus status);
    List<Friend> findByRequesterOrRecipient(User requester, User recipient);

    @Query("{ $and: [ " +
           "{ $or: [ {'requester': ?0}, {'recipient': ?0} ] }, " +
           "{ 'status': ?1 } ] }")
    List<Friend> findFriendshipsByUserAndStatus(User user, FriendshipStatus status);

    default List<Friend> findAcceptedFriendshipsByUser(User user) {
        List<Friend> asRequester = findByRequesterAndStatus(user, FriendshipStatus.ACCEPTED);
        List<Friend> asRecipient = findByRecipientAndStatus(user, FriendshipStatus.ACCEPTED);
        
        List<Friend> allFriendships = new ArrayList<>();
        allFriendships.addAll(asRequester);
        allFriendships.addAll(asRecipient);
        
        return allFriendships;
    }
    
    default List<Friend> findPendingRequestsReceivedByUser(User user) {
        return findByRecipientAndStatus(user, FriendshipStatus.PENDING);
    }
    
    default List<Friend> findPendingRequestsSentByUser(User user) {
        return findByRequesterAndStatus(user, FriendshipStatus.PENDING);
    }
    
    default Optional<Friend> findFriendshipBetweenUsers(User user1, User user2) {
        List<Friend> friendships = findByRequesterOrRecipient(user1, user2);
        return friendships.stream()
            .filter(f -> (f.getRequester().equals(user1) && f.getRecipient().equals(user2)) ||
                        (f.getRequester().equals(user2) && f.getRecipient().equals(user1)))
            .findFirst();
    }
    
    default Optional<Friend> findAcceptedFriendshipBetweenUsers(User user1, User user2) {
        return findFriendshipBetweenUsers(user1, user2)
            .filter(f -> f.getStatus() == FriendshipStatus.ACCEPTED);
    }
}
