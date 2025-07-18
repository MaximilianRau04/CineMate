package com.cinemate.notification.events;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.social.forum.reply.ForumReply;
import org.springframework.context.ApplicationEvent;

public class ForumReplyCreatedEvent extends ApplicationEvent {
    private final ForumReply forumReply;
    private final ForumPost forumPost;
    
    public ForumReplyCreatedEvent(Object source, ForumReply forumReply, ForumPost forumPost) {
        super(source);
        this.forumReply = forumReply;
        this.forumPost = forumPost;
    }
    
    public ForumReply getForumReply() {
        return forumReply;
    }
    
    public ForumPost getForumPost() {
        return forumPost;
    }
}
