package com.cinemate.series;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "seasons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Season {
    @Id
    private String id;
    @Field("season_number")
    private int seasonNumber;
    @Field("episodes")
    private List<Episode> episodes;
    @Field("trailer_url")
    private String trailerUrl;

}
