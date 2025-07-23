package com.cinemate.social.forum.dto;

import com.cinemate.social.forum.ForumCategory;
import com.cinemate.social.forum.post.ForumPost;
import java.util.Date;

/**
 * Data Transfer Object for ForumPost to prevent circular references in JSON serialization
 */
public class ForumPostDTO {
    private String id;
    private String title;
    private String content;
    private UserSummaryDTO author;
    private ForumCategory category;
    private String movieId;
    private String seriesId;
    private Date createdAt;
    private Date lastModified;
    private int likesCount;
    private int repliesCount;
    private int views;
    private boolean isPinned;
    private boolean isLocked;
    private boolean isDeleted;
    private boolean likedByCurrentUser;

    public ForumPostDTO() {}

    public ForumPostDTO(ForumPost post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        if (post.getAuthor() != null) {
            this.author = new UserSummaryDTO(post.getAuthor());
        }
        this.category = post.getCategory();
        this.movieId = post.getMovieId();
        this.seriesId = post.getSeriesId();
        this.createdAt = post.getCreatedAt();
        this.lastModified = post.getLastModified();
        this.likesCount = post.getLikesCount();
        this.repliesCount = post.getRepliesCount();
        this.views = post.getViews();
        this.isPinned = post.isPinned();
        this.isLocked = post.isLocked();
        this.isDeleted = post.isDeleted();
        this.likedByCurrentUser = false; // Default value
    }

    public ForumPostDTO(ForumPost post, String userId) {
        this(post); // Call the main constructor
        // The likedByCurrentUser field will be set by the service layer
    }

    public ForumPostDTO(ForumPost post, String userId, boolean likedByCurrentUser) {
        this(post); // Call the main constructor
        this.likedByCurrentUser = likedByCurrentUser;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public UserSummaryDTO getAuthor() { return author; }
    public void setAuthor(UserSummaryDTO author) { this.author = author; }

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

    public boolean isPinned() { return isPinned; }
    public void setPinned(boolean pinned) { isPinned = pinned; }

    public boolean isLocked() { return isLocked; }
    public void setLocked(boolean locked) { isLocked = locked; }

    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }

    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }

    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }

    // Alias for Jackson serialization
    public boolean getLikedByCurrentUser() { return likedByCurrentUser; }
    public int getLikes() { return likesCount; }
}
