package com.cinemate.social.forum.DTOs;

import com.cinemate.social.forum.ForumCategory;
import com.cinemate.social.forum.post.ForumPost;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
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
        this.likedByCurrentUser = false;
    }

    public ForumPostDTO(ForumPost post, String userId) {
        this(post);
    }

    public ForumPostDTO(ForumPost post, String userId, boolean likedByCurrentUser) {
        this(post);
        this.likedByCurrentUser = likedByCurrentUser;
    }
}
