package com.cinemate.user;

import com.cinemate.movie.Movie;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private List<Movie> watchlist;
    private List<Movie> favorites;
    private List<Movie> watched;

    public User(String username, String id, String password, String email) {
        this.username = username;
        this.id = id;
        this.password = password;
        this.email = email;
        this.watchlist = new ArrayList<>();
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

    public List<Movie> getWatchlist() {
        return watchlist;
    }

    public void setWatchlist(List<Movie> watchlist) {
        this.watchlist = watchlist;
    }

    public void addMovieToWatchlist(Movie movie) {
        if (!watchlist.contains(movie)) {
            watchlist.add(movie);
        }
    }

    public void removeMovieFromWatchlist(Movie movie) {
        watchlist.removeIf(m -> m.getId().equals(movie.getId()));
    }
}
