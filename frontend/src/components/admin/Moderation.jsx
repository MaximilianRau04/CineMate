import React from "react";
import { FaTrash } from "react-icons/fa";
import { formatDate } from "./utils/utils";

const Moderation = ({ reviews, reviewUsers, onDeleteReview }) => (
  <div>
    <h4 className="mb-4">Moderation</h4>
    <div className="card">
      <div className="card-header">
        <h5>Bewertungen & Kommentare</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Benutzer</th>
                <th>Bewertung</th>
                <th>Kommentar</th>
                <th>Datum</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id}>
                  <td>{reviewUsers[review.id]?.username || "Lädt..."}</td>
                  <td>
                    <span className="badge bg-warning">
                      {review.rating}/5 ⭐
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {review.comment}
                    </div>
                  </td>
                  <td>{formatDate(review.date)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteReview(review.id)}
                    >
                      <FaTrash /> Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Moderation;