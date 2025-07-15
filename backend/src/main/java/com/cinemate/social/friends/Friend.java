package com.cinemate.social.friends;

import com.cinemate.user.User;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "friendships")
public class Friend {
    
    @Id
    private String id;
    
    @DBRef
    private User requester;
    
    @DBRef 
    private User recipient;
    
    private FriendshipStatus status;
    private Date requestedAt;
    private Date acceptedAt;
    
    public Friend() {}
    
    public Friend(User requester, User recipient) {
        this.requester = requester;
        this.recipient = recipient;
        this.status = FriendshipStatus.PENDING;
        this.requestedAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }
    
    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }
    
    public FriendshipStatus getStatus() { return status; }
    public void setStatus(FriendshipStatus status) { this.status = status; }
    
    public Date getRequestedAt() { return requestedAt; }
    public void setRequestedAt(Date requestedAt) { this.requestedAt = requestedAt; }
    
    public Date getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(Date acceptedAt) { this.acceptedAt = acceptedAt; }
}
