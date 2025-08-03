package com.cinemate.customlist;

import com.cinemate.customlist.dtos.CustomListRequestDTO;
import com.cinemate.customlist.dtos.CustomListResponseDTO;
import com.cinemate.customlist.dtos.ListCommentResponseDTO;
import com.cinemate.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
public class CustomListController {

    @Autowired
    private CustomListService customListService;

    /**
     * Creates a new custom list for the authenticated user.
     *
     * @param user the currently authenticated user
     * @param requestDTO the details of the custom list to be created
     * @return a {@code ResponseEntity} containing the created custom list data
     */
    @PostMapping
    public ResponseEntity<CustomListResponseDTO> createCustomList(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CustomListRequestDTO requestDTO) {
        return customListService.createCustomList(user.getUsername(), requestDTO);
    }

    /**
     * Retrieves a custom list by its ID.
     *
     * @param listId the unique identifier of the custom list to be retrieved
     * @param user the currently authenticated user
     * @return a {@code ResponseEntity} containing the custom list data, or an appropriate HTTP status if not found
     */
    @GetMapping("/{listId}")
    public ResponseEntity<CustomListResponseDTO> getCustomListById(
            @PathVariable String listId,
            @AuthenticationPrincipal User user) {
        String currentUserId = user != null ? user.getUsername() : null;
        return customListService.getCustomListById(listId, currentUserId);
    }

    /**
     * Updates an existing custom list with new details provided by the authenticated user.
     *
     * @param listId the unique identifier of the custom list to be updated
     * @param user the currently authenticated user
     * @param requestDTO the updated details of the custom list
     * @return a {@code ResponseEntity} containing the updated custom list data
     */
    @PutMapping("/{listId}")
    public ResponseEntity<CustomListResponseDTO> updateCustomList(
            @PathVariable String listId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CustomListRequestDTO requestDTO) {
        return customListService.updateCustomList(listId, user.getUsername(), requestDTO);
    }

    /**
     * Deletes a custom list specified by its ID for the authenticated user.
     *
     * @param listId the unique identifier of the custom list to be deleted
     * @param user the currently authenticated user
     * @return a {@code ResponseEntity} indicating the result of the deletion operation
     */
    @DeleteMapping("/{listId}")
    public ResponseEntity<Void> deleteCustomList(
            @PathVariable String listId,
            @AuthenticationPrincipal User user) {
        return customListService.deleteCustomList(listId, user.getUsername());
    }

    /**
     * Retrieves the lists for a specified user. If the currently authenticated user is provided,
     * the response may include additional data based on their permissions or related context.
     *
     * @param userId the unique identifier of the user whose lists are to be retrieved
     * @param user the currently authenticated user, if available
     * @return a {@code ResponseEntity} containing a list of {@code CustomListResponseDTO} objects,
     *         which represent the custom lists of the specified user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomListResponseDTO>> getUserLists(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        String currentUserId = user != null ? user.getUsername() : null;
        return customListService.getUserLists(userId, currentUserId);
    }

    /**
     * Retrieves the custom lists created by the currently authenticated user.
     *
     * @param user the currently authenticated user
     * @return a {@code ResponseEntity} containing a list of {@code CustomListResponseDTO} objects,
     *         which represent the user's custom lists
     */
    @GetMapping("/my-lists")
    public ResponseEntity<List<CustomListResponseDTO>> getMyLists(
            @AuthenticationPrincipal User user) {
        return customListService.getUserLists(user.getUsername(), user.getUsername());
    }

    /**
     * Retrieves a paginated list of public custom lists, optionally sorted by a specified criterion.
     *
     * @param page the page number to retrieve, defaults to 0
     * @param size the number of items per page, defaults to 10
     * @param sortBy the sorting criterion for the public lists, defaults to "recent"
     * @return a {@code ResponseEntity} containing a {@code Page} of {@code CustomListResponseDTO} objects
     */
    @GetMapping("/public")
    public ResponseEntity<Page<CustomListResponseDTO>> getPublicLists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "recent") String sortBy) {
        return customListService.getPublicLists(page, size, sortBy);
    }

    /**
     * Searches for custom lists based on a query string, and retrieves a paginated
     * response with the search results.
     *
     * @param query the search term to filter the custom lists
     * @param page the page number to retrieve, defaults to 0
     * @param size the number of items per page, defaults to 10
     * @return a {@code ResponseEntity} containing a {@code Page} of {@code CustomListResponseDTO} objects
     *         that match the search criteria
     */
    @GetMapping("/search")
    public ResponseEntity<Page<CustomListResponseDTO>> searchLists(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return customListService.searchLists(query, page, size);
    }

    /**
     * Adds a movie to a custom list for the authenticated user.
     *
     * @param listId the unique identifier of the custom list to which the movie is being added
     * @param movieId the unique identifier of the movie to be added to the custom list
     * @param user the currently authenticated user
     * @return a {@code ResponseEntity} containing the updated custom list data after adding the movie
     */
    @PostMapping("/{listId}/movies/{movieId}")
    public ResponseEntity<CustomListResponseDTO> addMovieToList(
            @PathVariable String listId,
            @PathVariable String movieId,
            @AuthenticationPrincipal User user) {
        return customListService.addMovieToList(listId, movieId, user.getUsername());
    }

    /**
     * Removes a movie from a specific custom list.
     *
     * @param listId the unique identifier of the custom list from which the movie will be removed
     * @param movieId the unique identifier of the movie to be removed
     * @param user the authenticated user, used to validate permissions for the operation
     * @return a ResponseEntity containing a CustomListResponseDTO reflecting the updated state of the custom list
     */
    @DeleteMapping("/{listId}/movies/{movieId}")
    public ResponseEntity<CustomListResponseDTO> removeMovieFromList(
            @PathVariable String listId,
            @PathVariable String movieId,
            @AuthenticationPrincipal User user) {
        return customListService.removeMovieFromList(listId, movieId, user.getUsername());
    }

    /**
     * Adds a series to a specified custom list.
     *
     * @param listId the unique identifier of the custom list to which the series will be added
     * @param seriesId the unique identifier of the series to be added to the list
     * @param user the authenticated user used to associate the operation with the user
     * @return a ResponseEntity containing the updated custom list details
     */
    @PostMapping("/{listId}/series/{seriesId}")
    public ResponseEntity<CustomListResponseDTO> addSeriesToList(
            @PathVariable String listId,
            @PathVariable String seriesId,
            @AuthenticationPrincipal User user) {
        return customListService.addSeriesToList(listId, seriesId, user.getUsername());
    }

    /**
     * Removes a series from a custom list based on the provided list ID and series ID.
     *
     * @param listId the unique identifier of the custom list from which the series is to be removed
     * @param seriesId the unique identifier of the series to be removed from the list
     * @param userDetails the details of the authenticated user making the request
     * @return a ResponseEntity containing a CustomListResponseDTO with the updated list details
     */
    @DeleteMapping("/{listId}/series/{seriesId}")
    public ResponseEntity<CustomListResponseDTO> removeSeriesFromList(
            @PathVariable String listId,
            @PathVariable String seriesId,
            @AuthenticationPrincipal User user) {
        return customListService.removeSeriesFromList(listId, seriesId, user.getUsername());
    }

    /**
     * Toggles the 'like' status for a specified list. If the user has already liked the list,
     * this action will remove the like. Otherwise, it will add a like to the list.
     *
     * @param listId the identifier of the list to be liked or unliked
     * @param userDetails the details of the authenticated user performing the operation
     * @return a ResponseEntity containing the updated list data encapsulated in a CustomListResponseDTO
     */
    @PostMapping("/{listId}/like")
    public ResponseEntity<CustomListResponseDTO> toggleLike(
            @PathVariable String listId,
            @AuthenticationPrincipal User user) {
        return customListService.toggleLike(listId, user.getUsername());
    }

    /**
     * Adds a comment to the specified list.
     *
     * @param listId the ID of the list to which the comment will be added
     * @param userDetails the details of the authenticated user making the request
     * @param request a map containing the comment data, where the key is "content" and the value is the comment text
     * @return a ResponseEntity containing the DTO with information about the added comment
     */
    @PostMapping("/{listId}/comments")
    public ResponseEntity<ListCommentResponseDTO> addComment(
            @PathVariable String listId,
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> request) {
        String content = request.get("content");
        return customListService.addComment(listId, user.getUsername(), content);
    }

    /**
     * Retrieves a list of comments associated with a specific list.
     *
     * @param listId the identifier of the list for which comments are to be retrieved
     * @param user the authenticated user, used to determine the current user
     * @return a ResponseEntity containing a list of ListCommentResponseDTO objects that represent the comments
     */
    @GetMapping("/{listId}/comments")
    public ResponseEntity<List<ListCommentResponseDTO>> getComments(
            @PathVariable String listId,
            @AuthenticationPrincipal User user) {
        String currentUserId = user != null ? user.getUsername() : null;
        return customListService.getComments(listId, currentUserId);
    }

    /**
     * Deletes a comment identified by its ID. The comment is
     * removed if it belongs to the authenticated user.
     *
     * @param commentId the unique identifier of the comment to be deleted
     * @param user the authenticated user
     * @return a ResponseEntity with no content if deletion is successful
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal User user) {
        return customListService.deleteComment(commentId, user.getUsername());
    }
}
