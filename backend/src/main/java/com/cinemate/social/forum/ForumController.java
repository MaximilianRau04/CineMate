package com.cinemate.social.forum;

import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.social.forum.reply.ForumReply;
import com.cinemate.social.forum.subscription.ForumSubscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for managing forum operations.
 * Provides endpoints for creating, reading, updating, and deleting forum posts and replies.
 * Includes functionality for subscription management, search, and administrative operations.
 * 
 * @author CineMate Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "http://localhost:3000")
public class ForumController {
    
    @Autowired
    private ForumService forumService;

    /**
     * Handles the creation of a new forum post. The authenticated user is associated
     * with the post as the creator. Responds with the created post along with the status.
     *
     * @param post The forum post data included in the body of the request.
     * @return A ResponseEntity containing the created ForumPost and an HTTP status code.
     */
    @PostMapping("/posts")
    public ResponseEntity<ForumPost> createPost(@RequestBody ForumPost post) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = null;
            
            // Check if user is authenticated
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                userId = auth.getName();
            }
            
            // For testing purposes, use a default user if no authentication
            if (userId == null) {
                // Try to find any existing user or create a test user
                userId = "testuser"; // This should be a valid user ID from your database
            }
            
            ForumPost createdPost = forumService.createPost(post, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            System.err.println("Error creating post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Retrieves a paginated list of forum posts, optionally filtered by category or sorted by criteria.
     *
     * @param page the page number to retrieve, defaults to 0 if not specified
     * @param size the number of posts per page, defaults to 10 if not specified
     * @param category optional parameter to filter posts by category
     * @param sortBy optional parameter to sort posts, e.g., "popular" or "recent"
     * @return ResponseEntity containing a Page object with the requested forum posts
     */
    @GetMapping("/posts")
    public ResponseEntity<Page<ForumPost>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumPost> posts;
        
        if (category != null && !category.isEmpty()) {
            ForumCategory forumCategory = ForumCategory.valueOf(category.toUpperCase());
            posts = forumService.getPostsByCategory(forumCategory, pageable);
        } else if ("popular".equals(sortBy)) {
            posts = forumService.getPopularPosts(pageable);
        } else if ("recent".equals(sortBy)) {
            posts = forumService.getRecentlyActiveePosts(pageable);
        } else {
            posts = forumService.getAllPosts(pageable);
        }
        
        return ResponseEntity.ok(posts);
    }

    /**
     * Retrieves a specific forum post by its unique identifier.
     *
     * @param id the unique identifier of the forum post to retrieve
     * @return a ResponseEntity containing the ForumPost if found
     */
    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable String id) {
        Optional<ForumPost> post = forumService.getPostById(id);
        return post.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves a list of pinned forum posts.
     *
     * @return a ResponseEntity containing a list of pinned forum posts as the body of the response
     */
    @GetMapping("/posts/pinned")
    public ResponseEntity<List<ForumPost>> getPinnedPosts() {
        List<ForumPost> pinnedPosts = forumService.getPinnedPosts();
        return ResponseEntity.ok(pinnedPosts);
    }

    /**
     * Searches for forum posts based on the given query.
     *
     * @param query the search query string used to search posts
     * @param page the page number for pagination, defaults to 0 if not specified
     * @param size the number of posts per page for pagination, defaults to 10 if not specified
     * @return a ResponseEntity containing a paginated result of forum posts matching the query
     */
    @GetMapping("/posts/search")
    public ResponseEntity<Page<ForumPost>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumPost> posts = forumService.searchPosts(query, pageable);
        return ResponseEntity.ok(posts);
    }

    /**
     * Retrieves a paginated list of forum posts created by a specific user.
     *
     * @param userId the unique identifier of the user whose posts are to be retrieved
     * @param page the page number of the results to be retrieved (default is 0)
     * @param size the number of posts per page (default is 10)
     * @return a ResponseEntity containing a Page of ForumPost objects authored by the specified user
     */
    @GetMapping("/posts/user/{userId}")
    public ResponseEntity<Page<ForumPost>> getPostsByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumPost> posts = forumService.getPostsByAuthor(userId, pageable);
        return ResponseEntity.ok(posts);
    }

    /**
     * Retrieves a paginated list of forum posts related to a specific movie.
     *
     * @param movieId the unique identifier of the movie for which the forum posts are requested
     * @param page the page number to retrieve (default is 0)
     * @param size the number of items per page (default is 10)
     * @return a ResponseEntity containing a paginated list of ForumPost objects
     */
    @GetMapping("/posts/movie/{movieId}")
    public ResponseEntity<Page<ForumPost>> getPostsByMovie(
            @PathVariable String movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumPost> posts = forumService.getPostsByMovieId(movieId, pageable);
        return ResponseEntity.ok(posts);
    }

    /**
     * Retrieves a paginated list of forum posts associated with a specific series.
     *
     * @param seriesId the identifier of the series to fetch posts for
     * @param page the page number to retrieve, defaults to 0 if not specified
     * @param size the number of posts per page to retrieve, defaults to 10 if not specified
     * @return a ResponseEntity containing a Page of ForumPost objects associated with the specified series
     */
    @GetMapping("/posts/series/{seriesId}")
    public ResponseEntity<Page<ForumPost>> getPostsBySeries(
            @PathVariable String seriesId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumPost> posts = forumService.getPostsBySeriesId(seriesId, pageable);
        return ResponseEntity.ok(posts);
    }

    /**
     * Retrieves a paginated list of forum posts that a specific user has participated in.
     *
     * @param userId the ID of the user whose participated posts are being retrieved
     * @param page the page number to retrieve, defaults to 0 if not provided
     * @param size the number of posts per page, defaults to 10 if not provided
     * @return a ResponseEntity containing a paginated list of forum posts the user has participated in
     */
    @GetMapping("/posts/user/{userId}/participated")
    public ResponseEntity<Page<ForumPost>> getPostsUserParticipatedIn(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumPost> posts = forumService.getPostsUserParticipatedIn(userId, pageable);
        return ResponseEntity.ok(posts);
    }

    /**
     * Updates an existing forum post by its identifier. The method ensures that only
     * an authenticated user with the necessary permissions can update the post.
     *
     * @param id the unique identifier of the forum post to be updated
     * @param post the updated post data to be applied
     * @return a ResponseEntity containing the updated ForumPost if successful
     */
    @PutMapping("/posts/{id}")
    public ResponseEntity<ForumPost> updatePost(@PathVariable String id, @RequestBody ForumPost post) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            ForumPost updatedPost = forumService.updatePost(id, post, userId);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    /**
     * Deletes a post with the specified ID if the authenticated user has the required permission.
     *
     * @param id the ID of the post to be deleted
     * @return a ResponseEntity with no content if the deletion is successful
     */
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            forumService.deletePost(id, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    /**
     * Toggles the like status of a forum post for the authenticated user. If the user already
     * likes the post, the like is removed. Otherwise, the user likes the post.
     *
     * @param id the unique identifier of the forum post to be liked or unliked
     * @return ResponseEntity containing the updated ForumPost object if successful
     */
    @PostMapping("/posts/{id}/like")
    public ResponseEntity<ForumPost> toggleLike(@PathVariable String id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            ForumPost post = forumService.toggleLike(id, userId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Creates a new reply to a forum post.
     *
     * @param postId the ID of the post to which the reply belongs
     * @param reply the reply object containing the details of the user's response
     * @return a ResponseEntity containing the created ForumReply object if successful
     */
    @PostMapping("/posts/{postId}/replies")
    public ResponseEntity<ForumReply> createReply(@PathVariable String postId, @RequestBody ForumReply reply) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            ForumReply createdReply = forumService.createReply(reply, userId, postId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReply);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * retrieve replies for a specific forum post.
     *
     * @param postId the unique identifier of the forum post for which replies are being fetched
     * @param page the page index for pagination, default is 0
     * @param size the number of replies per page for pagination, default is 10
     * @return a ResponseEntity containing a Page of ForumReply objects, which represents the paginated list of replies for the given post
     */
    @GetMapping("/posts/{postId}/replies")
    public ResponseEntity<Page<ForumReply>> getRepliesForPost(
            @PathVariable String postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumReply> replies = forumService.getRepliesForPost(postId, pageable);
        return ResponseEntity.ok(replies);
    }

    /**
     * Retrieves a paginated list of forum replies created by a specific user.
     *
     * @param userId the ID of the user whose replies are to be fetched
     * @param page the page number of the paginated results (default is 0)
     * @param size the number of replies per page in the paginated results (default is 10)
     * @return a ResponseEntity containing a page of ForumReply objects authored by the specified user
     */
    @GetMapping("/replies/user/{userId}")
    public ResponseEntity<Page<ForumReply>> getRepliesByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumReply> replies = forumService.getRepliesByAuthor(userId, pageable);
        return ResponseEntity.ok(replies);
    }

    /**
     * Updates an existing forum reply with the specified id.
     * The reply is updated if the authenticated user has permission to modify it.
     *
     * @param id the unique identifier of the reply to be updated
     * @param reply the ForumReply object containing the updated details
     * @return a ResponseEntity containing the updated ForumReply object
     */
    @PutMapping("/replies/{id}")
    public ResponseEntity<ForumReply> updateReply(@PathVariable String id, @RequestBody ForumReply reply) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            ForumReply updatedReply = forumService.updateReply(id, reply, userId);
            return ResponseEntity.ok(updatedReply);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    /**
     * Deletes a reply associated with the given ID, if the authenticated user is authorized to do so.
     *
     * @param id the unique identifier of the reply to be deleted
     * @return a ResponseEntity with no content if the deletion is successful, or a FORBIDDEN status if the user is not authorized
     */
    @DeleteMapping("/replies/{id}")
    public ResponseEntity<Void> deleteReply(@PathVariable String id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            forumService.deleteReply(id, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    /**
     * Toggles the like status for a forum reply by the currently authenticated user.
     * If the user has already liked the reply, the like is removed. If the user
     * has not liked the reply, a like is added.
     *
     * @param id the unique identifier
     */
    @PostMapping("/replies/{id}/like")
    public ResponseEntity<ForumReply> toggleReplyLike(@PathVariable String id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            ForumReply reply = forumService.toggleReplyLike(id, userId);
            return ResponseEntity.ok(reply);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Subscribes the authenticated user to a post using the provided post ID.
     *
     * @param postId the ID of the post to subscribe to
     * @return a ResponseEntity containing the details of the subscription if successful
     */
    @PostMapping("/posts/{postId}/subscribe")
    public ResponseEntity<ForumSubscription> subscribeToPost(@PathVariable String postId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            ForumSubscription subscription = forumService.subscribeToPost(postId, userId);
            return ResponseEntity.ok(subscription);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Handles the unsubscription of a user from a specific post. This method allows
     * authenticated users to unsubscribe from receiving notifications or updates
     * about a specified post.
     *
     * @param postId the unique identifier of the post that the user wants to unsubscribe from
     * @return a ResponseEntity with a no-content status (204) if the unsubscription is successful
     */
    @DeleteMapping("/posts/{postId}/unsubscribe")
    public ResponseEntity<Void> unsubscribeFromPost(@PathVariable String postId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            forumService.unsubscribeFromPost(postId, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Retrieves the subscription status for a specific post.
     *
     * @param postId the ID of the post for which the subscription status is being retrieved
     * @return a ResponseEntity containing a SubscriptionStatus object, which includes
     *          the subscription status of the user and the total number of subscribers for the post
     */
    @GetMapping("/posts/{postId}/subscription-status")
    public ResponseEntity<SubscriptionStatus> getSubscriptionStatus(@PathVariable String postId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            boolean isSubscribed = forumService.isUserSubscribedToPost(userId, postId);
            long subscriberCount = forumService.getSubscriptionCount(postId);
            
            SubscriptionStatus status = new SubscriptionStatus(isSubscribed, subscriberCount);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Fetches the list of forum subscriptions for the currently authenticated user.
     *
     * @return ResponseEntity containing a list of ForumSubscription objects
     *         representing the user's subscriptions on success, or
     *         ResponseEntity with a BAD_REQUEST status if an error occurs.
     */
    @GetMapping("/subscriptions")
    public ResponseEntity<List<ForumSubscription>> getUserSubscriptions() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            List<ForumSubscription> subscriptions = forumService.getUserSubscriptions(userId);
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Retrieves the count of posts for a specified category.
     *
     * @param category the name of the category whose post count is to be fetched
     * @return a ResponseEntity containing the count of posts in the specified category
     */
    @GetMapping("/stats/category/{category}")
    public ResponseEntity<Long> getPostCountByCategory(@PathVariable String category) {
        try {
            ForumCategory forumCategory = ForumCategory.valueOf(category.toUpperCase());
            long count = forumService.getPostCountByCategory(forumCategory);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(0L);
        }
    }

    /**
     * Retrieves statistics for a specific user including post and reply counts.
     *
     * @param userId the unique identifier of the user whose statistics are to be retrieved
     * @return a ResponseEntity containing ForumUserStats with the post count and reply count for the specified user
     */
    @GetMapping("/stats/user/{userId}")
    public ResponseEntity<ForumUserStats> getUserStats(@PathVariable String userId) {
        long postCount = forumService.getPostCountByAuthor(userId);
        long replyCount = forumService.getReplyCountByAuthor(userId);
        
        ForumUserStats stats = new ForumUserStats(postCount, replyCount);
        return ResponseEntity.ok(stats);
    }

    /**
     * Retrieves all available forum categories.
     *
     * @return a ResponseEntity containing an array of ForumCategory enums.
     */
    @GetMapping("/categories")
    public ResponseEntity<ForumCategory[]> getCategories() {
        return ResponseEntity.ok(ForumCategory.values());
    }

    /**
     * Pins or unpins a forum post based on the provided pinned status.
     * This endpoint is intended for administrative use.
     *
     * @param id the unique identifier of the forum post to be pinned or unpinned
     * @param pinned the desired pinned status; true to pin the post, false to unpin
     * @return a ResponseEntity containing the updated ForumPost if the operation is successful
     */
    @PostMapping("/admin/posts/{id}/pin")
    public ResponseEntity<ForumPost> pinPost(@PathVariable String id, @RequestParam boolean pinned) {
        try {
            // TODO: Add admin authorization check
            ForumPost post = forumService.pinPost(id, pinned);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Locks or unlocks a forum post based on the provided parameters.
     *
     * @param id the unique identifier of the forum post to be locked or unlocked
     * @param locked a boolean flag indicating whether the post should be locked (true) or unlocked (false)
     * @return a ResponseEntity containing the updated ForumPost object if the operation is successful
     */
    @PostMapping("/admin/posts/{id}/lock")
    public ResponseEntity<ForumPost> lockPost(@PathVariable String id, @RequestParam boolean locked) {
        try {
            // TODO: Add admin authorization check
            ForumPost post = forumService.lockPost(id, locked);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    public static class ForumUserStats {
        private long postCount;
        private long replyCount;
        
        public ForumUserStats(long postCount, long replyCount) {
            this.postCount = postCount;
            this.replyCount = replyCount;
        }
        
        public long getPostCount() { return postCount; }
        public long getReplyCount() { return replyCount; }
    }

    public static class SubscriptionStatus {
        private boolean isSubscribed;
        private long subscriberCount;
        
        public SubscriptionStatus(boolean isSubscribed, long subscriberCount) {
            this.isSubscribed = isSubscribed;
            this.subscriberCount = subscriberCount;
        }
        
        public boolean isSubscribed() { return isSubscribed; }
        public long getSubscriberCount() { return subscriberCount; }
    }
}
