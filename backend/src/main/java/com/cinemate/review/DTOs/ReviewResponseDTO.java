package com.cinemate.review.DTOs;

import com.cinemate.review.Review;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
  private String id;
  private String itemId;
  private double rating;
  private String comment;
  private Date date;

  public ReviewResponseDTO(Review review) {
    this.id = review.getId();
    this.itemId = review.getItemId();
    this.comment = review.getComment();
    this.rating = review.getRating();
    this.date = review.getDate();
  }
}
