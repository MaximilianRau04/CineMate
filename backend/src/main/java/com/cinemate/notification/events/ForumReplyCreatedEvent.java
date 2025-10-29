package com.cinemate.notification.events;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.social.forum.reply.ForumReply;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ForumReplyCreatedEvent extends ApplicationEvent {
    private final ForumReply forumReply;
    private final ForumPost forumPost;
    
    public ForumReplyCreatedEvent(Object source, ForumReply forumReply, ForumPost forumPost) {
        super(source);
        this.forumReply = forumReply;
        this.forumPost = forumPost;
    }

}
