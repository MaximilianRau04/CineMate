package com.cinemate.actor.DTOs;

import jakarta.validation.constraints.NotNull;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActorRequestDTO {
  private String id;
  @NotNull private String name;
  @NotNull private Date birthday;
  private String image;
  private String biography;
}
