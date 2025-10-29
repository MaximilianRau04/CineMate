package com.cinemate.notification.events;

import com.cinemate.social.forum.post.ForumPost;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ForumPostCreatedEvent extends ApplicationEvent {
    private final ForumPost forumPost;
    
    public ForumPostCreatedEvent(Object source, ForumPost forumPost) {
        super(source);
        this.forumPost = forumPost;
    }

}
