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
     * @return List<Series>
     */
    @GetMapping
    public ResponseEntity<List<SeriesResponseDTO>> getAllSeries() {
        return seriesService.getAllSeries();
    }

    /**
     * returns the series with the given id
     * @param id
     * @return Series
     */
    @GetMapping("/{id}")
    public ResponseEntity<SeriesResponseDTO> getSeriesById(@PathVariable String id) {
        return seriesService.getSeriesById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * creates a series
     * @param series
     * @return Series
     */
    @PostMapping
    public ResponseEntity<SeriesResponseDTO> createSeries(@RequestBody SeriesRequestDTO series) {
        return seriesService.createSeries(series);
    }

    /**
     * updates the series with the given id
     * @param id
     * @param series
     * @return Series
     */
    @PutMapping("/{id}")
    public ResponseEntity<SeriesResponseDTO> updateSeries(@PathVariable String id, @RequestBody SeriesRequestDTO series) {
        return seriesService.updateSeries(id, series);
    }

    /**
     * deletes the series with the given id
     * @param id
     * @return Series
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeries(@PathVariable String id) {
        seriesService.deleteSeries(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * returns all seasons from a series
     * @param id
     * @return ResponseEntity<List<Series.Season>>
     */
    @GetMapping("/{id}/seasons")
    public ResponseEntity<List<Series.Season>> getSeasons(@PathVariable String id) {
        return seriesService.getSeasons(id);
    }

    /**
     * returns all seasons from a series
     * @param id
     * @param seasonNumber
     * @return ResponseEntity<Series.Season>
     */
    @GetMapping("/{id}/seasons/{seasonNumber}")
    public ResponseEntity<Series.Season> getSeason(
            @PathVariable String id,
            @PathVariable int seasonNumber) {
        return seriesService.getSeason(id, seasonNumber);
    }

    /**
     * adds a season to a series
     * @param id
     * @param season
     * @return ResponseEntity<Series>
     */
    @PostMapping("/{id}/seasons")
    public ResponseEntity<Series> addSeason(
            @PathVariable String id,
            @RequestBody Series.Season season) {
        return seriesService.addSeason(id, season);
    }

    /**
     * updates a season of a series
     * @param id
     * @param seasonNumber
     * @param season
     * @return ResponseEntity<Series>
     */
    @PutMapping("/{id}/seasons/{seasonNumber}")
    public ResponseEntity<Series> updateSeason(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @RequestBody Series.Season season) {
        return seriesService.updateSeason(id, seasonNumber, season);
    }

    /**
     * deletes a season from a series
     * @param id
     * @param seasonNumber
     * @return ResponseEntity<Series>
     */
    @DeleteMapping("/{id}/seasons/{seasonNumber}")
    public ResponseEntity<Series> deleteSeason(
            @PathVariable String id,
            @PathVariable int seasonNumber) {
        return seriesService.deleteSeason(id, seasonNumber);
    }

    /**
     * returns all episodes of a season from a series
     * @param id
     * @param seasonNumber
     * @return ResponseEntity<List<Series.Episode>>
     */
    @GetMapping("/{id}/seasons/{seasonNumber}/episodes")
    public ResponseEntity<List<Series.Episode>> getEpisodes(
            @PathVariable String id,
            @PathVariable int seasonNumber) {
        return seriesService.getEpisodes(id, seasonNumber);
    }

    /**
     * returns a specific episode of a season from a series
     * @param id
     * @param seasonNumber
     * @return ResponseEntity<Series.Episode>
     */
    @GetMapping("/{id}/seasons/{seasonNumber}/episodes/{episodeNumber}")
    public ResponseEntity<Series.Episode> getEpisode(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @PathVariable int episodeNumber) {
        return seriesService.getEpisode(id, seasonNumber, episodeNumber);
    }

    /**
     * adds an episode to a season of a series
     * @param id
     * @param seasonNumber
     * @return ResponseEntity<Series.Episode>
     */
    @PostMapping("/{id}/seasons/{seasonNumber}/episodes")
    public ResponseEntity<Series> addEpisode(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @RequestBody Series.Episode episode) {
        return seriesService.addEpisode(id, seasonNumber, episode);
    }

    /**
     * updates an episode of a season of a series
     * @param id
     * @param seasonNumber
     * @param episodeNumber
     * @param episode
     * @return ResponseEntity<Series>
     */
    @PutMapping("/{id}/seasons/{seasonNumber}/episodes/{episodeNumber}")
    public ResponseEntity<Series> updateEpisode(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @PathVariable int episodeNumber,
            @RequestBody Series.Episode episode) {
        return seriesService.updateEpisode(id, seasonNumber, episodeNumber, episode);
    }

    /**
     * delets an episode of a season from a series
     * @param id
     * @param seasonNumber
     * @param episodeNumber
     * @return ResponseEntity<Series>
     */
    @DeleteMapping("/{id}/seasons/{seasonNumber}/episodes/{episodeNumber}")
    public ResponseEntity<Series> deleteEpisode(
            @PathVariable String id,
            @PathVariable int seasonNumber,
            @PathVariable int episodeNumber) {
        return seriesService.deleteEpisode(id, seasonNumber, episodeNumber);
    }

    /**
     * returns the director of a series
     * @param id
     * @return
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
     * @return
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
    public ResponseEntity<List<ActorResponseDTO>> addActorToSeries(
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
    public ResponseEntity<List<ActorResponseDTO>> removeActorFromSeries(
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
    public ResponseEntity<List<DirectorResponseDTO>> addDirectorToSeries(
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
    public ResponseEntity<List<DirectorResponseDTO>> removeDirectorFromSeries(
            @PathVariable String seriesId,
            @PathVariable String directorId) {
        return seriesService.removeDirectorFromSeries(seriesId, directorId);
    }

}
