
const ReviewSection = ({ reviews, renderStars, reviewUsers }) => {
    
    const getUserName = (reviewId) => {
        const user = reviewUsers[reviewId];
        if (user) {
            return user.name || user.username || user.displayName || `Benutzer ${reviewId}`;
        }
        return "Lädt...";
    };

    if (reviews && reviews.length > 0) {
        return (
            <div className="card mt-4 shadow-sm">
                <div className="card-header bg-light">
                    <h4 className="mb-0">📢 Nutzerbewertungen ({reviews.length})</h4>
                </div>
                <div className="card-body">
                    {reviews.map((review) => (
                        <div key={review.id} className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>
                                    {getUserName(review.id)}
                                </strong>
                                <span className="text-muted" style={{ fontSize: "0.9em" }}>
                                    {review.date
                                        ? new Date(review.date).toLocaleDateString("de-DE", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : review.createdAt
                                            ? new Date(review.createdAt).toLocaleDateString("de-DE", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : "Unbekanntes Datum"}
                                </span>
                            </div>
                            <div className="mb-2">
                                <div className="d-flex align-items-center">
                                    {renderStars(review.rating)}
                                    <span className="ms-2">({review.rating}/5)</span>
                                </div>
                            </div>
                            {review.comment && <p className="mb-0">{review.comment}</p>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card mt-4 shadow-sm">
            <div className="card-body text-center py-4">
                <p className="text-muted mb-0">
                    Noch keine Bewertungen vorhanden... 
                </p>
            </div>
        </div>
    );
};

export default ReviewSection;