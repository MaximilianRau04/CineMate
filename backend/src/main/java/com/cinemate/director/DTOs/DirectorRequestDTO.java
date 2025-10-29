package com.cinemate.director.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DirectorRequestDTO {
    private String id;
    @NotNull
    private String name;
    @NotNull
    private Date birthday;
    private String image;
    private String biography;
    private List<String> movieIds;
    private List<String> seriesIds;

}
