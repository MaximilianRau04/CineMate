package com.cinemate.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication);
    }

    @GetMapping("/watchlist")
    public ResponseEntity<List<User>> getAllWatchlist() {
        return null;
    }

    @PutMapping("/{id}/watchlist")
    public ResponseEntity<List<User>> getWatchlistOfUser(@PathVariable int id) {
        return null;
    }

}
