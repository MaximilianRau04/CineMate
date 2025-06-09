import React from "react";
import { FaUnlink, FaEdit } from "react-icons/fa";

const Filmography = ({ 
  person, 
  personType, 
  filmography, 
  isLoading, 
  onRemove,
  onChangeDirector 
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const isDirector = personType === 'director';

  return (
    <>
      <h5 className="mb-3">Filme</h5>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Genre</th>
              <th>Erscheinungsjahr</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filmography.movies.map(movie => (
              <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.genre}</td>
                <td>{new Date(parseInt(movie.releaseDate)).getFullYear()}</td>
                <td>
                  {isDirector ? (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onChangeDirector(movie)}
                      title="Regisseur ändern"
                    >
                      <FaEdit /> Ändern
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onRemove(movie.id, person.id, 'movie')}
                      title="Entfernen"
                    >
                      <FaUnlink /> Entfernen
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filmography.movies.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Keine Filme gefunden</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h5 className="mt-4 mb-3">Serien</h5>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Genre</th>
              <th>Erscheinungsjahr</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filmography.series.map(serie => (
              <tr key={serie.id}>
                <td>{serie.title}</td>
                <td>{serie.genre}</td>
                <td>{new Date(parseInt(serie.releaseDate)).getFullYear()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onRemove(serie.id, person.id, 'series')}
                    title="Entfernen"
                  >
                    <FaUnlink /> Entfernen
                  </button>
                </td>
              </tr>
            ))}
            {filmography.series.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Keine Serien gefunden</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Filmography;