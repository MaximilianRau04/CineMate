package com.cinemate.notification.events;

import com.cinemate.review.Review;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ReviewCreatedEvent extends ApplicationEvent {
    private final Review review;
    private final String itemTitle;
    private final String itemType;

    public ReviewCreatedEvent(Object source, Review review, String itemTitle, String itemType) {
        super(source);
        this.review = review;
        this.itemTitle = itemTitle;
        this.itemType = itemType;
    }

}
