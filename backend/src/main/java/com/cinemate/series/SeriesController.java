package com.cinemate.series;

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
    public ResponseEntity<List<Series>> getAllSeries() {
        return seriesService.getAllSeries();
    }

    /**
     * returns the series with the given id
     * @param id
     * @return Series
     */
    @GetMapping("/{id}")
    public ResponseEntity<Series> getSeriesById(@PathVariable String id) {
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
    public ResponseEntity<Series> createSeries(@RequestBody Series series) {
        return seriesService.createSeries(series);
    }

    /**
     * updates the series with the given id
     * @param id
     * @param series
     * @return Series
     */
    @PutMapping("/{id}")
    public ResponseEntity<Series> updateSeries(@PathVariable String id, @RequestBody Series series) {
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
}
