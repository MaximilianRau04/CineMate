import { FaEdit, FaTrash, FaLink, FaFilm } from "react-icons/fa";
import { formatDate } from "../utils/utils";

const PersonList = ({ 
  people,  
  personType, 
  onShowFilmography, 
  onAssign, 
  onEdit, 
  onDelete 
}) => {
  const labels = {
    actor: {
      title: "Schauspieler",
      filmography: "Filmografie anzeigen",
      assign: "Zu Film/Serie hinzufügen"
    },
    director: {
      title: "Regisseur",
      filmography: "Filmografie anzeigen",
      assign: "Als Regisseur zuweisen"
    }
  };

  const label = labels[personType] || labels.actor;

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th width="60px">Bild</th>
                <th>Name</th>
                <th>Geburtsdatum</th>
                <th>Biografie</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {people.map(person => (
                <tr key={person.id}>
                  <td>
                    {person.image && (
                      <img
                        src={person.image}
                        alt={person.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        className="rounded"
                      />
                    )}
                  </td>
                  <td>{person.name}</td>
                  <td>{formatDate(person.birthday)}</td>
                  <td>
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {person.biography}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => onShowFilmography(person)}
                      title={label.filmography}
                    >
                      <FaFilm />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info me-1"
                      onClick={() => onAssign(person)}
                      title={label.assign}
                    >
                      <FaLink />
                    </button>
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => onEdit(person)}
                      title="Bearbeiten"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(person.id)}
                      title="Löschen"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {people.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">Keine {label.title} gefunden</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonList;