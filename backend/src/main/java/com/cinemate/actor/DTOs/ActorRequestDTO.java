package com.cinemate.actor.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActorRequestDTO {
    private String id;
    @NotNull
    private String name;
    @NotNull
    private Date birthday;
    private String image;
    private String biography;

}
