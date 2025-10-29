package com.cinemate.social.friends;

import com.cinemate.user.DTOs.UserResponseDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
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
}
