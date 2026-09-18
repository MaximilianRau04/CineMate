package com.cinemate.customlist;

import com.cinemate.user.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "list_comments")
public class ListComment {

    @Id
    private String id;
    
    @DBRef
    private CustomList customList;
    
    @DBRef
    private User author;
    
    @NotNull
    @Size(min = 1, max = 1000)
    private String content;
    
    private Date createdAt;
    
    private Date updatedAt;

    public ListComment() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public ListComment(CustomList customList, User author, String content) {
        this();
        this.customList = customList;
        this.author = author;
        this.content = content;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CustomList getCustomList() {
        return customList;
    }

    public void setCustomList(CustomList customList) {
        this.customList = customList;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
