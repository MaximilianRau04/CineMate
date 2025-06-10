package com.cinemate.user;

import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
import com.cinemate.user.dtos.UserRequestDTO;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    @NotNull
    private String username;
    @Size(min = 6, max = 40)
    @NotNull
    private String password;
    @Email
    private String email;
    private String bio;
    private String avatarUrl;
    private Date joinedAt;
    @DBRef(lazy = true)
    private List<Movie> movieWatchlist = new ArrayList<>();
    @DBRef(lazy = true)
    private List<Series> seriesWatchlist = new ArrayList<>();
    private Role role;
    @DBRef(lazy = true)
    private List<Movie> movieFavorites = new ArrayList<>();
    @DBRef(lazy = true)
    private List<Series> seriesFavorites = new ArrayList<>();
    @DBRef(lazy = true)
    private List<Movie> moviesWatched = new ArrayList<>();
    @DBRef(lazy = true)
    private List<Series> seriesWatched = new ArrayList<>();
    // private List<User> followers
    // private List<User> following;


    public User(String id, String username, String password, String email, String bio, String avatarUrl, Date joinedAt, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.joinedAt = joinedAt;
        this.role = role;
    }

    public User(UserRequestDTO user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
        this.bio = user.getBio();
        this.avatarUrl = user.getAvatarUrl();
        this.joinedAt = user.getJoinedAt();
        this.role = user.getRole();
    }

    public User() {}

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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Movie> getMovieFavorites() {
        return movieFavorites;
    }

    public void setMovieFavorites(List<Movie> movieFavorites) {
        this.movieFavorites = movieFavorites;
    }

    public List<Series> getSeriesFavorites() {
        return seriesFavorites;
    }

    public void setSeriesFavorites(List<Series> seriesFavorites) {
        this.seriesFavorites = seriesFavorites;
    }

    public List<Movie> getMoviesWatched() {
        return moviesWatched;
    }

    public void setMoviesWatched(List<Movie> moviesWatched) {
        this.moviesWatched = moviesWatched;
    }

    public List<Series> getSeriesWatched() {
        return seriesWatched;
    }

    public void setSeriesWatched(List<Series> seriesWatched) {
        this.seriesWatched = seriesWatched;
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

    public void addMovieToFavorites(Movie movie) {
        if (!movieFavorites.contains(movie)) {
            movieFavorites.add(movie);
        }
    }

    public void removeMovieFromFavorites(Movie movie) {
        movieFavorites.removeIf(m -> m.getId().equals(movie.getId()));
    }

    public void addSeriesToFavorites(Series series) {
        if (!seriesFavorites.contains(series)) {
            seriesFavorites.add(series);
        }
    }

    public void removeSeriesFromFavorites(Series series) {
        seriesFavorites.removeIf(m -> m.getId().equals(series.getId()));
    }

    public void addMovieToWatched(Movie movie) {
        if (!movieWatchlist.contains(movie)) {
            movieWatchlist.add(movie);
        }
    }

    public void removeMovieFromWatched(Movie movie) {
        movieWatchlist.removeIf(m -> m.getId().equals(movie.getId()));
    }

    public void addSeriesToWatched(Series series) {
        if (!seriesWatchlist.contains(series)) {
            seriesWatchlist.add(series);
        }
    }

    public void removeSeriesFromWatched(Series series) {
        seriesWatchlist.removeIf(m -> m.getId().equals(series.getId()));
    }

}
