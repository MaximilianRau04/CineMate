package com.cinemate.recommendation;

import org.springframework.data.annotation.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {
    @Id
    private String id;
    @NotNull
    private String title;
    private String type;
    private double score;
    private String reason;
    private String posterUrl;

}
