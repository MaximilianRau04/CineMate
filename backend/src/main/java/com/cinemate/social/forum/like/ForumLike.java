package com.cinemate.social.forum.like;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.social.forum.reply.ForumReply;
import com.cinemate.user.User;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "forum_likes")
public class ForumLike {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    @DBRef
    private ForumPost post;
    
    @DBRef
    private ForumReply reply;
    
    private Date createdAt;
    private String likeType;
    
    public ForumLike() {}
    
    public ForumLike(User user, ForumPost post) {
        this.user = user;
        this.post = post;
        this.createdAt = new Date();
        this.likeType = "POST";
    }
    
    public ForumLike(User user, ForumReply reply) {
        this.user = user;
        this.reply = reply;
        this.createdAt = new Date();
        this.likeType = "REPLY";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public ForumPost getPost() { return post; }
    public void setPost(ForumPost post) { this.post = post; }
    
    public ForumReply getReply() { return reply; }
    public void setReply(ForumReply reply) { this.reply = reply; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public String getLikeType() { return likeType; }
    public void setLikeType(String likeType) { this.likeType = likeType; }
}
