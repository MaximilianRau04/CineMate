package com.cinemate.director;

import com.cinemate.director.DTOs.DirectorRequestDTO;
import com.cinemate.director.DTOs.DirectorResponseDTO;
import com.cinemate.movie.DTOs.MovieResponseDTO;
import com.cinemate.movie.MovieRepository;
import com.cinemate.series.DTOs.SeriesResponseDTO;
import com.cinemate.series.SeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DirectorService {
    private final DirectorRepository directorRepository;
    private final MovieRepository movieRepository;
    private final SeriesRepository seriesRepository;

    @Autowired
    public DirectorService(DirectorRepository directorRepository, MovieRepository movieRepository, SeriesRepository seriesRepository) {
        this.directorRepository = directorRepository;
        this.movieRepository = movieRepository;
        this.seriesRepository = seriesRepository;
    }

    public List<DirectorResponseDTO> getAllDirectors() {
        return directorRepository.findAll().stream()
                .map(DirectorResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<DirectorResponseDTO> getDirectorById(String id) {
        return directorRepository.findById(id).map(DirectorResponseDTO::new);
    }

    public DirectorResponseDTO createDirector(DirectorRequestDTO dto) {
        Director director = new Director();
        director.setName(dto.getName());
        director.setBirthday(dto.getBirthday());
        director.setBiography(dto.getBiography());
        director.setImage(dto.getImage());

        return new DirectorResponseDTO(directorRepository.save(director));
    }

    public Optional<DirectorResponseDTO> updateDirector(String id, DirectorRequestDTO dto) {
        return directorRepository.findById(id).map(existing -> {
            if (dto.getName() != null) existing.setName(dto.getName());
            if (dto.getBirthday() != null) existing.setBirthday(dto.getBirthday());
            if (dto.getBiography() != null) existing.setBiography(dto.getBiography());
            if (dto.getImage() != null) existing.setImage(dto.getImage());
            return new DirectorResponseDTO(directorRepository.save(existing));
        });
    }

    public void deleteDirector(String id) {
        directorRepository.deleteById(id);
    }

    public List<MovieResponseDTO> getMoviesByDirector(String directorId) {
        return movieRepository.findByDirectorId(directorId).stream()
                .map(MovieResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<SeriesResponseDTO> getSeriesByDirector(String directorId) {
        return seriesRepository.findByDirectorId(directorId).stream()
                .map(SeriesResponseDTO::new)
                .collect(Collectors.toList());
    }
}
