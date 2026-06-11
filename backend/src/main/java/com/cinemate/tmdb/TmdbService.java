package com.cinemate.tmdb;

import com.cinemate.movie.Movie;
import com.cinemate.movie.MovieRepository;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.series.Series;
import com.cinemate.series.SeriesRepository;
import com.cinemate.series.Status;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.tmdb.dto.TmdbMovieResult;
import com.cinemate.tmdb.dto.TmdbSeriesResult;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TmdbService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    private RestClient restClient;

    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    private static final String IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    private static final String YOUTUBE_URL = "https://www.youtube.com/watch?v=";

    public TmdbService(MovieRepository movieRepository, SeriesRepository seriesRepository) {
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
    }

    @PostConstruct
    private void init() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.themoviedb.org/3")
                .build();
    }

    public List<TmdbMovieResult> searchMovies(String query) {
        TmdbPage<RawMovie> page = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("query", query)
                        .queryParam("language", "de-DE")
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (page == null || page.results == null) return List.of();

        return page.results.stream()
                .map(m -> TmdbMovieResult.builder()
                        .tmdbId(m.id)
                        .title(m.title)
                        .overview(m.overview)
                        .posterUrl(m.posterPath != null ? IMAGE_BASE_URL + m.posterPath : null)
                        .releaseDate(m.releaseDate)
                        .voteAverage(m.voteAverage)
                        .build())
                .collect(Collectors.toList());
    }

    public List<TmdbSeriesResult> searchSeries(String query) {
        TmdbPage<RawSeries> page = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/tv")
                        .queryParam("api_key", apiKey)
                        .queryParam("query", query)
                        .queryParam("language", "de-DE")
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (page == null || page.results == null) return List.of();

        return page.results.stream()
                .map(s -> TmdbSeriesResult.builder()
                        .tmdbId(s.id)
                        .name(s.name)
                        .overview(s.overview)
                        .posterUrl(s.posterPath != null ? IMAGE_BASE_URL + s.posterPath : null)
                        .firstAirDate(s.firstAirDate)
                        .voteAverage(s.voteAverage)
                        .build())
                .collect(Collectors.toList());
    }

    public ResponseEntity<MovieResponseDTO> importMovie(int tmdbId) {
        Optional<Movie> existing = movieRepository.findByTmdbId(tmdbId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(new MovieResponseDTO(existing.get()));
        }

        RawMovie raw = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{id}")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "de-DE")
                        .queryParam("append_to_response", "videos")
                        .build(tmdbId))
                .retrieve()
                .body(RawMovie.class);

        if (raw == null) return ResponseEntity.notFound().build();

        Movie movie = new Movie();
        movie.setTmdbId(raw.id);
        movie.setTitle(raw.title);
        movie.setDescription(raw.overview);
        movie.setGenre(raw.genres != null
                ? raw.genres.stream().map(g -> g.name).collect(Collectors.joining(", "))
                : null);
        movie.setRating(raw.voteAverage);
        movie.setReviewCount(raw.voteCount);
        movie.setReleaseDate(parseDate(raw.releaseDate));
        movie.setDuration(raw.runtime > 0 ? raw.runtime + " min" : null);
        movie.setPosterUrl(raw.posterPath != null ? IMAGE_BASE_URL + raw.posterPath : null);
        movie.setCountry(raw.productionCountries != null && !raw.productionCountries.isEmpty()
                ? raw.productionCountries.get(0).name
                : null);
        movie.setTrailerUrl(findTrailer(raw.videos));

        return ResponseEntity.ok(new MovieResponseDTO(movieRepository.save(movie)));
    }

    public ResponseEntity<SeriesResponseDTO> importSeries(int tmdbId) {
        Optional<Series> existing = seriesRepository.findByTmdbId(tmdbId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(new SeriesResponseDTO(existing.get()));
        }

        RawSeries raw = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tv/{id}")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "de-DE")
                        .queryParam("append_to_response", "videos")
                        .build(tmdbId))
                .retrieve()
                .body(RawSeries.class);

        if (raw == null) return ResponseEntity.notFound().build();

        Series series = new Series();
        series.setTmdbId(raw.id);
        series.setTitle(raw.name);
        series.setDescription(raw.overview);
        series.setGenre(raw.genres != null
                ? raw.genres.stream().map(g -> g.name).collect(Collectors.joining(", "))
                : null);
        series.setRating(raw.voteAverage);
        series.setReviewCount(raw.voteCount);
        series.setReleaseDate(parseDate(raw.firstAirDate));
        series.setPosterUrl(raw.posterPath != null ? IMAGE_BASE_URL + raw.posterPath : null);
        series.setCountry(raw.originCountry != null && !raw.originCountry.isEmpty()
                ? raw.originCountry.get(0)
                : null);
        series.setTrailerUrl(findTrailer(raw.videos));
        series.setStatus(mapStatus(raw.status));

        return ResponseEntity.ok(new SeriesResponseDTO(seriesRepository.save(series)));
    }

    private String findTrailer(VideoResults videos) {
        if (videos == null || videos.results == null) return null;
        return videos.results.stream()
                .filter(v -> "YouTube".equals(v.site) && "Trailer".equals(v.type))
                .findFirst()
                .map(v -> YOUTUBE_URL + v.key)
                .orElse(null);
    }

    private Date parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
        } catch (ParseException e) {
            return null;
        }
    }

    private Status mapStatus(String tmdbStatus) {
        if (tmdbStatus == null) return null;
        return switch (tmdbStatus) {
            case "Returning Series" -> Status.RETURNING;
            case "Ended" -> Status.FINISHED;
            case "In Production", "Planned", "Pilot" -> Status.IN_PRODUCTION;
            case "Canceled", "Cancelled" -> Status.CANCELLED;
            default -> Status.ONGOING;
        };
    }

    // --- Internal TMDB response models ---

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class TmdbPage<T> {
        public List<T> results;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class RawMovie {
        public int id;
        public String title;
        public String overview;
        @JsonProperty("poster_path") public String posterPath;
        @JsonProperty("release_date") public String releaseDate;
        @JsonProperty("vote_average") public double voteAverage;
        @JsonProperty("vote_count") public int voteCount;
        public int runtime;
        public List<Genre> genres;
        @JsonProperty("production_countries") public List<ProductionCountry> productionCountries;
        public VideoResults videos;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class RawSeries {
        public int id;
        public String name;
        public String overview;
        @JsonProperty("poster_path") public String posterPath;
        @JsonProperty("first_air_date") public String firstAirDate;
        @JsonProperty("vote_average") public double voteAverage;
        @JsonProperty("vote_count") public int voteCount;
        public List<Genre> genres;
        @JsonProperty("origin_country") public List<String> originCountry;
        public String status;
        public VideoResults videos;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Genre {
        public String name;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class ProductionCountry {
        public String name;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class VideoResults {
        public List<Video> results;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Video {
        public String key;
        public String site;
        public String type;
    }
}
