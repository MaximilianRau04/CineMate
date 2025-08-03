package com.cinemate.customlist.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CustomListRequestDTO {
    
    @NotNull
    @Size(min = 1, max = 100)
    private String title;
    
    @Size(max = 500)
    private String description;
    
    private boolean isPublic = true;
    
    private String coverImageUrl;
    
    private List<String> tags;

    public CustomListRequestDTO() {}

    public CustomListRequestDTO(String title, String description, boolean isPublic) {
        this.title = title;
        this.description = description;
        this.isPublic = isPublic;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
