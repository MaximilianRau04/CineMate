package com.cinemate.social.forum.post;

import com.cinemate.social.forum.ForumCategory;
import com.cinemate.social.forum.reply.ForumReply;
import com.cinemate.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "forum_posts")
public class ForumPost {
    
    @Id
    private String id;
    
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
    
    public ForumPost() {}
    
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    
    public ForumCategory getCategory() { return category; }
    public void setCategory(ForumCategory category) { this.category = category; }
    
    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }
    
    public String getSeriesId() { return seriesId; }
    public void setSeriesId(String seriesId) { this.seriesId = seriesId; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getLastModified() { return lastModified; }
    public void setLastModified(Date lastModified) { this.lastModified = lastModified; }
    
    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    
    public int getRepliesCount() { return repliesCount; }
    public void setRepliesCount(int repliesCount) { this.repliesCount = repliesCount; }
    
    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }
    
    public List<ForumReply> getReplies() { return replies; }
    public void setReplies(List<ForumReply> replies) { this.replies = replies; }
    
    public boolean isPinned() { return isPinned; }
    public void setPinned(boolean pinned) { isPinned = pinned; }
    
    public boolean isLocked() { return isLocked; }
    public void setLocked(boolean locked) { isLocked = locked; }
    
    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }
}
