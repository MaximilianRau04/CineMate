package com.cinemate.customlist.dtos;

import com.cinemate.customlist.ListComment;
import com.cinemate.user.dtos.UserResponseDTO;

import java.util.Date;

public class ListCommentResponseDTO {
    
    private String id;
    private String customListId;
    private UserResponseDTO author;
    private String content;
    private Date createdAt;
    private Date updatedAt;

    public ListCommentResponseDTO() {}

    public ListCommentResponseDTO(ListComment comment) {
        this.id = comment.getId();
        this.customListId = comment.getCustomList().getId();
        this.author = comment.getAuthor() != null ? new UserResponseDTO(comment.getAuthor()) : null;
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomListId() {
        return customListId;
    }

    public void setCustomListId(String customListId) {
        this.customListId = customListId;
    }

    public UserResponseDTO getAuthor() {
        return author;
    }

    public void setAuthor(UserResponseDTO author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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
