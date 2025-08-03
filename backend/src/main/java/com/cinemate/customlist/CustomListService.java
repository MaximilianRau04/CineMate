package com.cinemate.customlist;

import com.cinemate.customlist.dtos.CustomListRequestDTO;
import com.cinemate.customlist.dtos.CustomListResponseDTO;
import com.cinemate.customlist.dtos.ListCommentResponseDTO;
import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomListService {

    @Autowired
    private CustomListRepository customListRepository;

    @Autowired
    private ListCommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private SeriesRepository seriesRepository;

    /**
     * Creates a custom list for a specified user based on the provided request data.
     *
     * @param userId The unique identifier of the user for whom the custom list is to be created.
     * @param requestDTO The data transfer object containing the details for the custom list, including title, description, privacy settings, tags, and cover image URL.
     * @return A ResponseEntity containing a CustomListResponseDTO with details of the created custom list, or a bad request response if the user does not exist.
     */
    public ResponseEntity<CustomListResponseDTO> createCustomList(String userId, CustomListRequestDTO requestDTO) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userOptional.get();
        CustomList customList = new CustomList(
            requestDTO.getTitle(),
            requestDTO.getDescription(),
            user,
            requestDTO.isPublic()
        );
        
        if (requestDTO.getCoverImageUrl() != null) {
            customList.setCoverImageUrl(requestDTO.getCoverImageUrl());
        }
        
        if (requestDTO.getTags() != null) {
            customList.setTags(requestDTO.getTags());
        }

        CustomList savedList = customListRepository.save(customList);
        return ResponseEntity.ok(new CustomListResponseDTO(savedList));
    }

    /**
     * Retrieves a custom list by its unique identifier and checks access permissions for the current user.
     *
     * @param listId the unique identifier of the custom list to be retrieved
     * @param currentUserId the unique identifier of the currently authenticated user
     * @return a {@code ResponseEntity} containing a {@code CustomListResponseDTO} if the list is found and accessible;
     */
    public ResponseEntity<CustomListResponseDTO> getCustomListById(String listId, String currentUserId) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        if (listOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CustomList customList = listOptional.get();
        
        // Check if user has access to the private list
        if (!customList.isPublic() && !customList.getCreator().getId().equals(currentUserId)) {
            return ResponseEntity.status(403).build();
        }

        boolean isLikedByCurrentUser = false;
        if (currentUserId != null) {
            Optional<User> currentUser = userRepository.findById(currentUserId);
            if (currentUser.isPresent()) {
                isLikedByCurrentUser = customList.isLikedBy(currentUser.get());
            }
        }

        return ResponseEntity.ok(new CustomListResponseDTO(customList, isLikedByCurrentUser));
    }

    /**
     * Updates an existing custom list with new data provided in the request.
     * Validates the list ID, user access, and updates the information based on the request details.
     *
     * @param listId The unique identifier of the custom list to be updated.
     * @param userId The ID of the user who is attempting to update the custom list.
     * @param requestDTO The data transfer object containing the updated details for the custom list.
     * @return A ResponseEntity containing the updated custom list data if successful.
     *         Returns a 404 status if the list is not found or a 403 status if the user is not authorized.
     */
    public ResponseEntity<CustomListResponseDTO> updateCustomList(String listId, String userId, CustomListRequestDTO requestDTO) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        if (listOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CustomList customList = listOptional.get();
        
        // Check if user is the creator
        if (!customList.getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        customList.setTitle(requestDTO.getTitle());
        customList.setDescription(requestDTO.getDescription());
        customList.setPublic(requestDTO.isPublic());
        customList.setUpdatedAt(new Date());
        
        if (requestDTO.getCoverImageUrl() != null) {
            customList.setCoverImageUrl(requestDTO.getCoverImageUrl());
        }
        
        if (requestDTO.getTags() != null) {
            customList.setTags(requestDTO.getTags());
        }

        CustomList savedList = customListRepository.save(customList);
        return ResponseEntity.ok(new CustomListResponseDTO(savedList));
    }

    /**
     * Deletes a custom list identified by the given list ID if it exists and the user has permission to do so.
     * The method first checks whether the list exists. If the list does not exist, a 404 Not Found response is returned.
     *
     * @param listId the unique identifier of the custom list to be deleted
     * @param userId the unique identifier of the user requesting the list deletion
     * @return a ResponseEntity with a status code based on the result:
     */
    public ResponseEntity<Void> deleteCustomList(String listId, String userId) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        if (listOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CustomList customList = listOptional.get();
        
        // Check if user is the creator
        if (!customList.getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        // Delete all comments first
        List<ListComment> comments = commentRepository.findByCustomListOrderByCreatedAtDesc(customList);
        commentRepository.deleteAll(comments);

        customListRepository.delete(customList);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieves the lists associated with a user. If the requesting user is the owner of the lists,
     * all lists are returned. Otherwise, only public lists are returned.
     *
     * @param userId the ID of the user whose lists are being retrieved
     * @param currentUserId the ID of the currently authenticated user making the request
     * @return a ResponseEntity containing a list of CustomListResponseDTO objects if the user exists,
     *         otherwise a 404 (not found) ResponseEntity
     */
    public ResponseEntity<List<CustomListResponseDTO>> getUserLists(String userId, String currentUserId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        List<CustomList> lists;

        // If viewing own lists, show all; otherwise only public
        if (userId.equals(currentUserId)) {
            lists = customListRepository.findByCreatorOrderByUpdatedAtDesc(user);
        } else {
            lists = customListRepository.findByCreatorAndIsPublic(user, true);
        }

        List<CustomListResponseDTO> responseDTOs = lists.stream()
            .map(CustomListResponseDTO::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Retrieves public lists with pagination and sorting options.
     *
     * @param page the page number to retrieve, zero-indexed
     * @param size the number of items per page
     * @param sortBy the sorting criteria; "popular" for sorting by likes and updated date in descending order,
     *               or "recent" (default) for sorting by updated date in descending order
     * @return a ResponseEntity containing a paginated list of CustomListResponseDTO objects
     */
    public ResponseEntity<Page<CustomListResponseDTO>> getPublicLists(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CustomList> lists;

        switch (sortBy) {
            case "popular":
                lists = customListRepository.findByIsPublicTrueOrderByLikesCountDescUpdatedAtDesc(pageable);
                break;
            case "recent":
            default:
                lists = customListRepository.findByIsPublicTrueOrderByUpdatedAtDesc(pageable);
                break;
        }

        Page<CustomListResponseDTO> responseDTOs = lists.map(CustomListResponseDTO::new);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Searches for public custom lists based on a query string, with pagination support.
     *
     * @param query the search query to filter custom lists by their title
     * @param page the page number to retrieve in the paginated result set
     * @param size the number of items per page in the paginated result set
     * @return a ResponseEntity containing a Page with the matching CustomListResponseDTO objects
     */
    public ResponseEntity<Page<CustomListResponseDTO>> searchLists(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CustomList> lists = customListRepository.findByTitleContainingIgnoreCaseAndIsPublicTrue(query, pageable);
        Page<CustomListResponseDTO> responseDTOs = lists.map(CustomListResponseDTO::new);
        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Adds a movie to a custom list specified by the list ID. Verifies if the movie and list exist
     * and checks if the user is the creator of the list before adding the movie.
     *
     * @param listId the ID of the custom list to which the movie should be added
     * @param movieId the ID of the movie to be added to the list
     * @param userId the ID of the user attempting to add the movie to the list
     * @return a {@code ResponseEntity<CustomListResponseDTO>} containing the updated custom list
     *         if the process is successful, or an error response entity if the operation fails
     */
    public ResponseEntity<CustomListResponseDTO> addMovieToList(String listId, String movieId, String userId) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        
        if (listOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CustomList customList = listOptional.get();
        Movie movie = movieOptional.get();
        
        // Check if user is the creator
        if (!customList.getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        customList.addMovie(movie);
        CustomList savedList = customListRepository.save(customList);
        return ResponseEntity.ok(new CustomListResponseDTO(savedList));
    }

    /**
     * Removes a movie from a custom list based on the provided list ID and movie ID.
     * Validates if the list and movie exist, and verifies the user's authorization
     * to modify the list before performing the removal.
     *
     * @param listId the unique identifier of the custom list
     * @param movieId the unique identifier of the movie to be removed from the list
     * @param userId the unique identifier of the user attempting to remove the movie
     * @return a ResponseEntity containing a {@code CustomListResponseDTO} if the operation is successful,
     */
    public ResponseEntity<CustomListResponseDTO> removeMovieFromList(String listId, String movieId, String userId) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        
        if (listOptional.isEmpty() || movieOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CustomList customList = listOptional.get();
        Movie movie = movieOptional.get();
        
        // Check if user is the creator
        if (!customList.getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        customList.removeMovie(movie);
        CustomList savedList = customListRepository.save(customList);
        return ResponseEntity.ok(new CustomListResponseDTO(savedList));
    }

    /**
     * Adds a series to a custom list if the list and series exist, and the user
     * is authorized to modify the list. Returns the updated custom list.
     *
     * @param listId the unique identifier of the custom list
     * @param seriesId the unique identifier of the series to add to the list
     * @param userId the unique identifier of the user performing the operation
     * @return a ResponseEntity containing the updated CustomListResponseDTO if successful,
     *         or an appropriate HTTP status if the operation fails
     */
    public ResponseEntity<CustomListResponseDTO> addSeriesToList(String listId, String seriesId, String userId) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);
        
        if (listOptional.isEmpty() || seriesOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CustomList customList = listOptional.get();
        Series series = seriesOptional.get();
        
        // Check if user is the creator
        if (!customList.getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        customList.addSeries(series);
        CustomList savedList = customListRepository.save(customList);
        return ResponseEntity.ok(new CustomListResponseDTO(savedList));
    }

    /**
     * Removes a series from a custom list if the user is the creator of the list.
     *
     * @param listId the unique identifier of the custom list from which the series is to be removed
     * @param seriesId the unique identifier of the series to be removed from the custom list
     * @param userId the unique identifier of the user attempting to remove the series
     * @return a ResponseEntity containing a CustomListResponseDTO if the operation is successful,
     */
    public ResponseEntity<CustomListResponseDTO> removeSeriesFromList(String listId, String seriesId, String userId) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        Optional<Series> seriesOptional = seriesRepository.findById(seriesId);
        
        if (listOptional.isEmpty() || seriesOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CustomList customList = listOptional.get();
        Series series = seriesOptional.get();
        
        // Check if user is the creator
        if (!customList.getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        customList.removeSeries(series);
        CustomList savedList = customListRepository.save(customList);
        return ResponseEntity.ok(new CustomListResponseDTO(savedList));
    }

    /**
     * Toggles the like status of a custom list for a specified user. If the custom list
     * is private, only the creator of the list is permitted to like or unlike the list.
     *
     * @param listId the unique identifier of the custom list whose like status is being toggled
     * @param userId the unique identifier of the user performing the like/unlike operation
     * @return a {@link ResponseEntity} containing a {@link CustomListResponseDTO} with the updated
     *         custom list details and the current like status for the user
     */
    public ResponseEntity<CustomListResponseDTO> toggleLike(String listId, String userId) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (listOptional.isEmpty() || userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CustomList customList = listOptional.get();
        User user = userOptional.get();
        
        // Can't like private lists unless you're the creator
        if (!customList.isPublic() && !customList.getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        if (customList.isLikedBy(user)) {
            customList.removeLike(user);
        } else {
            customList.addLike(user);
        }

        CustomList savedList = customListRepository.save(customList);
        return ResponseEntity.ok(new CustomListResponseDTO(savedList, customList.isLikedBy(user)));
    }

    /**
     * Adds a comment to a custom list. Ensures the user and the list exist, and validates
     * if the user has permission to comment on the specified list.
     *
     * @param listId the identifier of the custom list to which the comment is to be added
     * @param userId the identifier of the user adding the comment
     * @param content the content of the comment to be added
     * @return a ResponseEntity containing a ListCommentResponseDTO of the saved comment
     *         if successful, or an appropriate response status if the operation fails
     */
    public ResponseEntity<ListCommentResponseDTO> addComment(String listId, String userId, String content) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (listOptional.isEmpty() || userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CustomList customList = listOptional.get();
        User user = userOptional.get();
        
        // Can't comment on private lists unless you're the creator
        if (!customList.isPublic() && !customList.getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        ListComment comment = new ListComment(customList, user, content);
        ListComment savedComment = commentRepository.save(comment);
        
        return ResponseEntity.ok(new ListCommentResponseDTO(savedComment));
    }

    /**
     * Retrieves the comments for a specified list.
     * This method checks if the list exists and verifies if the current user has access
     * to the comments.
     *
     * @param listId the unique identifier of the list for which comments are to be retrieved
     * @param currentUserId the unique identifier of the current user making the request
     * @return a ResponseEntity containing a list of ListCommentResponseDTO objects
     *         representing the comments if successful, or an appropriate error status
     */
    public ResponseEntity<List<ListCommentResponseDTO>> getComments(String listId, String currentUserId) {
        Optional<CustomList> listOptional = customListRepository.findById(listId);
        if (listOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CustomList customList = listOptional.get();
        
        // Check if user has access to comments
        if (!customList.isPublic() && !customList.getCreator().getId().equals(currentUserId)) {
            return ResponseEntity.status(403).build();
        }

        List<ListComment> comments = commentRepository.findByCustomListOrderByCreatedAtDesc(customList);
        List<ListCommentResponseDTO> responseDTOs = comments.stream()
            .map(ListCommentResponseDTO::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    /**
     * Deletes a comment identified by its ID if the specified user is authorized to delete it.
     *
     * @param commentId The unique identifier of the comment to be deleted.
     * @param userId The unique identifier of the user attempting to delete the comment.
     * @return A ResponseEntity<Void> indicating the result of the delete operation
     */
    public ResponseEntity<Void> deleteComment(String commentId, String userId) {
        Optional<ListComment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ListComment comment = commentOptional.get();
        
        // Check if user is the author or list creator
        if (!comment.getAuthor().getId().equals(userId) && 
            !comment.getCustomList().getCreator().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        commentRepository.delete(comment);
        return ResponseEntity.ok().build();
    }
}
