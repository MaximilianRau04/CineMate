import React from "react";
import { DASHBOARD_CARDS } from "./adminConstants";

/**
 * Dashboard Komponente zur Anzeige von Zusammenfassungsstatistiken
 */
const AdminDashboard = ({ data }) => (
  <div className="row">
    {DASHBOARD_CARDS.map(({ title, dataKey, color, icon: Icon }, index) => (
      <div key={index} className="col-md-3 mb-4">
        <div className={`card bg-${color} text-white`}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4>{data[dataKey]?.length || 0}</h4>
                <p>{title}</p>
              </div>
              <Icon size={40} />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Tabellen-Komponente zur Anzeige von Content-Elementen (Filme oder Serien)
 */
const ContentTable = ({ items, type, onEdit, onDelete, onSeriesSeasons }) => (
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
                  className="btn btn-sm btn-outline-primary me-2"
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

/**
 * Modal-Komponente für die Anzeige von Formularen und Bestätigungsdialogen
 */
const Modal = ({ show, title, children, onClose, onSave, saveText = "Speichern" }) => {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Abbrechen
            </button>
            {onSave && (
              <button type="button" className="btn btn-primary" onClick={onSave}>
                {saveText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Import der Utility-Funktionen und Icons (normalerweise aus separaten Dateien)
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString('de-DE');
};

// Icons würden normalerweise importiert werden
import { FaEdit, FaTrash } from "react-icons/fa";

export { AdminDashboard, ContentTable, Modal };