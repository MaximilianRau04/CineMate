import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecommendationWidget.css';

const RecommendationWidget = ({ userId, type = 'personal', maxItems = 4, title = 'Empfehlungen für dich' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadRecommendations();
    }
  }, [userId, type]);

  /**
   * fetches recommendations based on the user ID and type.
   */
  const loadRecommendations = async () => {
    try {
      setLoading(true);
      let url = '';
      
      switch (type) {
        case 'smart':
          url = `http://localhost:8080/api/recommendations/user/${userId}/smart`;
          break;
        case 'trending':
          url = 'http://localhost:8080/api/recommendations/trending';
          break;
        case 'hybrid':
          url = `http://localhost:8080/api/recommendations/user/${userId}/hybrid`;
          break;
        default:
          url = `http://localhost:8080/api/recommendations/user/${userId}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.slice(0, maxItems));
        setError(null);
      } else {
        setError('Fehler beim Laden der Empfehlungen');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Empfehlungen:', error);
      setError('Fehler beim Laden der Empfehlungen');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendation-widget">
        <div className="recommendation-widget-header">
          <h5>{title}</h5>
        </div>
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm text-primary" role="status" />
          <p className="mt-2 mb-0 small">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <div className="recommendation-widget">
        <div className="recommendation-widget-header">
          <h5>{title}</h5>
        </div>
        <div className="text-center py-4">
          <p className="text-muted mb-2">Keine Empfehlungen verfügbar</p>
          <Link to="/explore" className="btn btn-outline-primary btn-sm">
            Inhalte entdecken
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-widget">
      <div className="recommendation-widget-header">
        <h5>{title}</h5>
        <Link to="/recommendations" className="btn btn-outline-primary btn-sm">
          Alle anzeigen
        </Link>
      </div>
      
      <div className="recommendation-widget-content">
        <div className="row g-3">
          {recommendations.map((rec) => (
            <div key={`${rec.type}-${rec.id}`} className="col-6 col-lg-3">
              <Link 
                to={`/${rec.type === 'movie' ? 'movies' : 'series'}/${rec.id}`}
                className="recommendation-widget-item"
              >
                <div className="recommendation-widget-poster">
                  <img
                    src={rec.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={rec.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                    }}
                  />
                  <div className="recommendation-widget-overlay">
                    <div className="recommendation-widget-score">
                      {rec.score.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="recommendation-widget-info">
                  <h6 className="recommendation-widget-title">{rec.title}</h6>
                  <p className="recommendation-widget-reason">{rec.reason}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationWidget;
