import React from 'react';

const ExistingRatingSection = ({
  reviewed,
  rating,
  comment,
  renderStars,
  onEdit,
  onDelete
}) => {
  if (!reviewed) return null;

  return (
    <div className="alert alert-info mt-4">
      <h5>⭐ Deine bisherige Bewertung</h5>
      <p>
        Bewertung: {renderStars(rating)} ({rating}/5)
        {comment && (
          <>
            <br />
            Kommentar: {comment}
          </>
        )}
      </p>
      <div className="d-flex gap-2 mt-3">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={onEdit}
        >
          ✏️ Bearbeiten
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={onDelete}
        >
          ❌ Löschen
        </button>
      </div>
    </div>
  );
};

export default ExistingRatingSection;
