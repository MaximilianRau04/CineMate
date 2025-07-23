package com.cinemate.social.forum.dto;

import com.cinemate.social.forum.ForumService;
import com.cinemate.social.forum.post.ForumPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for converting entities to DTOs
 */
@Component
public class ForumDTOConverter {

    @Autowired
    private ForumService forumService;

    public ForumPostDTO convertToDTO(ForumPost post) {
        return new ForumPostDTO(post);
    }

    public ForumPostDTO convertToDTO(ForumPost post, String userId) {
        boolean likedByCurrentUser = false;
        if (userId != null && forumService != null) {
            likedByCurrentUser = forumService.isPostLikedByUser(post.getId(), userId);
        }
        return new ForumPostDTO(post, userId, likedByCurrentUser);
    }

    public List<ForumPostDTO> convertToDTO(List<ForumPost> posts) {
        return posts.stream()
                   .map(ForumPostDTO::new)
                   .collect(Collectors.toList());
    }

    public Page<ForumPostDTO> convertToDTO(Page<ForumPost> posts) {
        List<ForumPostDTO> dtoList = posts.getContent().stream()
                                         .map(ForumPostDTO::new)
                                         .collect(Collectors.toList());
        return new PageImpl<>(dtoList, posts.getPageable(), posts.getTotalElements());
    }
}
