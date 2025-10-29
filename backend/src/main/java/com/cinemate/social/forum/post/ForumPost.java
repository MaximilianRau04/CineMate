package com.cinemate.social.forum.post;

import com.cinemate.social.forum.ForumCategory;
import com.cinemate.social.forum.reply.ForumReply;
import com.cinemate.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "forum_posts")
@Getter
@Setter
@NoArgsConstructor
public class ForumPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    @NotNull
    private String title;
    private String content;
    
    @DBRef
    @JsonIgnoreProperties({"movieWatchlist", "seriesWatchlist", "movieFavorites", "seriesFavorites", 
                          "moviesWatched", "seriesWatched", "notificationPreferences", "password"})
    private User author;
    
    private ForumCategory category;
    private String movieId;
    private String seriesId;
    
    private Date createdAt;
    private Date lastModified;
    
    private int likesCount;
    private int repliesCount;
    private int views = 0;
    
    @DBRef
    @JsonIgnore 
    private List<ForumReply> replies = new ArrayList<>();
    
    private boolean isPinned;
    private boolean isLocked;
    private boolean isDeleted;

    
    public ForumPost(String title, String content, User author, ForumCategory category) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
        this.createdAt = new Date();
        this.lastModified = new Date();
        this.likesCount = 0;
        this.repliesCount = 0;
        this.isPinned = false;
        this.isLocked = false;
        this.isDeleted = false;
    }
}
