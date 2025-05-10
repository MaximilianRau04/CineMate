
package com.cinemate.series;

import com.cinemate.actor.Actor;
import com.cinemate.actor.ActorRepository;
import com.cinemate.actor.DTOs.ActorResponseDTO;
import com.cinemate.director.DTOs.DirectorResponseDTO;
import com.cinemate.director.Director;
import com.cinemate.director.DirectorRepository;
import com.cinemate.series.DTOs.SeriesRequestDTO;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SeriesService {

    private final SeriesRepository seriesRepository;
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;

    @Autowired
    public SeriesService(SeriesRepository seriesRepository,
                         ActorRepository actorRepository,
                         DirectorRepository directorRepository) {
        this.seriesRepository = seriesRepository;
        this.actorRepository = actorRepository;
        this.directorRepository = directorRepository;
    }

    public ResponseEntity<List<SeriesResponseDTO>> getAllSeries() {
        List<Series> seriesList = seriesRepository.findAll();
        List<SeriesResponseDTO> seriesDTOs = seriesList.stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(seriesDTOs);
    }

    public Optional<SeriesResponseDTO> getSeriesById(String id) {
        return seriesRepository.findById(id)
                .map(SeriesResponseDTO::new);
    }

    public ResponseEntity<SeriesResponseDTO> createSeries(SeriesRequestDTO seriesDTO) {
        Series series = buildSeriesFromDTO(null, seriesDTO);
        Series savedSeries = seriesRepository.save(series);
        return ResponseEntity.ok(new SeriesResponseDTO(savedSeries));
    }

    public ResponseEntity<SeriesResponseDTO> updateSeries(String id, SeriesRequestDTO seriesDTO) {
        Optional<Series> optionalSeries = seriesRepository.findById(id);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series updatedSeries = buildSeriesFromDTO(id, seriesDTO);
        updateSeriesFields(updatedSeries, seriesDTO);
        Series savedSeries = seriesRepository.save(updatedSeries);
        return ResponseEntity.ok(new SeriesResponseDTO(savedSeries));
    }

    private void updateSeriesFields(Series series, SeriesRequestDTO seriesDTO) {
        if (seriesDTO.getTitle() != null) series.setTitle(seriesDTO.getTitle());
        if (seriesDTO.getDescription() != null) series.setDescription(seriesDTO.getDescription());
        if (seriesDTO.getReleaseDate() != null) series.setReleaseDate(seriesDTO.getReleaseDate());
        if (seriesDTO.getGenre() != null) series.setGenre(seriesDTO.getGenre());
        if (seriesDTO.getPosterUrl() != null) series.setPosterUrl(seriesDTO.getPosterUrl());
        if (seriesDTO.getCountry() != null) series.setCountry(seriesDTO.getCountry());
        if (seriesDTO.getTrailerUrl() != null) series.setTrailerUrl(seriesDTO.getTrailerUrl());

        if (seriesDTO.getDirectorId() != null) {
            directorRepository.findById(seriesDTO.getDirectorId()).ifPresent(series::setDirector);
        }

        if (seriesDTO.getActorIds() != null && !seriesDTO.getActorIds().isEmpty()) {
            List<Actor> actors = new ArrayList<>();
            for (String actorId : seriesDTO.getActorIds()) {
                actorRepository.findById(actorId).ifPresent(actors::add);
            }
            series.setActors(actors);
        }

        if (seriesDTO.getSeasons() != null) {
            mergeSeasons(series.getSeasons(), seriesDTO.getSeasons());
        }
    }


    public void deleteSeries(String id) {
        seriesRepository.deleteById(id);
    }

    /**
     * Get all seasons of a series
     */
    public ResponseEntity<List<Series.Season>> getSeasons(String seriesId) {
        return findAndProcessEntity(seriesId, series -> series.getSeasons());
    }

    /**
     * Get a specific season from a series
     */
    public ResponseEntity<Series.Season> getSeason(String seriesId, int seasonNumber) {
        return findAndProcessEntity(seriesId, series ->
                findSeasonByNumber(series, seasonNumber).orElse(null));
    }

    /**
     * Add a new season to a series
     */
    public ResponseEntity<Series> addSeason(String seriesId, Series.Season newSeason) {
        if (newSeason.getSeasonNumber() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return findAndUpdateEntity(seriesId, series -> {
            boolean seasonExists = series.getSeasons().stream()
                    .anyMatch(s -> s.getSeasonNumber() == newSeason.getSeasonNumber());

            if (seasonExists) {
                return null;
            }

            if (newSeason.getEpisodes() != null) {
                List<Series.Episode> validEpisodes = validateAndSortEpisodes(newSeason.getEpisodes());
                newSeason.setEpisodes(validEpisodes);
            } else {
                newSeason.setEpisodes(new ArrayList<>());
            }

            series.getSeasons().add(newSeason);
            series.getSeasons().sort(Comparator.comparing(Series.Season::getSeasonNumber));

            return seriesRepository.save(series);
        }, HttpStatus.CREATED, HttpStatus.CONFLICT);
    }

    /**
     * Update a specific season in a series
     */
    public ResponseEntity<Series> updateSeason(String seriesId, int seasonNumber, Series.Season updatedSeason) {
        return findAndUpdateEntity(seriesId, series -> {
            Optional<Series.Season> existingSeason = findSeasonByNumber(series, seasonNumber);

            if (existingSeason.isEmpty()) {
                return null;
            }

            Series.Season season = existingSeason.get();
            if (updatedSeason.getTrailerUrl() != null) season.setTrailerUrl(updatedSeason.getTrailerUrl());
            if (updatedSeason.getSeasonNumber() != -1) season.setSeasonNumber(updatedSeason.getSeasonNumber());

            if (updatedSeason.getEpisodes() != null) {
                mergeEpisodes(season.getEpisodes(), updatedSeason.getEpisodes());
            }

            return seriesRepository.save(series);
        });
    }

    /**
     * Delete a season from a series
     */
    public ResponseEntity<Series> deleteSeason(String seriesId, int seasonNumber) {
        return findAndUpdateEntity(seriesId, series -> {
            boolean removed = series.getSeasons().removeIf(s -> s.getSeasonNumber() == seasonNumber);

            if (!removed) {
                return null;
            }

            return seriesRepository.save(series);
        });
    }

    /**
     * Get all episodes of a specific season
     */
    public ResponseEntity<List<Series.Episode>> getEpisodes(String seriesId, int seasonNumber) {
        return findAndProcessEntity(seriesId, series -> {
            Optional<Series.Season> season = findSeasonByNumber(series, seasonNumber);
            return season.map(Series.Season::getEpisodes).orElse(null);
        });
    }

    /**
     * Get a specific episode from a season
     */
    public ResponseEntity<Series.Episode> getEpisode(String seriesId, int seasonNumber, int episodeNumber) {
        return findAndProcessEntity(seriesId, series -> {
            Optional<Series.Season> season = findSeasonByNumber(series, seasonNumber);

            if (season.isEmpty()) {
                return null;
            }

            return findEpisodeByNumber(season.get(), episodeNumber).orElse(null);
        });
    }

    /**
     * Add a new episode to a season
     */
    public ResponseEntity<Series> addEpisode(String seriesId, int seasonNumber, Series.Episode newEpisode) {
        if (newEpisode.getTitle() == null || newEpisode.getReleaseDate() == null || newEpisode.getEpisodeNumber() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return findAndUpdateEntity(seriesId, series -> {
            Optional<Series.Season> optionalSeason = findSeasonByNumber(series, seasonNumber);

            if (optionalSeason.isEmpty()) {
                return null;
            }

            Series.Season season = optionalSeason.get();

            boolean episodeExists = season.getEpisodes().stream()
                    .anyMatch(e -> e.getEpisodeNumber() == newEpisode.getEpisodeNumber());

            if (episodeExists) {
                return null;
            }

            season.getEpisodes().add(newEpisode);
            season.getEpisodes().sort(Comparator.comparing(Series.Episode::getEpisodeNumber));

            return seriesRepository.save(series);
        }, HttpStatus.CREATED, HttpStatus.CONFLICT);
    }

    /**
     * Update a specific episode in a season
     */
    public ResponseEntity<Series> updateEpisode(String seriesId, int seasonNumber, int episodeNumber, Series.Episode updatedEpisode) {
        return findAndUpdateEntity(seriesId, series -> {
            Optional<Series.Season> optionalSeason = findSeasonByNumber(series, seasonNumber);

            if (optionalSeason.isEmpty()) {
                return null;
            }

            Series.Season season = optionalSeason.get();

            Optional<Series.Episode> optionalEpisode = findEpisodeByNumber(season, episodeNumber);

            if (optionalEpisode.isEmpty()) {
                return null;
            }

            Series.Episode episode = optionalEpisode.get();
            updateEpisodeFields(episode, updatedEpisode);

            return seriesRepository.save(series);
        });
    }

    /**
     * Update fields of an episode entity
     */
    private void updateEpisodeFields(Series.Episode existingEpisode, Series.Episode updatedEpisode) {
        if (updatedEpisode.getTitle() != null) existingEpisode.setTitle(updatedEpisode.getTitle());
        if (updatedEpisode.getDescription() != null) existingEpisode.setDescription(updatedEpisode.getDescription());
        if (updatedEpisode.getDuration() != null) existingEpisode.setDuration(updatedEpisode.getDuration());
        if (updatedEpisode.getReleaseDate() != null) existingEpisode.setReleaseDate(updatedEpisode.getReleaseDate());
        if (updatedEpisode.getPosterUrl() != null) existingEpisode.setPosterUrl(updatedEpisode.getPosterUrl());
    }

    /**
     * Delete an episode from a season
     */
    public ResponseEntity<Series> deleteEpisode(String seriesId, int seasonNumber, int episodeNumber) {
        return findAndUpdateEntity(seriesId, series -> {
            Optional<Series.Season> optionalSeason = findSeasonByNumber(series, seasonNumber);

            if (optionalSeason.isEmpty()) {
                return null;
            }

            Series.Season season = optionalSeason.get();
            boolean removed = season.getEpisodes().removeIf(e -> e.getEpisodeNumber() == episodeNumber);

            if (!removed) {
                return null;
            }

            return seriesRepository.save(series);
        });
    }

    /**
     * Find a series and apply a processing function to it
     */
    private <T> ResponseEntity<T> findAndProcessEntity(String seriesId, Function<Series, T> processor) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);

        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        T result = processor.apply(optionalSeries.get());

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Find a series and apply an update function to it
     */
    private ResponseEntity<Series> findAndUpdateEntity(
            String seriesId,
            Function<Series, Series> updater) {
        return findAndUpdateEntity(seriesId, updater, HttpStatus.OK, HttpStatus.NOT_FOUND);
    }

    /**
     * Find a series and apply an update function to it with custom status codes
     */
    private ResponseEntity<Series> findAndUpdateEntity(
            String seriesId,
            Function<Series, Series> updater,
            HttpStatus successStatus,
            HttpStatus failureStatus) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);

        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series updatedEntity = updater.apply(optionalSeries.get());

        if (updatedEntity == null) {
            return ResponseEntity.status(failureStatus).build();
        }

        return ResponseEntity.status(successStatus).body(updatedEntity);
    }

    /**
     * Find a season by its number in a series
     */
    private Optional<Series.Season> findSeasonByNumber(Series series, int seasonNumber) {
        return series.getSeasons().stream()
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();
    }

    /**
     * Find an episode by its number in a season
     */
    private Optional<Series.Episode> findEpisodeByNumber(Series.Season season, int episodeNumber) {
        return season.getEpisodes().stream()
                .filter(e -> e.getEpisodeNumber() == episodeNumber)
                .findFirst();
    }

    /**
     * Validate and sort episodes
     */
    private List<Series.Episode> validateAndSortEpisodes(List<Series.Episode> episodes) {
        return episodes.stream()
                .filter(e -> e.getTitle() != null && e.getReleaseDate() != null && e.getEpisodeNumber() > 0)
                .sorted(Comparator.comparing(Series.Episode::getEpisodeNumber))
                .collect(Collectors.toList());
    }

    /**
     * Merge seasons, ensuring existing seasons are not overwritten
     */
    private void mergeSeasons(List<Series.Season> existingSeasons, List<Series.Season> updatedSeasons) {
        Map<Integer, Series.Season> updatedMap = updatedSeasons.stream()
                .collect(Collectors.toMap(Series.Season::getSeasonNumber, s -> s, (s1, s2) -> s1));

        Iterator<Series.Season> iterator = existingSeasons.iterator();
        while (iterator.hasNext()) {
            Series.Season existingSeason = iterator.next();
            if (updatedMap.containsKey(existingSeason.getSeasonNumber())) {
                Series.Season updatedSeason = updatedMap.get(existingSeason.getSeasonNumber());

                if (updatedSeason.getEpisodes() != null) {
                    mergeEpisodes(existingSeason.getEpisodes(), updatedSeason.getEpisodes());
                }

                updatedMap.remove(existingSeason.getSeasonNumber());
            }
        }

        for (Series.Season newSeason : updatedMap.values()) {
            if (newSeason.getEpisodes() != null) {
                List<Series.Episode> validEpisodes = validateAndSortEpisodes(newSeason.getEpisodes());
                newSeason.setEpisodes(validEpisodes);
            } else {
                newSeason.setEpisodes(new ArrayList<>());
            }
            existingSeasons.add(newSeason);
        }

        existingSeasons.sort(Comparator.comparing(Series.Season::getSeasonNumber));
    }

    /**
     * Merge episodes, ensuring existing episodes are not overwritten
     */
    private void mergeEpisodes(List<Series.Episode> existingEpisodes, List<Series.Episode> updatedEpisodes) {
        List<Series.Episode> validUpdatedEpisodes = validateAndSortEpisodes(updatedEpisodes);

        Map<Integer, Series.Episode> existingEpisodesMap = existingEpisodes.stream()
                .filter(e -> e.getEpisodeNumber() > 0)
                .collect(Collectors.toMap(Series.Episode::getEpisodeNumber, e -> e, (e1, e2) -> e1));

        Map<Integer, Series.Episode> updatedEpisodesMap = validUpdatedEpisodes.stream()
                .collect(Collectors.toMap(Series.Episode::getEpisodeNumber, e -> e, (e1, e2) -> e2));

        updatedEpisodesMap.forEach(existingEpisodesMap::put);

        List<Series.Episode> mergedEpisodes = new ArrayList<>(existingEpisodesMap.values());
        mergedEpisodes.sort(Comparator.comparing(Series.Episode::getEpisodeNumber));

        existingEpisodes.clear();
        existingEpisodes.addAll(mergedEpisodes);
    }

    public Optional<DirectorResponseDTO> getDirectorOfSeries(String seriesId) {
        return seriesRepository.findById(seriesId)
                .map(series -> new DirectorResponseDTO(series.getDirector()));
    }

    public Optional<List<ActorResponseDTO>> getActorsOfSeries(String seriesId) {
        return seriesRepository.findById(seriesId)
                .map(series -> series.getActors().stream()
                        .map(ActorResponseDTO::new)
                        .collect(Collectors.toList()));
    }


    private Series buildSeriesFromDTO(String id, SeriesRequestDTO dto) {
        SeriesResponseDTO responseDTO = new SeriesResponseDTO(
                id,
                dto.getTitle(),
                dto.getDescription(),
                dto.getGenre(),
                0.0,
                0,
                dto.getReleaseDate(),
                dto.getPosterUrl(),
                dto.getSeasons(),
                dto.getCountry(),
                dto.getTrailerUrl()
        );

        return new Series(dto);
    }

}