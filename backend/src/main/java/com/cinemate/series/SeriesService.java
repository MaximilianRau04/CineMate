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

    /**
     * returns all series
     * @return List<SeriesResponseDTO>
     */
    public ResponseEntity<List<SeriesResponseDTO>> getAllSeries() {
        List<Series> seriesList = seriesRepository.findAll();
        List<SeriesResponseDTO> seriesDTOs = seriesList.stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(seriesDTOs);
    }

    /**
     * returns the series with the given id
     * @param id
     * @return SeriesResponseDTO
     */
    public Optional<SeriesResponseDTO> getSeriesById(String id) {
        return seriesRepository.findById(id)
                .map(SeriesResponseDTO::new);
    }

    /**
     * creates a series
     * @param seriesDTO
     * @return SeriesResponseDTO
     */
    public ResponseEntity<SeriesResponseDTO> createSeries(SeriesRequestDTO seriesDTO) {
        Series series = buildSeriesFromDTO(null, seriesDTO);
        Series savedSeries = seriesRepository.save(series);
        return ResponseEntity.ok(new SeriesResponseDTO(savedSeries));
    }

    /**
     * updates the series with the given id
     * @param id
     * @param seriesDTO
     * @return SeriesResponseDTO
     */
    public ResponseEntity<SeriesResponseDTO> updateSeries(String id, SeriesRequestDTO seriesDTO) {
        Optional<Series> optionalSeries = seriesRepository.findById(id);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series existingSeries = optionalSeries.get();

        updateSeriesFields(existingSeries, seriesDTO);

        Series savedSeries = seriesRepository.save(existingSeries);
        return ResponseEntity.ok(new SeriesResponseDTO(savedSeries));
    }

    /**
     * updates the series fields for put request
     * @param series
     * @param seriesDTO
     */
    private void updateSeriesFields(Series series, SeriesRequestDTO seriesDTO) {
        if (seriesDTO.getTitle() != null) series.setTitle(seriesDTO.getTitle());
        if (seriesDTO.getDescription() != null) series.setDescription(seriesDTO.getDescription());
        if (seriesDTO.getReleaseDate() != null) series.setReleaseDate(seriesDTO.getReleaseDate());
        if (seriesDTO.getGenre() != null) series.setGenre(seriesDTO.getGenre());
        if (seriesDTO.getPosterUrl() != null) series.setPosterUrl(seriesDTO.getPosterUrl());
        if (seriesDTO.getCountry() != null) series.setCountry(seriesDTO.getCountry());
        if (seriesDTO.getTrailerUrl() != null) series.setTrailerUrl(seriesDTO.getTrailerUrl());

        if (seriesDTO.getDirectorIds() != null && !seriesDTO.getDirectorIds().isEmpty()) {
            List<Director> directors = new ArrayList<>();
            for (String directorId : seriesDTO.getDirectorIds()) {
                directorRepository.findById(directorId).ifPresent(directors::add);
            }
            series.setDirectors(directors);
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

    /**
     * deletes the series with the given id
     * @param id
     */
    public void deleteSeries(String id) {
        seriesRepository.deleteById(id);
    }

    /**
     * Get all seasons of a series
     * @param seriesId
     * @return List<Series.Season>
     */
    public ResponseEntity<List<Series.Season>> getSeasons(String seriesId) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);

        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        List<Series.Season> seasons = series.getSeasons();

        if (seasons == null) {
            return ResponseEntity.ok(new ArrayList<>());
        } else {
            List<Series.Season> validSeasons = seasons.stream()
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(validSeasons);
        }
    }

    /**
     * Get a specific season from a series
     * @param seriesId
     * @param seasonNumber
     */
    public ResponseEntity<Series.Season> getSeason(String seriesId, int seasonNumber) {
        return findAndProcessEntity(seriesId, series ->
                findSeasonByNumber(series, seasonNumber).orElse(null));
    }

    /**
     * Add a new season to a series
     * @param seriesId
     * @param newSeason
     * @return the added season
     */
    public ResponseEntity<Series.Season> addSeason(String seriesId, Series.Season newSeason) {
        if (newSeason.getSeasonNumber() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();

        if (series.getSeasons() == null) {
            series.setSeasons(new ArrayList<>());
        }

        boolean seasonExists = series.getSeasons().stream()
                .filter(Objects::nonNull)
                .anyMatch(s -> s.getSeasonNumber() == newSeason.getSeasonNumber());

        if (seasonExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if (newSeason.getEpisodes() != null) {
            List<Series.Episode> validEpisodes = validateAndSortEpisodes(newSeason.getEpisodes());
            newSeason.setEpisodes(validEpisodes);
        } else {
            newSeason.setEpisodes(new ArrayList<>());
        }

        series.getSeasons().add(newSeason);

        series.setSeasons(series.getSeasons().stream()
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(Series.Season::getSeasonNumber))
                .collect(Collectors.toList()));

        Series savedSeries = seriesRepository.save(series);

        Optional<Series.Season> addedSeason = findSeasonByNumber(savedSeries, newSeason.getSeasonNumber());

        return addedSeason
                .map(season -> ResponseEntity.status(HttpStatus.CREATED).body(season))
                .orElse(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }

    /**
     * updates the season with the given number of the series
     * @param seriesId
     * @param seasonNumber
     * @param updatedSeason
     * @return the updated season
     */
    public ResponseEntity<Series.Season> updateSeason(String seriesId, int seasonNumber, Series.Season updatedSeason) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Optional<Series.Season> existingSeason = findSeasonByNumber(series, seasonNumber);

        if (existingSeason.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Season season = existingSeason.get();
        if (updatedSeason.getTrailerUrl() != null) season.setTrailerUrl(updatedSeason.getTrailerUrl());
        if (updatedSeason.getSeasonNumber() != -1) season.setSeasonNumber(updatedSeason.getSeasonNumber());

        if (updatedSeason.getEpisodes() != null) {
            mergeEpisodes(season.getEpisodes(), updatedSeason.getEpisodes());
        }

        Series savedSeries = seriesRepository.save(series);

        Optional<Series.Season> savedSeason = findSeasonByNumber(
                savedSeries,
                updatedSeason.getSeasonNumber() != -1 ? updatedSeason.getSeasonNumber() : seasonNumber
        );

        return savedSeason
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }

    /**
     * deletes the season with the given number of the series
     * @param seriesId
     * @param seasonNumber
     */
    public ResponseEntity<Void> deleteSeason(String seriesId, int seasonNumber) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        boolean removed = series.getSeasons().removeIf(s -> s.getSeasonNumber() == seasonNumber);

        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        seriesRepository.save(series);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all episodes of a specific season
     * @param seasonNumber
     * @param seriesId
     * @return List<Series.Episode>
     */
    public ResponseEntity<List<Series.Episode>> getEpisodes(String seriesId, int seasonNumber) {
        return findAndProcessEntity(seriesId, series -> {
            Optional<Series.Season> season = findSeasonByNumber(series, seasonNumber);
            return season.map(Series.Season::getEpisodes).orElse(null);
        });
    }

    /**
     * Get a specific episode from a season
     * @param seriesId
     * @param seasonNumber
     * @param episodeNumber
     * @return Series.Episode
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
     * @param seriesId
     * @param seasonNumber
     * @param newEpisode
     * @return the added episode
     */
    public ResponseEntity<Series.Episode> addEpisode(String seriesId, int seasonNumber, Series.Episode newEpisode) {
        if (newEpisode.getTitle() == null || newEpisode.getReleaseDate() == null || newEpisode.getEpisodeNumber() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Optional<Series.Season> optionalSeason = findSeasonByNumber(series, seasonNumber);

        if (optionalSeason.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Season season = optionalSeason.get();

        boolean episodeExists = season.getEpisodes().stream()
                .anyMatch(e -> e.getEpisodeNumber() == newEpisode.getEpisodeNumber());

        if (episodeExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        season.getEpisodes().add(newEpisode);
        season.getEpisodes().sort(Comparator.comparing(Series.Episode::getEpisodeNumber));

        Series savedSeries = seriesRepository.save(series);
        Optional<Series.Season> savedSeason = findSeasonByNumber(savedSeries, seasonNumber);

        if (savedSeason.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        Optional<Series.Episode> addedEpisode = findEpisodeByNumber(savedSeason.get(), newEpisode.getEpisodeNumber());

        return addedEpisode
                .map(episode -> ResponseEntity.status(HttpStatus.CREATED).body(episode))
                .orElse(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }

    /**
     * Add a new episode to a season
     * @param seriesId
     * @param seasonNumber
     * @param episodeNumber
     * @param updatedEpisode
     * @return the updated episode
     */
    public ResponseEntity<Series.Episode> updateEpisode(String seriesId, int seasonNumber, int episodeNumber, Series.Episode updatedEpisode) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Optional<Series.Season> optionalSeason = findSeasonByNumber(series, seasonNumber);

        if (optionalSeason.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Season season = optionalSeason.get();

        Optional<Series.Episode> optionalEpisode = findEpisodeByNumber(season, episodeNumber);

        if (optionalEpisode.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Episode episode = optionalEpisode.get();
        updateEpisodeFields(episode, updatedEpisode);

        Series savedSeries = seriesRepository.save(series);
        Optional<Series.Season> savedSeason = findSeasonByNumber(savedSeries, seasonNumber);

        if (savedSeason.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        Optional<Series.Episode> savedEpisode = findEpisodeByNumber(savedSeason.get(), episodeNumber);

        return savedEpisode
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
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
     * Deletes an episode from a season of the series
     * @param seriesId
     * @param seasonNumber
     * @param episodeNumber
     */
    public ResponseEntity<Void> deleteEpisode(String seriesId, int seasonNumber, int episodeNumber) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        if (optionalSeries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Optional<Series.Season> optionalSeason = findSeasonByNumber(series, seasonNumber);

        if (optionalSeason.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series.Season season = optionalSeason.get();
        boolean removed = season.getEpisodes().removeIf(e -> e.getEpisodeNumber() == episodeNumber);

        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        seriesRepository.save(series);
        return ResponseEntity.noContent().build();
    }

    /**
     * Find a series and apply a processing function to it
     * @param seriesId
     * @param <T>
     * @param processor
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
     * Find a season by its number in a series
     * @param seasonNumber
     * @param series
     * @return Series.Season
     */
    private Optional<Series.Season> findSeasonByNumber(Series series, int seasonNumber) {
        if (series.getSeasons() == null) {
            return Optional.empty();
        }

        return series.getSeasons().stream()
                .filter(Objects::nonNull)
                .filter(s -> s.getSeasonNumber() == seasonNumber)
                .findFirst();
    }

    /**
     * Find an episode by its number in a season
     * @param episodeNumber
     * @param season
     * @return Series.Episode
     */
    private Optional<Series.Episode> findEpisodeByNumber(Series.Season season, int episodeNumber) {
        return season.getEpisodes().stream()
                .filter(e -> e.getEpisodeNumber() == episodeNumber)
                .findFirst();
    }

    /**
     * Validate and sort episodes
     * @param episodes
     * @return Series.Episode
     */
    private List<Series.Episode> validateAndSortEpisodes(List<Series.Episode> episodes) {
        return episodes.stream()
                .filter(e -> e.getTitle() != null && e.getReleaseDate() != null && e.getEpisodeNumber() > 0)
                .sorted(Comparator.comparing(Series.Episode::getEpisodeNumber))
                .collect(Collectors.toList());
    }

    /**
     * Merge seasons, ensuring existing seasons are not overwritten
     * @param existingSeasons
     * @param updatedSeasons
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
     * @param existingEpisodes
     * @param updatedEpisodes
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

    /**
     * returns the directors of the series
     * @param seriesId
     * @return List<DirectorResponseDTO>
     */
    public Optional<List<DirectorResponseDTO>> getDirectorOfSeries(String seriesId) {
        return seriesRepository.findById(seriesId)
                .map(series -> {
                    List<Director> directors = series.getDirectors();
                    if (directors == null) {
                        return Collections.<DirectorResponseDTO>emptyList();
                    }
                    return directors.stream()
                            .filter(Objects::nonNull)
                            .map(DirectorResponseDTO::new)
                            .collect(Collectors.toList());
                });
    }

    /**
     * returns the actors of the series
     * @param seriesId
     * @return List<ActorResponseDTO>
     */
    public Optional<List<ActorResponseDTO>> getActorsOfSeries(String seriesId) {
        return seriesRepository.findById(seriesId)
                .map(series -> {
                    List<Actor> actors = series.getActors();
                    if (actors == null) {
                        return Collections.<ActorResponseDTO>emptyList();
                    }
                    return actors.stream()
                            .filter(Objects::nonNull)
                            .map(ActorResponseDTO::new)
                            .collect(Collectors.toList());
                });
    }

    /**
     * adds the actor to the series
     * @param seriesId
     * @param actorId
     * @return
     */
    public ResponseEntity<ActorResponseDTO> addActorToSeries(String seriesId, String actorId) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        Optional<Actor> optionalActor = actorRepository.findById(actorId);

        if (optionalSeries.isEmpty() || optionalActor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Actor actor = optionalActor.get();

        if (series.getActors() == null) {
            series.setActors(new ArrayList<>());
        }

        if (!series.getActors().contains(actor)) {
            series.getActors().add(actor);

            if (actor.getSeries() == null) {
                actor.setSeries(new ArrayList<>());
            }

            if (!actor.getSeries().contains(series)) {
                actor.getSeries().add(series);
            }

            actorRepository.save(actor);
            seriesRepository.save(series);
        }

        ActorResponseDTO addedActor = new ActorResponseDTO(actor);
        return ResponseEntity.ok(addedActor);
    }

    /**
     * Removes an actor from a series
     * @param seriesId
     * @param actorId
     */
    public ResponseEntity<Map<String, Object>> removeActorFromSeries(String seriesId, String actorId) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        Optional<Actor> optionalActor = actorRepository.findById(actorId);

        if (optionalSeries.isEmpty() || optionalActor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Actor actor = optionalActor.get();

        boolean removed = false;
        if (series.getActors() != null) {
            removed = series.getActors().removeIf(a -> a.getId().equals(actorId));

            if (removed && actor.getSeries() != null) {
                actor.getSeries().removeIf(m -> m.getId().equals(series.getId()));
                actorRepository.save(actor);
            }

            seriesRepository.save(series);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", removed);
        response.put("message", removed ?
                "Schauspieler erfolgreich von der Serie entfernt" :
                "Schauspieler war nicht mit dieser Serie verknüpft");

        return ResponseEntity.ok(response);
    }

    /**
     * Sets a director to a series
     * @param seriesId
     * @param directorId
     * @return the added director
     */
    public ResponseEntity<DirectorResponseDTO> addDirectorToSeries(String seriesId, String directorId) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        Optional<Director> optionalDirector = directorRepository.findById(directorId);

        if (optionalSeries.isEmpty() || optionalDirector.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Director director = optionalDirector.get();

        if (series.getDirectors() == null) {
            series.setDirectors(new ArrayList<>());
        }

        if (!series.getDirectors().contains(director)) {
            series.getDirectors().add(director);

            if (director.getSeries() == null) {
                director.setSeries(new ArrayList<>());
            }

            if (!director.getSeries().contains(series)) {
                director.getSeries().add(series);
            }

            directorRepository.save(director);
            seriesRepository.save(series);
        }

        DirectorResponseDTO addedDirector = new DirectorResponseDTO(director);
        return ResponseEntity.ok(addedDirector);
    }

    /**
     * Removes the director from a series
     * @param seriesId
     * @param directorId
     */
    public ResponseEntity<Map<String, Object>> removeDirectorFromSeries(String seriesId, String directorId) {
        Optional<Series> optionalSeries = seriesRepository.findById(seriesId);
        Optional<Director> optionalDirector = directorRepository.findById(directorId);

        if (optionalSeries.isEmpty() || optionalDirector.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Series series = optionalSeries.get();
        Director director = optionalDirector.get();

        boolean removed = false;
        if (series.getDirectors() != null) {
            removed = series.getDirectors().removeIf(a -> a.getId().equals(directorId));

            if (removed && director.getSeries() != null) {
                director.getSeries().removeIf(m -> m.getId().equals(series.getId()));
                directorRepository.save(director);
            }

            seriesRepository.save(series);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", removed);
        response.put("message", removed ?
                "Regisseur erfolgreich von der Serie entfernt" :
                "Regisseur war nicht mit dieser Serie verknüpft");

        return ResponseEntity.ok(response);
    }

    /**
     * convert SeriesResponseDTO to Series object
     * @param id
     * @param dto
     * @return
     */
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
                dto.getCountry(),
                dto.getTrailerUrl()
        );

        return new Series(dto);
    }
}