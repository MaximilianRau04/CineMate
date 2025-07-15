package com.cinemate.social.friends;

import com.cinemate.user.dtos.UserResponseDTO;

import java.util.Date;

public class FriendRequestDTO {
    
    private String id;
    private UserResponseDTO requester;
    private Date requestedAt;
    private FriendshipStatus status;
    
    public FriendRequestDTO(Friend friend) {
        this.id = friend.getId();
        this.requester = new UserResponseDTO(friend.getRequester());
        this.requestedAt = friend.getRequestedAt();
        this.status = friend.getStatus();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public UserResponseDTO getRequester() { return requester; }
    public void setRequester(UserResponseDTO requester) { this.requester = requester; }
    
    public Date getRequestedAt() { return requestedAt; }
    public void setRequestedAt(Date requestedAt) { this.requestedAt = requestedAt; }
    
    public FriendshipStatus getStatus() { return status; }
    public void setStatus(FriendshipStatus status) { this.status = status; }
}
