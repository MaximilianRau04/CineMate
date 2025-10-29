package com.cinemate.user.DTOs;

import com.cinemate.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class UserRequestDTO {
    private String id;
    @NotNull
    private String username;
    @Size(min = 6, max = 40)
    @NotNull
    private String password;
    @Email
    private String email;
    private String bio;
    private String avatarUrl;
    private boolean removeAvatar;
    private Date joinedAt;
    private Role role;

    public UserRequestDTO(String id, String username, String password, String email, String bio, String avatarUrl, Date joinedAt, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.joinedAt = joinedAt;
        this.role = role;
    }
}
