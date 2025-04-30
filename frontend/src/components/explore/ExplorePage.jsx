import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExplorePage = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedGenre, setSelectedGenre] = useState("alle");

  /**
   * generate genre list from loaded movies and series
   * use a Set to avoid duplicates and filter out empty values
   */
  const genres = [
    "alle",
    ...new Set(movies.map((m) => m.genre).filter(Boolean)),
  ];

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch("http://localhost:8080/api/movies").then((res) => res.json()),
      fetch("http://localhost:8080/api/series").then((res) => res.json()),
    ])
      .then(([moviesData, seriesData]) => {
        setMovies(moviesData);
        setSeries(seriesData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden:", err);
        setIsLoading(false);
      });
  }, []);

  /**
   * filter movies based on search term and selected genre
   * sort movies based on selected sort order
   */
  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((movie) =>
      selectedGenre === "alle" ? true : movie.genre === selectedGenre
    )
    .sort((a, b) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  /**
   * filter series based on search term and selected genre
   * sort series based on selected sort order
   */
  const filteredSeries = series
    .filter((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((s) =>
      selectedGenre === "alle" ? true : s.genre === selectedGenre
    )
    .sort(
      (a, b) =>
        new Date(sortOrder === "asc" ? a.releaseDate : b.releaseDate) -
        new Date(sortOrder === "asc" ? b.releaseDate : a.releaseDate)
    );

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Lade...</span>
        </div>
        <p className="mt-2">Filme werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 text-primary">
        🎬 Entdecke Filme und Serien
      </h1>

      {/* search and filter bar */}
      <div className="row mb-4 gy-2">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Titel suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map((genre, idx) => (
              <option key={idx} value={genre}>
                🎭 {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">📅 Nach Datum (aufsteigend)</option>
            <option value="desc">📅 Nach Datum (absteigend)</option>
          </select>
        </div>
      </div>
      {filteredMovies.length === 0 && filteredSeries.length === 0 && (
        <p className="text-center fst-italic text-white">
          Keine passenden Filme oder Serien gefunden.
        </p>
      )}

      {/* movies */}
      {filteredMovies.length > 0 && <h2 className="mt-5 mb-3 text-white">🎥 Filme</h2>}
      {filteredMovies.length === 0 ? (
        <div className="text-muted">Keine Filme gefunden.</div>
      ) : (
        <div className="row">
          {filteredMovies.map((movie) => (
            <div className="col-md-6 mb-4" key={movie.id}>
              <div className="card h-100 shadow-sm">
                <div className="row g-0">
                  <div className="col-auto">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      width="100"
                      height="150"
                      className="img-fluid rounded-start"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100x150?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="col">
                    <div className="card-body d-flex flex-column justify-content-between h-100">
                      <div>
                        <h5 className="card-title mb-1">{movie.title}</h5>
                        <p className="card-text mb-1">
                          <small className="text-muted">{movie.genre}</small>
                        </p>
                        <p className="card-text mb-1">
                          ⭐ <strong>{movie.rating.toFixed(1)}</strong>
                        </p>
                        <p className="card-text mb-1">
                          📅{" "}
                          {movie.releaseDate
                            ? new Date(movie.releaseDate).toLocaleDateString()
                            : "Unbekannt"}
                        </p>
                      </div>
                      <Link
                        to={`/movies/${movie.id}`}
                        className="btn btn-primary btn-sm mt-2 align-self-start"
                      >
                        Details ansehen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* series */}
      {filteredSeries.length > 0 && <h2 className="mt-5 mb-3 text-white">📺 Serien</h2>}
      {filteredSeries.length === 0 ? (
        <div className="text-muted">Keine Serien gefunden.</div>
      ) : (
        <div className="row">
          {filteredSeries.map((serie) => (
            <div className="col-md-6 mb-4" key={serie.id}>
              <div className="card h-100 shadow-sm">
                <div className="row g-0">
                  <div className="col-auto">
                    <img
                      src={serie.posterUrl}
                      alt={serie.title}
                      width="100"
                      height="150"
                      className="img-fluid rounded-start"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100x150?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="col">
                    <div className="card-body d-flex flex-column justify-content-between h-100">
                      <div>
                        <h5 className="card-title mb-1">{serie.title}</h5>
                        <p className="card-text mb-1">
                          <small className="text-muted">{serie.genre}</small>
                        </p>
                        <p className="card-text mb-1">
                          ⭐ <strong>{serie.rating.toFixed(1)}</strong>
                        </p>
                        <p className="card-text mb-1">
                          📅{" "}
                          {serie.releaseDate
                            ? new Date(serie.releaseDate).toLocaleDateString()
                            : "Unbekannt"}
                        </p>
                      </div>
                      <Link
                        to={`/series/${serie.id}`}
                        className="btn btn-primary btn-sm mt-2 align-self-start"
                      >
                        Details ansehen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
