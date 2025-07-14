import { FaTrash, FaEdit } from "react-icons/fa";
import { formatDate } from "../utils/utils";

const ContentTable = ({ items, type, onEdit, onDelete, onSeriesSeasons, onManageStreaming }) => (
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          <th>Titel</th>
          <th>Genre</th>
          <th>Land</th>
          <th>Erscheinungsdatum</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {items
          .filter(item => item && item.id)
          .map((item, index) => (
            <tr key={`${type}-${item.id}-${index}`}>
              <td>{item.title}</td>
              <td>{item.genre}</td>
              <td>{item.country || 'N/A'}</td>
              <td>{formatDate(item.releaseDate)}</td>
              <td>
                {type === "series" && (
                  <button
                    className="btn btn-sm btn-outline-info me-2"
                    onClick={() => onSeriesSeasons(item)}
                  >
                    Staffeln
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => onManageStreaming(item, type)}
                  title="Streaming-Verfügbarkeiten verwalten"
                >
                  <i className="bi bi-tv"></i>
                </button>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => onEdit(item, type)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(item.id, type)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

export default ContentTable;