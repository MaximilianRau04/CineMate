package com.cinemate.social.forum.DTOs;

import com.cinemate.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class UserSummaryDTO {
    private String id;
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private Date joinedAt;
    private boolean profilePublic;

    public UserSummaryDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.bio = user.getBio();
        this.avatarUrl = user.getAvatarUrl();
        this.joinedAt = user.getJoinedAt();
        this.profilePublic = user.isProfilePublic();
    }
}
