package com.cinemate.notification.events;

import com.cinemate.social.forum.post.ForumPost;
import org.springframework.context.ApplicationEvent;

public class ForumPostCreatedEvent extends ApplicationEvent {
    private final ForumPost forumPost;
    
    public ForumPostCreatedEvent(Object source, ForumPost forumPost) {
        super(source);
        this.forumPost = forumPost;
    }
    
    public ForumPost getForumPost() {
        return forumPost;
    }
}
