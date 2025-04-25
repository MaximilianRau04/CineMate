package com.cinemate.series;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeriesService {

    private final SeriesRepository seriesRepository;

    @Autowired
    public SeriesService(SeriesRepository seriesRepository) {
        this.seriesRepository = seriesRepository;
    }

    public ResponseEntity<List<Series>> getAllSeries() {
        return ResponseEntity.ok(seriesRepository.findAll());
    }

    public Optional<Series> getSeriesById(String id) {
        return seriesRepository.findById(id);
    }

    public ResponseEntity<Series> createSeries(Series series) {
        return ResponseEntity.ok(seriesRepository.save(series));
    }

    public ResponseEntity<Series> updateSeries(String id, Series updatedSeries) {
        updatedSeries.setId(id);
        return ResponseEntity.ok(seriesRepository.save(updatedSeries));
    }

    public void deleteSeries(String id) {
        seriesRepository.deleteById(id);
    }
}
