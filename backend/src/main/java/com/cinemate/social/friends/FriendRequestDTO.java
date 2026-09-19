package com.cinemate.social.friends;

import com.cinemate.user.DTOs.UserResponseDTO;
import java.util.Date;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
