package com.cinemate.tmdb;

import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.tmdb.dto.TmdbMovieResult;
import com.cinemate.tmdb.dto.TmdbSeriesResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tmdb")
@RequiredArgsConstructor
public class TmdbController {

    private final TmdbService tmdbService;

    @GetMapping("/search/movies")
    public ResponseEntity<List<TmdbMovieResult>> searchMovies(@RequestParam String query) {
        return ResponseEntity.ok(tmdbService.searchMovies(query));
    }

    @GetMapping("/search/series")
    public ResponseEntity<List<TmdbSeriesResult>> searchSeries(@RequestParam String query) {
        return ResponseEntity.ok(tmdbService.searchSeries(query));
    }

    @PostMapping("/import/movie/{tmdbId}")
    public ResponseEntity<MovieResponseDTO> importMovie(@PathVariable int tmdbId) {
        return tmdbService.importMovie(tmdbId);
    }

    @PostMapping("/import/series/{tmdbId}")
    public ResponseEntity<SeriesResponseDTO> importSeries(@PathVariable int tmdbId) {
        return tmdbService.importSeries(tmdbId);
    }
}
