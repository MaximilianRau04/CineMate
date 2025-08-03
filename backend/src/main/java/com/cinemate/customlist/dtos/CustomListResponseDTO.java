package com.cinemate.customlist.dtos;

import com.cinemate.customlist.CustomList;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.user.dtos.UserResponseDTO;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class CustomListResponseDTO {
    
    private String id;
    private String title;
    private String description;
    private UserResponseDTO creator;
    private List<MovieResponseDTO> movies;
    private List<SeriesResponseDTO> series;
    private boolean isPublic;
    private Date createdAt;
    private Date updatedAt;
    private int likesCount;
    private String coverImageUrl;
    private List<String> tags;
    private int totalItemsCount;
    private boolean isLikedByCurrentUser;

    public CustomListResponseDTO() {}

    public CustomListResponseDTO(CustomList customList) {
        this.id = customList.getId();
        this.title = customList.getTitle();
        this.description = customList.getDescription();
        this.creator = customList.getCreator() != null ? new UserResponseDTO(customList.getCreator()) : null;
        this.movies = customList.getMovies().stream().map(MovieResponseDTO::new).collect(Collectors.toList());
        this.series = customList.getSeries().stream().map(SeriesResponseDTO::new).collect(Collectors.toList());
        this.isPublic = customList.isPublic();
        this.createdAt = customList.getCreatedAt();
        this.updatedAt = customList.getUpdatedAt();
        this.likesCount = customList.getLikesCount();
        this.coverImageUrl = customList.getCoverImageUrl();
        this.tags = customList.getTags();
        this.totalItemsCount = customList.getTotalItemsCount();
        this.isLikedByCurrentUser = false;
    }

    public CustomListResponseDTO(CustomList customList, boolean isLikedByCurrentUser) {
        this(customList);
        this.isLikedByCurrentUser = isLikedByCurrentUser;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public UserResponseDTO getCreator() {
        return creator;
    }

    public void setCreator(UserResponseDTO creator) {
        this.creator = creator;
    }

    public List<MovieResponseDTO> getMovies() {
        return movies;
    }

    public void setMovies(List<MovieResponseDTO> movies) {
        this.movies = movies;
    }

    public List<SeriesResponseDTO> getSeries() {
        return series;
    }

    public void setSeries(List<SeriesResponseDTO> series) {
        this.series = series;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
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

    public int getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
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

    public int getTotalItemsCount() {
        return totalItemsCount;
    }

    public void setTotalItemsCount(int totalItemsCount) {
        this.totalItemsCount = totalItemsCount;
    }

    public boolean isLikedByCurrentUser() {
        return isLikedByCurrentUser;
    }

    public void setLikedByCurrentUser(boolean likedByCurrentUser) {
        isLikedByCurrentUser = likedByCurrentUser;
    }
}
