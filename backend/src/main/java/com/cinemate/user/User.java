package com.cinemate.user;

import com.cinemate.movie.Movie;
import com.cinemate.notification.preference.NotificationPreference;
import com.cinemate.series.Series;
import com.cinemate.user.DTOs.UserRequestDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
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

    private boolean profilePublic = true;
    private boolean allowFriendRequests = true;
    private Date lastActiveAt;
    
    private List<NotificationPreference> notificationPreferences = new ArrayList<>();
    private boolean emailNotificationsEnabled = true;
    private boolean webNotificationsEnabled = true;
    private boolean summaryRecommendationsEnabled = false;


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
        if (!moviesWatched.contains(movie)) {
            moviesWatched.add(movie);
        }
    }

    public void removeMovieFromWatched(Movie movie) {
        moviesWatched.removeIf(m -> m.getId().equals(movie.getId()));
    }

    public void addSeriesToWatched(Series series) {
        if (!seriesWatched.contains(series)) {
            seriesWatched.add(series);
        }
    }

    public void removeSeriesFromWatched(Series series) {
        seriesWatched.removeIf(m -> m.getId().equals(series.getId()));
    }

}
