package com.cinemate.social.forum.subscription;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.user.User;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "forum_subscriptions")
public class ForumSubscription {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    @DBRef
    private ForumPost post;
    
    private Date subscribedAt;
    private boolean isActive;
    
    public ForumSubscription() {}
    
    public ForumSubscription(User user, ForumPost post) {
        this.user = user;
        this.post = post;
        this.subscribedAt = new Date();
        this.isActive = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public ForumPost getPost() { return post; }
    public void setPost(ForumPost post) { this.post = post; }
    
    public Date getSubscribedAt() { return subscribedAt; }
    public void setSubscribedAt(Date subscribedAt) { this.subscribedAt = subscribedAt; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
