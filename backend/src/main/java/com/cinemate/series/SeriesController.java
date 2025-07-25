package com.cinemate.series;

import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.director.DTOs.DirectorResponseDTO;
import com.cinemate.series.DTOs.SeriesRequestDTO;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
public class SeriesController {

    private final SeriesService seriesService;

    @Autowired
    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    /**
     * returns all series
     * @return List<SeriesResponseDTO>
     */
    @GetMapping
    public ResponseEntity<List<SeriesResponseDTO>> getAllSeries() {
        return seriesService.getAllSeries();
    }

    /**
     * returns the series with the given id
     * @param id
     * @return SeriesResponseDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<SeriesResponseDTO> getSeriesById(@PathVariable String id) {
        return seriesService.getSeriesById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * search series by name
     * @param query
     * @return List<SeriesResponseDTO>
     */
    @GetMapping("/search")
    public ResponseEntity<List<SeriesResponseDTO>> searchSeries(@RequestParam String query) {
        return seriesService.searchSeries(query);
    }

    /**
     * creates a series
     * @param series
     * @return SeriesResponseDTO
     */
    @PostMapping
    public ResponseEntity<SeriesResponseDTO> createSeries(@RequestBody SeriesRequestDTO series) {
        return seriesService.createSeries(series);
    }

    /**
     * updates the series with the given id
     * @param id
     * @param series
     * @return SeriesResponseDTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<SeriesResponseDTO> updateSeries(@PathVariable String id, @RequestBody SeriesRequestDTO series) {
        return seriesService.updateSeries(id, series);
    }

    /**
     * deletes the series with the given id
     * @param id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeries(@PathVariable String id) {
        seriesService.deleteSeries(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * returns all seasons from a series
     * @param id
     * @return RList<Series.Season>
     */
    @GetMapping("/{id}/seasons")
    public ResponseEntity<List<Season>> getSeasons(@PathVariable String id) {
        return seriesService.getSeasons(id);
    }

    /**
     * returns all seasons from a series
     * @param id
     * @param seasonNumber
     * @return eries.Season
     */
    @GetMapping("/{id}/seasons/{seasonNumber}")
    public ResponseEntity<Season> getSeason(
            @PathVariable String id,
            @PathVariable int seasonNumber) {
        return seriesService.getSeason(id, seasonNumber);
    }

    /**
     * adds a season to a series
     * @param id
     * @param season
     * @return List<Series.Season>
     */
    @PostMapping("/{id}/seasons")
    public ResponseEntity<Season> addSeason(
            @PathVariable String id,
            @RequestBody Season season) {
        return seriesService.addSeason(id, season);
    }

    /**
     * updates a season of a series
     * @param id
     * @param seasonNumber
     * @param season
     * @return List<Series.Season>
     */
    @PutMapping("/{id}/seasons/{seasonNumber}")
    public ResponseEntity<Season> updateSeason(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @RequestBody Season season) {
        return seriesService.updateSeason(id, seasonNumber, season);
    }

    /**
     * deletes a season from a series
     * @param id
     * @param seasonNumber
     * @return List<Series.Season>
     */
    @DeleteMapping("/{id}/seasons/{seasonNumber}")
    public ResponseEntity<Void> deleteSeason(
            @PathVariable String id,
            @PathVariable int seasonNumber) {
        return seriesService.deleteSeason(id, seasonNumber);
    }

    /**
     * returns all episodes of a season from a series
     * @param id
     * @param seasonNumber
     * @return List<Series.Episode>
     */
    @GetMapping("/{id}/seasons/{seasonNumber}/episodes")
    public ResponseEntity<List<Episode>> getEpisodes(
            @PathVariable String id,
            @PathVariable int seasonNumber) {
        return seriesService.getEpisodes(id, seasonNumber);
    }

    /**
     * returns a specific episode of a season from a series
     * @param id
     * @param seasonNumber
     * @return List<Series.Episode>
     */
    @GetMapping("/{id}/seasons/{seasonNumber}/episodes/{episodeNumber}")
    public ResponseEntity<Episode> getEpisode(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @PathVariable int episodeNumber) {
        return seriesService.getEpisode(id, seasonNumber, episodeNumber);
    }

    /**
     * adds an episode to a season of a series
     * @param id
     * @param seasonNumber
     * @return List<Series.Episode>
     */
    @PostMapping("/{id}/seasons/{seasonNumber}/episodes")
    public ResponseEntity<Episode> addEpisode(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @RequestBody Episode episode) {
        return seriesService.addEpisode(id, seasonNumber, episode);
    }

    /**
     * updates an episode of a season of a series
     * @param id
     * @param seasonNumber
     * @param episodeNumber
     * @param episode
     * @return Series
     */
    @PutMapping("/{id}/seasons/{seasonNumber}/episodes/{episodeNumber}")
    public ResponseEntity<Episode> updateEpisode(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @PathVariable int episodeNumber,
            @RequestBody Episode episode) {
        return seriesService.updateEpisode(id, seasonNumber, episodeNumber, episode);
    }

    /**
     * delets an episode of a season from a series
     * @param id
     * @param seasonNumber
     * @param episodeNumber
     * @return Series
     */
    @DeleteMapping("/{id}/seasons/{seasonNumber}/episodes/{episodeNumber}")
    public ResponseEntity<Void> deleteEpisode(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @PathVariable int episodeNumber) {
        return seriesService.deleteEpisode(id, seasonNumber, episodeNumber);
    }

    /**
     * returns the director of a series
     * @param id
     * @return List<DirectorResponseDTO>
     */
    @GetMapping("/{id}/directors")
    public ResponseEntity<List<DirectorResponseDTO>> getDirectorOfSeries(@PathVariable String id) {
        return seriesService.getDirectorOfSeries(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * returns the director of a series
     * @param id
     * @return List<ActorResponseDTO>
     */
    @GetMapping("/{id}/actors")
    public ResponseEntity<List<ActorResponseDTO>> getActorsOfSeries(@PathVariable String id) {
        return seriesService.getActorsOfSeries(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * adds an actor to the series
     * @param seriesId
     * @param actorId
     * @return List<ActorResponseDTO>
     */
    @PostMapping("/{seriesId}/actors/{actorId}")
    public ResponseEntity<ActorResponseDTO> addActorToSeries(
            @PathVariable String seriesId,
            @PathVariable String actorId) {
        return seriesService.addActorToSeries(seriesId, actorId);
    }

    /**
     * removes an actor from the series
     * @param seriesId
     * @param actorId
     * @return List<ActorResponseDTO>
     */
    @DeleteMapping("/{seriesId}/actors/{actorId}")
    public ResponseEntity<Void> removeActorFromSeries(
            @PathVariable String seriesId,
            @PathVariable String actorId) {
        return seriesService.removeActorFromSeries(seriesId, actorId);
    }

    /**
     * sets the director of the series
     * @param seriesId
     * @param directorId
     * @return List<DirectorResponseDTO>
     */
    @PostMapping("/{seriesId}/directors/{directorId}")
    public ResponseEntity<DirectorResponseDTO> addDirectorToSeries(
            @PathVariable String seriesId,
            @PathVariable String directorId) {
        return seriesService.addDirectorToSeries(seriesId, directorId);
    }

    /**
     * removes the director from the series
     * @param seriesId
     * @param directorId
     * @return List<DirectorResponseDTO>
     */
    @DeleteMapping("/{seriesId}/directors/{directorId}")
    public ResponseEntity<Void> removeDirectorFromSeries(
            @PathVariable String seriesId,
            @PathVariable String directorId) {
        return seriesService.removeDirectorFromSeries(seriesId, directorId);
    }
}
