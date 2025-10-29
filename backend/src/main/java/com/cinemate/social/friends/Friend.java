package com.cinemate.social.friends;

import com.cinemate.user.User;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "friendships")
@Getter
@Setter
@NoArgsConstructor
public class Friend {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    @DBRef
    private User requester;
    @DBRef 
    private User recipient;
    private FriendshipStatus status;
    private Date requestedAt;
    private Date acceptedAt;
    
    public Friend(User requester, User recipient) {
        this.requester = requester;
        this.recipient = recipient;
        this.status = FriendshipStatus.PENDING;
        this.requestedAt = new Date();
    }

}
