package com.cinemate.social.forum.subscription;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.user.User;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "forum_subscriptions")
@Getter
@Setter
@NoArgsConstructor
public class ForumSubscription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    @DBRef
    private User user;
    @DBRef
    private ForumPost post;
    private Date subscribedAt;
    private boolean isActive;
    
    public ForumSubscription(User user, ForumPost post) {
        this.user = user;
        this.post = post;
        this.subscribedAt = new Date();
        this.isActive = true;
    }
}
