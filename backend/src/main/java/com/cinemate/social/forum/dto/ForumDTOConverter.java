package com.cinemate.social.forum.dto;

import com.cinemate.social.forum.post.ForumPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for converting entities to DTOs
 */
public class ForumDTOConverter {

    public static ForumPostDTO convertToDTO(ForumPost post) {
        return new ForumPostDTO(post);
    }

    public static List<ForumPostDTO> convertToDTO(List<ForumPost> posts) {
        return posts.stream()
                   .map(ForumPostDTO::new)
                   .collect(Collectors.toList());
    }

    public static Page<ForumPostDTO> convertToDTO(Page<ForumPost> posts) {
        List<ForumPostDTO> dtoList = posts.getContent().stream()
                                         .map(ForumPostDTO::new)
                                         .collect(Collectors.toList());
        return new PageImpl<>(dtoList, posts.getPageable(), posts.getTotalElements());
    }
}
