package com.cinemate.series;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(collection = "episodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Episode {
    @Field("episode_number")
    private int episodeNumber;
    @Field("title")
    private String title;
    @Field("description")
    private String description;
    @Field("duration")
    private String duration;
    @Field("release_date")
    private Date releaseDate;
    @Field("poster_url")
    private String posterUrl;
}
