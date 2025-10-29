package com.cinemate.user.DTOs;

import com.cinemate.user.Role;
import com.cinemate.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO implements Serializable {
    private String id;
    private String username;
    private String password;
    private String email;
    private String bio;
    private String avatarUrl;
    private Date joinedAt;
    private Role role;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
        this.bio = user.getBio();
        this.avatarUrl = user.getAvatarUrl();
        this.joinedAt = user.getJoinedAt();
        this.role = user.getRole();
    }
}
