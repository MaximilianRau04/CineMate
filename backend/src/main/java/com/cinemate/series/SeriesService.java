package com.cinemate.series;

import com.cinemate.movie.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

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
        if (updatedSeries.getSeasons() != null) {
            mergeSeasons(existingSeries.getSeasons(), updatedSeries.getSeasons());
        }

        if(updatedSeries.getPosterUrl() != null) existingSeries.setPosterUrl(updatedSeries.getPosterUrl());

        return ResponseEntity.ok(seriesRepository.save(existingSeries));
    }

    /**
     * Ensures that seasons that were already there are not overwritten
     * @param existingSeasons
     * @param updatedSeasons
     */
    private void mergeSeasons(List<Series.Season> existingSeasons, List<Series.Season> updatedSeasons) {
        Map<Integer, Series.Season> updatedMap = updatedSeasons.stream()
                .collect(Collectors.toMap(Series.Season::getSeasonNumber, s -> s));

        Iterator<Series.Season> iterator = existingSeasons.iterator();
        while (iterator.hasNext()) {
            Series.Season existingSeason = iterator.next();
            if (updatedMap.containsKey(existingSeason.getSeasonNumber())) {
                Series.Season updatedSeason = updatedMap.get(existingSeason.getSeasonNumber());

                List<Series.Episode> validUpdatedEpisodes = updatedSeason.getEpisodes().stream()
                        .filter(e -> e.getTitle() != null && e.getReleaseDate() != null && e.getEpisodeNumber() > 0)
                        .collect(Collectors.toList());

                Map<Integer, Series.Episode> existingEpisodesMap = existingSeason.getEpisodes().stream()
                        .filter(e -> e.getEpisodeNumber() > 0)
                        .collect(Collectors.toMap(Series.Episode::getEpisodeNumber, e -> e, (e1, e2) -> e1));

                Map<Integer, Series.Episode> updatedEpisodesMap = validUpdatedEpisodes.stream()
                        .collect(Collectors.toMap(Series.Episode::getEpisodeNumber, e -> e, (e1, e2) -> e2));

                updatedEpisodesMap.forEach((episodeNumber, updatedEpisode) ->
                        existingEpisodesMap.put(episodeNumber, updatedEpisode));

                List<Series.Episode> mergedEpisodes = new ArrayList<>(existingEpisodesMap.values());
                mergedEpisodes.sort(Comparator.comparing(Series.Episode::getEpisodeNumber));

                existingSeason.setEpisodes(mergedEpisodes);

                updatedMap.remove(existingSeason.getSeasonNumber());
            }
        }

        for (Series.Season newSeason : updatedMap.values()) {
            List<Series.Episode> validEpisodes = newSeason.getEpisodes().stream()
                    .filter(e -> e.getTitle() != null && e.getReleaseDate() != null && e.getEpisodeNumber() > 0)
                    .sorted(Comparator.comparing(Series.Episode::getEpisodeNumber))
                    .collect(Collectors.toList());
            newSeason.setEpisodes(validEpisodes);
            existingSeasons.add(newSeason);
        }

        existingSeasons.sort(Comparator.comparing(Series.Season::getSeasonNumber));
    }

    public void deleteSeries(String id) {
        seriesRepository.deleteById(id);
    }

    public ResponseEntity<List<Series.Season>> getSeasons(String seriesId) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(optionalSeries.get().getSeasons());
    }

    public ResponseEntity<Series.Season> getSeason(String seriesId, int seasonNumber) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Optional<Series.Season> season = series.getSeasons().stream()
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();

        return season.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Series> addSeason(String seriesId, Series.Season newSeason) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();

        if (newSeason.getSeasonNumber() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        boolean seasonExists = series.getSeasons().stream()
                .anyMatch(s -> s.getSeasonNumber() == newSeason.getSeasonNumber());

        if (seasonExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if (newSeason.getEpisodes() != null) {
            List<Series.Episode> validEpisodes = newSeason.getEpisodes().stream()
                    .filter(e -> e.getTitle() != null && e.getReleaseDate() != null && e.getEpisodeNumber() > 0)
                    .sorted(Comparator.comparing(Series.Episode::getEpisodeNumber))
                    .collect(Collectors.toList());
            newSeason.setEpisodes(validEpisodes);
        }

        series.getSeasons().add(newSeason);

        series.getSeasons().sort(Comparator.comparing(Series.Season::getSeasonNumber));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(seriesRepository.save(series));
    }

    public ResponseEntity<Series> updateSeason(String seriesId, int seasonNumber, Series.Season updatedSeason) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();

        Optional<Series.Season> existingSeason = series.getSeasons().stream()
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();

        if (existingSeason.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Season season = existingSeason.get();

        if (updatedSeason.getEpisodes() != null) {
            List<Series.Episode> existingEpisodes = season.getEpisodes();
            List<Series.Episode> updatedEpisodes = updatedSeason.getEpisodes();

            mergeEpisodes(existingEpisodes, updatedEpisodes);
        }

        return ResponseEntity.ok(seriesRepository.save(series));
    }

    public ResponseEntity<Series> deleteSeason(String seriesId, int seasonNumber) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        boolean removed = series.getSeasons().removeIf(s -> s.getSeasonNumber() == seasonNumber);

        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(seriesRepository.save(series));
    }

    public ResponseEntity<List<Series.Episode>> getEpisodes(String seriesId, int seasonNumber) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Series.Season> season = optionalSeries.get().getSeasons().stream()
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();

        if (season.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(season.get().getEpisodes());
    }

    public ResponseEntity<Series.Episode> getEpisode(String seriesId, int seasonNumber, int episodeNumber) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Series.Season> season = optionalSeries.get().getSeasons().stream()
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();

        if (season.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Series.Episode> episode = season.get().getEpisodes().stream()
                .filter(e -> e.getEpisodeNumber() == episodeNumber)
                .findFirst();

        return episode.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Series> addEpisode(String seriesId, int seasonNumber, Series.Episode newEpisode) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();

        Optional<Series.Season> optionalSeason = series.getSeasons().stream()
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();

        if (optionalSeason.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Season season = optionalSeason.get();

        if (newEpisode.getTitle() == null || newEpisode.getReleaseDate() == null || newEpisode.getEpisodeNumber() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        boolean episodeExists = season.getEpisodes().stream()
                .anyMatch(e -> e.getEpisodeNumber() == newEpisode.getEpisodeNumber());

        if (episodeExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        season.getEpisodes().add(newEpisode);

        season.getEpisodes().sort(Comparator.comparing(Series.Episode::getEpisodeNumber));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(seriesRepository.save(series));
    }

    public ResponseEntity<Series> updateEpisode(String seriesId, int seasonNumber, int episodeNumber, Series.Episode updatedEpisode) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();

        Optional<Series.Season> optionalSeason = series.getSeasons().stream()
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();

        if (optionalSeason.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Season season = optionalSeason.get();

        Optional<Series.Episode> optionalEpisode = season.getEpisodes().stream()
                .filter(e -> e.getEpisodeNumber() == episodeNumber)
                .findFirst();

        if (optionalEpisode.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Episode episode = optionalEpisode.get();

        if (updatedEpisode.getTitle() != null) episode.setTitle(updatedEpisode.getTitle());
        if (updatedEpisode.getDescription() != null) episode.setDescription(updatedEpisode.getDescription());
        if (updatedEpisode.getDuration() != null) episode.setDuration(updatedEpisode.getDuration());
        if (updatedEpisode.getReleaseDate() != null) episode.setReleaseDate(updatedEpisode.getReleaseDate());
        if (updatedEpisode.getPosterUrl() != null) episode.setPosterUrl(updatedEpisode.getPosterUrl());

        return ResponseEntity.ok(seriesRepository.save(series));
    }

    public ResponseEntity<Series> deleteEpisode(String seriesId, int seasonNumber, int episodeNumber) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();

        Optional<Series.Season> optionalSeason = series.getSeasons().stream()
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();

        if (optionalSeason.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Season season = optionalSeason.get();

        boolean removed = season.getEpisodes().removeIf(e -> e.getEpisodeNumber() == episodeNumber);

        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(seriesRepository.save(series));
    }

    /**
     * Ensures that episodes that were already there are not overwritten
     * @param existingEpisodes
     * @param updatedEpisodes
     */
    private void mergeEpisodes(List<Series.Episode> existingEpisodes, List<Series.Episode> updatedEpisodes) {
        List<Series.Episode> validUpdatedEpisodes = updatedEpisodes.stream()
                .filter(e -> e.getTitle() != null && e.getReleaseDate() != null && e.getEpisodeNumber() > 0)
                .collect(Collectors.toList());

        Map<Integer, Series.Episode> existingEpisodesMap = existingEpisodes.stream()
                .filter(e -> e.getEpisodeNumber() > 0)
                .collect(Collectors.toMap(Series.Episode::getEpisodeNumber, e -> e, (e1, e2) -> e1));

        Map<Integer, Series.Episode> updatedEpisodesMap = validUpdatedEpisodes.stream()
                .collect(Collectors.toMap(Series.Episode::getEpisodeNumber, e -> e, (e1, e2) -> e2));

        updatedEpisodesMap.forEach((episodeNumber, updatedEpisode) ->
                existingEpisodesMap.put(episodeNumber, updatedEpisode));

        List<Series.Episode> mergedEpisodes = new ArrayList<>(existingEpisodesMap.values());
        mergedEpisodes.sort(Comparator.comparing(Series.Episode::getEpisodeNumber));

        existingEpisodes.clear();
        existingEpisodes.addAll(mergedEpisodes);
    }
}
