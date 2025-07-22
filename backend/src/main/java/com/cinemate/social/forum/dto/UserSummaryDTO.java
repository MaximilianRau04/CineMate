package com.cinemate.social.forum.dto;

import com.cinemate.user.User;
import java.util.Date;

/**
 * Simplified DTO for User information to avoid circular references
 */
public class UserSummaryDTO {
    private String id;
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private Date joinedAt;
    private boolean profilePublic;

    public UserSummaryDTO() {}

    public UserSummaryDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.bio = user.getBio();
        this.avatarUrl = user.getAvatarUrl();
        this.joinedAt = user.getJoinedAt();
        this.profilePublic = user.isProfilePublic();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Date getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Date joinedAt) { this.joinedAt = joinedAt; }

    public boolean isProfilePublic() { return profilePublic; }
    public void setProfilePublic(boolean profilePublic) { this.profilePublic = profilePublic; }
}
