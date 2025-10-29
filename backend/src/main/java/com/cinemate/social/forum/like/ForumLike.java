package com.cinemate.social.forum.like;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.social.forum.reply.ForumReply;
import com.cinemate.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "forum_likes")
@Getter
@Setter
@NoArgsConstructor
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
}
