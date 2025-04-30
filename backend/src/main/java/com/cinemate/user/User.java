package com.cinemate.user;

import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    @NotNull
    private String username;
    @NotNull
    private String password;
    @Email
    private String email;
    private String bio;
    private String avatarUrl;
    private Date joinedAt;
    @ManyToMany
    private List<Movie> movieWatchlist;
    @ManyToMany
    private List<Series> seriesWatchlist;
    // private List<Movie> favorites;
    // private List<Movie> watched;


    public User(String id, String username, String password, String email, String bio, String avatarUrl, Date joinedAt, List<Movie> movieWatchlist, List<Series> seriesWatchlist) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.joinedAt = joinedAt;
        this.movieWatchlist = movieWatchlist;
        this.seriesWatchlist = seriesWatchlist;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Movie> getMovieWatchlist() {
        return movieWatchlist;
    }

    public void setMovieWatchlist(List<Movie> movieWatchlist) {
        this.movieWatchlist = movieWatchlist;
    }

    public List<Series> getSeriesWatchlist() {
        return seriesWatchlist;
    }

    public void setSeriesWatchlist(List<Series> seriesWatchlist) {
        this.seriesWatchlist = seriesWatchlist;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Date getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Date joinedAt) {
        this.joinedAt = joinedAt;
    }

    public void addMovieToWatchlist(Movie movie) {
        if (!movieWatchlist.contains(movie)) {
            movieWatchlist.add(movie);
        }
    }

    public void removeMovieFromWatchlist(Movie movie) {
        movieWatchlist.removeIf(m -> m.getId().equals(movie.getId()));
    }

    public void addSeriesToWatchlist(Series series) {
        if (!seriesWatchlist.contains(series)) {
            seriesWatchlist.add(series);
        }
    }

    public void removeSeriesFromWatchlist(Series series) {
        seriesWatchlist.removeIf(m -> m.getId().equals(series.getId()));
    }
}
