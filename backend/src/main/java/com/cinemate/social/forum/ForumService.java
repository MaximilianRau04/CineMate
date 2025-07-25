package com.cinemate.social.forum;

import com.cinemate.notification.events.ForumPostCreatedEvent;
import com.cinemate.notification.events.ForumReplyCreatedEvent;
import com.cinemate.social.forum.like.ForumLike;
import com.cinemate.social.forum.like.ForumLikeRepository;
import com.cinemate.social.forum.post.ForumPost;
import com.cinemate.social.forum.post.ForumPostRepository;
import com.cinemate.social.forum.reply.ForumReply;
import com.cinemate.social.forum.reply.ForumReplyRepository;
import com.cinemate.social.forum.subscription.ForumSubscription;
import com.cinemate.social.forum.subscription.ForumSubscriptionRepository;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Service class for managing forum operations.
 * Provides business logic for forum posts, replies, subscriptions, and related functionality.
 * Handles data persistence, event publishing, and business rule enforcement.
 *
 * @author CineMate Team
 * @version 1.0
 */
@Service
public class ForumService {

    @Autowired
    private ForumPostRepository forumPostRepository;

    @Autowired
    private ForumReplyRepository forumReplyRepository;

    @Autowired
    private ForumSubscriptionRepository forumSubscriptionRepository;

    @Autowired
    private ForumLikeRepository forumLikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    /**
     * Creates a new forum post with the specified user as the author.
     * Automatically subscribes the author to their own post and publishes an event for notifications.
     *
     * @param post the forum post to create
     * @param userId the ID of the user creating the post
     * @return the created ForumPost entity
     * @throws RuntimeException if the user is not found
     */
    public ForumPost createPost(ForumPost post, String userId) {

        Optional<User> userOpt = userRepository.findById(userId);

        if (!userOpt.isPresent()) {
            System.err.println("ERROR: User not found with ID: " + userId);
            // Try to find user by username if userId doesn't work
            Optional<User> userByUsername = userRepository.findByUsername(userId);
            if (userByUsername.isPresent()) {
                userOpt = userByUsername;
            } else {
                throw new RuntimeException("User not found with ID or username: " + userId);
            }
        }

        User user = userOpt.get();

        post.setAuthor(user);
        post.setCreatedAt(new Date());
        post.setLastModified(new Date());

        ForumPost savedPost = forumPostRepository.save(post);

        // Auto-subscribe author to their own post
        ForumSubscription subscription = new ForumSubscription(user, savedPost);
        forumSubscriptionRepository.save(subscription);

        // Publish event for notifications
        eventPublisher.publishEvent(new ForumPostCreatedEvent(this, savedPost));

        return savedPost;
    }

    /**
     * Retrieves all forum posts that are not deleted, ordered by creation date (newest first).
     *
     * @param pageable pagination information
     * @return a Page containing ForumPost entities
     */
    public Page<ForumPost> getAllPosts(Pageable pageable) {
        return forumPostRepository.findByIsDeletedFalseOrderByCreatedAtDesc(pageable);
    }

    /**
     * Retrieves forum posts filtered by category, ordered by creation date (newest first).
     *
     * @param category the category to filter by
     * @param pageable pagination information
     * @return a Page containing ForumPost entities in the specified category
     */
    public Page<ForumPost> getPostsByCategory(ForumCategory category, Pageable pageable) {
        return forumPostRepository.findByCategoryAndIsDeletedFalseOrderByCreatedAtDesc(category, pageable);
    }

    /**
     * Retrieves a specific forum post by its unique identifier.
     *
     * @param id the unique identifier of the forum post
     * @return an Optional containing the ForumPost if found, empty otherwise
     */
    public Optional<ForumPost> getPostById(String id) {
        return forumPostRepository.findById(id);
    }

    /**
     * Retrieves forum posts created by a specific author.
     *
     * @param authorId the ID of the author
     * @param pageable pagination information
     * @return a Page containing ForumPost entities created by the specified author
     */
    public Page<ForumPost> getPostsByAuthor(String authorId, Pageable pageable) {
        return forumPostRepository.findByAuthorIdAndIsDeletedFalseOrderByCreatedAtDesc(authorId, pageable);
    }

    /**
     * Retrieves forum posts related to a specific movie.
     *
     * @param movieId the ID of the movie
     * @param pageable pagination information
     * @return a Page containing ForumPost entities related to the specified movie
     */
    public Page<ForumPost> getPostsByMovieId(String movieId, Pageable pageable) {
        return forumPostRepository.findByMovieIdAndIsDeletedFalseOrderByCreatedAtDesc(movieId, pageable);
    }

    /**
     * Retrieves forum posts related to a specific series.
     *
     * @param seriesId the ID of the series
     * @param pageable pagination information
     * @return a Page containing ForumPost entities related to the specified series
     */
    public Page<ForumPost> getPostsBySeriesId(String seriesId, Pageable pageable) {
        return forumPostRepository.findBySeriesIdAndIsDeletedFalseOrderByCreatedAtDesc(seriesId, pageable);
    }

    /**
     * Searches for forum posts based on title or content matching the search term.
     *
     * @param searchTerm the term to search for in post titles and content
     * @param pageable pagination information
     * @return a Page containing ForumPost entities matching the search criteria
     */
    public Page<ForumPost> searchPosts(String searchTerm, Pageable pageable) {
        return forumPostRepository.searchPosts(searchTerm, pageable);
    }

    /**
     * Retrieves forum posts ordered by like count (most liked first).
     *
     * @param pageable pagination information
     * @return a Page containing ForumPost entities ordered by popularity
     */
    public Page<ForumPost> getPopularPosts(Pageable pageable) {
        return forumPostRepository.findByIsDeletedFalseOrderByLikesCountDesc(pageable);
    }

    /**
     * Retrieves forum posts ordered by last modified date (most recently active first).
     *
     * @param pageable pagination information
     * @return a Page containing ForumPost entities ordered by recent activity
     */
    public Page<ForumPost> getRecentlyActivePosts(Pageable pageable) {
        return forumPostRepository.findByIsDeletedFalseOrderByLastModifiedDesc(pageable);
    }

    /**
     * Retrieves all pinned forum posts.
     *
     * @return a List of pinned ForumPost entities
     */
    public List<ForumPost> getPinnedPosts() {
        return forumPostRepository.findByIsPinnedTrueAndIsDeletedFalseOrderByCreatedAtDesc();
    }

    /**
     * Retrieves forum posts where the specified user has participated (either as author or replied to).
     *
     * @param userId the ID of the user
     * @param pageable pagination information
     * @return a Page containing ForumPost entities where the user has participated
     */
    public Page<ForumPost> getPostsUserParticipatedIn(String userId, Pageable pageable) {
        return forumPostRepository.findPostsUserParticipatedIn(userId, pageable);
    }

        /**
     * Updates a forum post.
     * Only the author can edit their post (not admins).
     *
     * @param postId the ID of the post to update
     * @param updatedPost the updated post data
     * @param userId the ID of the user attempting to update the post
     * @return the updated ForumPost entity
     * @throws RuntimeException if the post is not found or user is not authorized
     */
    public ForumPost updatePost(String postId, ForumPost updatedPost, String userId) {
        Optional<ForumPost> existingPostOpt = forumPostRepository.findById(postId);
        if (!existingPostOpt.isPresent()) {
            throw new RuntimeException("Post not found");
        }

        ForumPost existingPost = existingPostOpt.get();

        // Check if user is the author (only authors can edit, not admins)
        if (!existingPost.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Only the author can edit this post");
        }

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());
        existingPost.setLastModified(new Date());

        return forumPostRepository.save(existingPost);
    }

    /**
     * Marks a forum post as deleted (soft delete).
     * Only the author of the post can delete it.
     *
     * @param postId the ID of the post to delete
     * @param userId the ID of the user attempting to delete the post
     * @throws RuntimeException if the post is not found or user is not authorized
     */
    public void deletePost(String postId, String userId) {
        Optional<ForumPost> postOpt = forumPostRepository.findById(postId);
        if (!postOpt.isPresent()) {
            throw new RuntimeException("Post not found");
        }

        ForumPost post = postOpt.get();

        // Check if user is the author or has admin privileges
        if (!post.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        post.setDeleted(true);
        forumPostRepository.save(post);
    }

    /**
     * Admin method to delete posts without authorization checks.
     * Useful for cleaning up posts from deleted users.
     *
     * @param postId the ID of the post to delete
     * @throws RuntimeException if the post is not found
     */
    public void adminDeletePost(String postId) {
        Optional<ForumPost> postOpt = forumPostRepository.findById(postId);
        if (!postOpt.isPresent()) {
            throw new RuntimeException("Post not found");
        }

        ForumPost post = postOpt.get();
        post.setDeleted(true);
        forumPostRepository.save(post);
    }

    public ForumPost toggleLike(String postId, String userId) {
        Optional<ForumPost> postOpt = forumPostRepository.findById(postId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (!postOpt.isPresent()) {
            throw new RuntimeException("Post not found");
        }
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }

        ForumPost post = postOpt.get();
        User user = userOpt.get();
        
        Optional<ForumLike> existingLike = forumLikeRepository.findByUserIdAndPostId(userId, postId);
        
        if (existingLike.isPresent()) {
            // Remove like
            forumLikeRepository.delete(existingLike.get());
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        } else {
            // Add like
            ForumLike like = new ForumLike();
            like.setUser(user);
            like.setPost(post);
            like.setCreatedAt(new Date());
            like.setLikeType("POST");
            forumLikeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
        }

        return forumPostRepository.save(post);
    }

    /**
     * Checks if a specific user has liked a specific forum post.
     *
     * @param postId the ID of the post to check
     * @param userId the ID of the user to check
     * @return true if the user has liked the post, false otherwise
     */
    public boolean isPostLikedByUser(String postId, String userId) {
        return forumLikeRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }

    /**
     * Increments the view count of a forum post.
     *
     * @param postId the ID of the post to increment views for
     */
    public void incrementViewCount(String postId) {
        Optional<ForumPost> postOpt = forumPostRepository.findById(postId);
        if (postOpt.isPresent()) {
            ForumPost post = postOpt.get();
            post.setViews(post.getViews() + 1);
            forumPostRepository.save(post);
        }
    }

    /**
     * Creates a new reply to a forum post.
     * Updates the parent post's reply count and last modified date.
     * Publishes an event for notification purposes.
     *
     * @param reply the reply to create
     * @param userId the ID of the user creating the reply
     * @param postId the ID of the post being replied to
     * @return the created ForumReply entity
     * @throws RuntimeException if the user or post is not found
     */
    public ForumReply createReply(ForumReply reply, String userId, String postId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<ForumPost> postOpt = forumPostRepository.findById(postId);

        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        if (!postOpt.isPresent()) {
            throw new RuntimeException("Post not found with ID: " + postId);
        }

        ForumPost post = postOpt.get();

        if (post.isLocked()) {
            throw new RuntimeException("Cannot reply to a locked post");
        }
        if (post.isDeleted()) {
            throw new RuntimeException("Cannot reply to a deleted post");
        }

        User user = userOpt.get();
        reply.setAuthor(user);
        reply.setParentPost(post);
        reply.setCreatedAt(new Date());
        reply.setLastModified(new Date());
        reply.setDeleted(false);

        ForumReply savedReply = forumReplyRepository.save(reply);

        // Update post reply count and last modified
        post.setRepliesCount(post.getRepliesCount() + 1);
        post.setLastModified(new Date());
        forumPostRepository.save(post);

        // Publish event for notifications
        eventPublisher.publishEvent(new ForumReplyCreatedEvent(this, savedReply, post));

        return savedReply;
    }

    /**
     * Retrieves replies for a specific forum post, ordered by creation date (oldest first).
     *
     * @param postId the ID of the post to get replies for
     * @param pageable pagination information
     * @return a Page containing ForumReply entities for the specified post
     */
    public Page<ForumReply> getRepliesForPost(String postId, Pageable pageable) {
        return forumReplyRepository.findByParentPostIdAndIsDeletedFalseOrderByCreatedAtAsc(postId, pageable);
    }

    /**
     * Retrieves replies created by a specific author.
     *
     * @param authorId the ID of the author
     * @param pageable pagination information
     * @return a Page containing ForumReply entities created by the specified author
     */
    public Page<ForumReply> getRepliesByAuthor(String authorId, Pageable pageable) {
        return forumReplyRepository.findByAuthorIdAndIsDeletedFalseOrderByCreatedAtDesc(authorId, pageable);
    }

        /**
     * Updates a forum reply.
     * Only the author can edit their reply (not admins).
     *
     * @param replyId the ID of the reply to update
     * @param updatedReply the updated reply data
     * @param userId the ID of the user attempting to update the reply
     * @return the updated ForumReply entity
     * @throws RuntimeException if the reply is not found or user is not authorized
     */
    public ForumReply updateReply(String replyId, ForumReply updatedReply, String userId) {
        Optional<ForumReply> existingReplyOpt = forumReplyRepository.findById(replyId);
        if (!existingReplyOpt.isPresent()) {
            throw new RuntimeException("Reply not found");
        }

        ForumReply existingReply = existingReplyOpt.get();

        // Check if user is the author (only authors can edit, not admins)
        if (!existingReply.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Only the author can edit this reply");
        }

        existingReply.setContent(updatedReply.getContent());
        existingReply.setLastModified(new Date());

        return forumReplyRepository.save(existingReply);
    }

    /**
     * Marks a forum reply as deleted (soft delete).
     * Only the author of the reply or an admin can delete it.
     *
     * @param replyId the ID of the reply to delete
     * @param userId the ID of the user attempting to delete the reply
     * @throws RuntimeException if the reply is not found or user is not authorized
     */
    public void deleteReply(String replyId, String userId) {
        Optional<ForumReply> replyOpt = forumReplyRepository.findById(replyId);
        if (!replyOpt.isPresent()) {
            throw new RuntimeException("Reply not found");
        }

        ForumReply reply = replyOpt.get();

        // Check if user is the author or an admin
        User user = userRepository.findById(userId).orElse(null);
        boolean isAuthor = reply.getAuthor().getId().equals(userId);
        boolean isAdmin = user != null && "ADMIN".equals(user.getRole().toString());
        
        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("Not authorized to delete this reply");
        }

        reply.setDeleted(true);
        forumReplyRepository.save(reply);

        // Update post reply count
        ForumPost post = reply.getParentPost();
        post.setRepliesCount(Math.max(0, post.getRepliesCount() - 1));
        forumPostRepository.save(post);
    }

    /**
     * Toggles a user's like on a forum reply.
     *
     * @param replyId the ID of the reply to like/unlike
     * @param userId the ID of the user toggling the like
     * @return the updated ForumReply entity
     * @throws RuntimeException if the reply is not found
     */
    public ForumReply toggleReplyLike(String replyId, String userId) {
        Optional<ForumReply> replyOpt = forumReplyRepository.findById(replyId);
        if (!replyOpt.isPresent()) {
            throw new RuntimeException("Reply not found");
        }

        ForumReply reply = replyOpt.get();
        // TODO: Implement like tracking (separate entity for user-reply likes)

        return forumReplyRepository.save(reply);
    }

    /**
     * Counts the number of forum posts in a specific category.
     *
     * @param category the category to count posts for
     * @return the number of posts in the specified category
     */
    public long getPostCountByCategory(ForumCategory category) {
        return forumPostRepository.countByCategoryAndIsDeletedFalse(category);
    }

    /**
     * Counts the number of forum posts created by a specific author.
     *
     * @param authorId the ID of the author
     * @return the number of posts created by the specified author
     */
    public long getPostCountByAuthor(String authorId) {
        return forumPostRepository.countByAuthorIdAndIsDeletedFalse(authorId);
    }

    /**
     * Counts the number of forum replies created by a specific author.
     *
     * @param authorId the ID of the author
     * @return the number of replies created by the specified author
     */
    public long getReplyCountByAuthor(String authorId) {
        return forumReplyRepository.countByAuthorIdAndIsDeletedFalse(authorId);
    }

    /**
     * Pins or unpins a forum post.
     * Pinned posts are displayed at the top of the forum.
     *
     * @param postId the ID of the post to pin/unpin
     * @param pinned true to pin the post, false to unpin
     * @return the updated ForumPost entity
     * @throws RuntimeException if the post is not found
     */
    public ForumPost pinPost(String postId, boolean pinned) {
        Optional<ForumPost> postOpt = forumPostRepository.findById(postId);
        if (!postOpt.isPresent()) {
            throw new RuntimeException("Post not found");
        }

        ForumPost post = postOpt.get();
        post.setPinned(pinned);
        return forumPostRepository.save(post);
    }

    /**
     * Locks or unlocks a forum post.
     * Locked posts cannot receive new replies.
     *
     * @param postId the ID of the post to lock/unlock
     * @param locked true to lock the post, false to unlock
     * @return the updated ForumPost entity
     * @throws RuntimeException if the post is not found
     */
    public ForumPost lockPost(String postId, boolean locked) {
        Optional<ForumPost> postOpt = forumPostRepository.findById(postId);
        if (!postOpt.isPresent()) {
            throw new RuntimeException("Post not found");
        }

        ForumPost post = postOpt.get();
        post.setLocked(locked);
        return forumPostRepository.save(post);
    }

    /**
     * Subscribes a user to a forum post.
     * If the user is already subscribed, returns the existing subscription.
     *
     * @param postId the ID of the post to subscribe to
     * @param userId the ID of the user subscribing
     * @return the ForumSubscription entity
     * @throws RuntimeException if the user or post is not found
     */
    public ForumSubscription subscribeToPost(String postId, String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<ForumPost> postOpt = forumPostRepository.findById(postId);

        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        if (!postOpt.isPresent()) {
            throw new RuntimeException("Post not found with ID: " + postId);
        }

        ForumPost post = postOpt.get();
        if (post.isDeleted()) {
            throw new RuntimeException("Cannot subscribe to a deleted post");
        }

        // Check if already subscribed
        Optional<ForumSubscription> existingSubscription =
                forumSubscriptionRepository.findByUserIdAndPostIdAndIsActiveTrue(userId, postId);

        if (existingSubscription.isPresent()) {
            return existingSubscription.get();
        }

        // Create new subscription
        ForumSubscription subscription = new ForumSubscription();
        subscription.setUser(userOpt.get());
        subscription.setPost(post);
        subscription.setActive(true);

        return forumSubscriptionRepository.save(subscription);
    }

    /**
     * Unsubscribes a user from a forum post.
     * Marks the subscription as inactive instead of deleting it.
     *
     * @param postId the ID of the post to unsubscribe from
     * @param userId the ID of the user unsubscribing
     */
    public void unsubscribeFromPost(String postId, String userId) {
        Optional<ForumSubscription> subscriptionOpt =
                forumSubscriptionRepository.findByUserIdAndPostIdAndIsActiveTrue(userId, postId);

        if (subscriptionOpt.isPresent()) {
            ForumSubscription subscription = subscriptionOpt.get();
            subscription.setActive(false);
            forumSubscriptionRepository.save(subscription);
        }
    }

    /**
     * Retrieves all active subscriptions for a user.
     *
     * @param userId the ID of the user
     * @return a List of ForumSubscription entities
     */
    public List<ForumSubscription> getUserSubscriptions(String userId) {
        return forumSubscriptionRepository.findByUserIdAndIsActiveTrue(userId);
    }

    /**
     * Checks if a user is subscribed to a specific forum post.
     *
     * @param userId the ID of the user
     * @param postId the ID of the post
     * @return true if the user is subscribed, false otherwise
     */
    public boolean isUserSubscribedToPost(String userId, String postId) {
        return forumSubscriptionRepository.findByUserIdAndPostIdAndIsActiveTrue(userId, postId).isPresent();
    }

    /**
     * Counts the number of active subscriptions for a forum post.
     *
     * @param postId the ID of the post
     * @return the number of active subscriptions
     */
    public long getSubscriptionCount(String postId) {
        return forumSubscriptionRepository.countByPostIdAndIsActiveTrue(postId);
    }

    /**
     * Retrieves forum posts filtered by media type.
     *
     * @param mediaType the media type to filter by ("movie", "series", "none")
     * @param pageable pagination information
     * @return a Page containing ForumPost entities with the specified media type
     */
    public Page<ForumPost> getPostsByMediaType(String mediaType, Pageable pageable) {
        switch (mediaType.toLowerCase()) {
            case "movie":
                return forumPostRepository.findByMovieIdIsNotNullAndIsDeletedFalseOrderByCreatedAtDesc(pageable);
            case "series":
                return forumPostRepository.findBySeriesIdIsNotNullAndIsDeletedFalseOrderByCreatedAtDesc(pageable);
            case "none":
                return forumPostRepository.findByMovieIdIsNullAndSeriesIdIsNullAndIsDeletedFalseOrderByCreatedAtDesc(pageable);
            default:
                return getAllPosts(pageable);
        }
    }

    /**
     * Retrieves forum posts filtered by both category and media type.
     *
     * @param category the category to filter by
     * @param mediaType the media type to filter by ("movie", "series", "none")
     * @param pageable pagination information
     * @return a Page containing ForumPost entities matching both criteria
     */
    public Page<ForumPost> getPostsByCategoryAndMediaType(ForumCategory category, String mediaType, Pageable pageable) {
        switch (mediaType.toLowerCase()) {
            case "movie":
                return forumPostRepository.findByCategoryAndMovieIdIsNotNullAndIsDeletedFalseOrderByCreatedAtDesc(category, pageable);
            case "series":
                return forumPostRepository.findByCategoryAndSeriesIdIsNotNullAndIsDeletedFalseOrderByCreatedAtDesc(category, pageable);
            case "none":
                return forumPostRepository.findByCategoryAndMovieIdIsNullAndSeriesIdIsNullAndIsDeletedFalseOrderByCreatedAtDesc(category, pageable);
            default:
                return getPostsByCategory(category, pageable);
        }
    }
}