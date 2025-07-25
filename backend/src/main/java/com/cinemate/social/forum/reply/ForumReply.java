package com.cinemate.social.forum.reply;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "forum_replies")
public class ForumReply {
    
    @Id
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
    
    public ForumReply() {}
    
    public ForumReply(String content, User author, ForumPost parentPost) {
        this.content = content;
        this.author = author;
        this.parentPost = parentPost;
        this.createdAt = new Date();
        this.lastModified = new Date();
        this.likesCount = 0;
        this.isDeleted = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    
    public ForumPost getParentPost() { return parentPost; }
    public void setParentPost(ForumPost parentPost) { this.parentPost = parentPost; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getLastModified() { return lastModified; }
    public void setLastModified(Date lastModified) { this.lastModified = lastModified; }
    
    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    
    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }
}
