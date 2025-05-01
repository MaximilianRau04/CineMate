package com.cinemate.series;

import com.cinemate.movie.Movie;
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
        Optional<Series> optionalSeries = seriesRepository.findById(id);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Series existingSeries = optionalSeries.get();

        if (updatedSeries.getTitle() != null) existingSeries.setTitle(updatedSeries.getTitle());
        if (updatedSeries.getDescription() != null) existingSeries.setDescription(updatedSeries.getDescription());
        if (updatedSeries.getReleaseDate() != null) existingSeries.setReleaseDate(updatedSeries.getReleaseDate());
        if (updatedSeries.getGenre() != null) existingSeries.setGenre(updatedSeries.getGenre());
        if (updatedSeries.getSeasons() != null) existingSeries.setSeasons(updatedSeries.getSeasons());
        if(updatedSeries.getPosterUrl() != null) existingSeries.setPosterUrl(updatedSeries.getPosterUrl());

        return ResponseEntity.ok(seriesRepository.save(existingSeries));
    }

    public void deleteSeries(String id) {
        seriesRepository.deleteById(id);
    }
}
