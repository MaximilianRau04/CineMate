package com.cinemate.user;

import com.cinemate.movie.Movie;
import com.cinemate.series.Series;
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
    private List<Movie> movieWatchlist;
    private List<Series> seriesWatchlist;
    // private List<Movie> favorites;
    // private List<Movie> watched;

    public User(String username, String id, String password, String email) {
        this.username = username;
        this.id = id;
        this.password = password;
        this.email = email;
        this.movieWatchlist = new ArrayList<>();
        this.seriesWatchlist = new ArrayList<>();
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
