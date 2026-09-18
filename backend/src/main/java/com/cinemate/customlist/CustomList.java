package com.cinemate.customlist;

import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
import com.cinemate.user.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "custom_lists")
public class CustomList {

    @Id
    private String id;
    
    @NotNull
    @Size(min = 1, max = 100)
    private String title;
    
    @Size(max = 500)
    private String description;
    
    @DBRef
    private User creator;
    
    @DBRef(lazy = true)
    private List<Movie> movies = new ArrayList<>();
    
    @DBRef(lazy = true)
    private List<Series> series = new ArrayList<>();
    
    private boolean isPublic = true;
    
    private Date createdAt;
    
    private Date updatedAt;
    
    private int likesCount = 0;
    
    @DBRef(lazy = true)
    private List<User> likedBy = new ArrayList<>();
    
    private String coverImageUrl;
    
    private List<String> tags = new ArrayList<>();

    public CustomList() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public CustomList(String title, String description, User creator, boolean isPublic) {
        this();
        this.title = title;
        this.description = description;
        this.creator = creator;
        this.isPublic = isPublic;
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

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }

    public List<Series> getSeries() {
        return series;
    }

    public void setSeries(List<Series> series) {
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

    public List<User> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(List<User> likedBy) {
        this.likedBy = likedBy;
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

    // Helper methods
    public void addMovie(Movie movie) {
        if (!movies.contains(movie)) {
            movies.add(movie);
            updateTimestamp();
        }
    }

    public void removeMovie(Movie movie) {
        movies.removeIf(m -> m.getId().equals(movie.getId()));
        updateTimestamp();
    }

    public void addSeries(Series series) {
        if (!this.series.contains(series)) {
            this.series.add(series);
            updateTimestamp();
        }
    }

    public void removeSeries(Series series) {
        this.series.removeIf(s -> s.getId().equals(series.getId()));
        updateTimestamp();
    }

    public void addLike(User user) {
        if (!likedBy.contains(user)) {
            likedBy.add(user);
            likesCount++;
        }
    }

    public void removeLike(User user) {
        if (likedBy.removeIf(u -> u.getId().equals(user.getId()))) {
            likesCount--;
        }
    }

    public boolean isLikedBy(User user) {
        return likedBy.stream().anyMatch(u -> u.getId().equals(user.getId()));
    }

    private void updateTimestamp() {
        this.updatedAt = new Date();
    }

    public int getTotalItemsCount() {
        return movies.size() + series.size();
    }
}
