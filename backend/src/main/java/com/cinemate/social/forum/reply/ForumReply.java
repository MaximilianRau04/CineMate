package com.cinemate.social.forum.reply;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "forum_replies")
@Getter
@Setter
@NoArgsConstructor
public class ForumReply {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    
    private String content;
    
    @DBRef
    @JsonIgnoreProperties({"movieWatchlist", "seriesWatchlist", "movieFavorites", "seriesFavorites", 
                          "moviesWatched", "seriesWatched", "notificationPreferences", "password"})
    private User author;
    
    @DBRef
    @JsonBackReference
    private ForumPost parentPost;
    
    private Date createdAt;
    private Date lastModified;
    
    private int likesCount;
    private boolean isDeleted;

    
    public ForumReply(String content, User author, ForumPost parentPost) {
        this.content = content;
        this.author = author;
        this.parentPost = parentPost;
        this.createdAt = new Date();
        this.lastModified = new Date();
        this.likesCount = 0;
        this.isDeleted = false;
    }
}
