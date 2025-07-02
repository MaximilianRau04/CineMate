import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecommendationsPage.css';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const genres = [
    'Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 
    'Science Fiction', 'Fantasy', 'Crime', 'Adventure', 'Animation'
  ];

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadPersonalRecommendations();
    }
    loadTrendingRecommendations();
  }, [userId]);

  /**
   * fetches the current user from the API
   */
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        setUserId(user.id);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Benutzers:', error);
    }
  };

  /**
   * fetches the personal recommendations for the current user
   * @returns personal recommendations 
   */
  const loadPersonalRecommendations = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/recommendations/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
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

  /**
   * fetches the trending recommendations
   * @returns trending recommendations
   */
  const loadTrendingRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/recommendations/trending');
      
      if (response.ok) {
        const data = await response.json();
        setTrending(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Trending-Empfehlungen:', error);
    }
  };

  /**
   * fetches the genre recommendations based on the selected genre
   * @param {*} genre 
   * @return {Promise<void>}
   */
  const loadGenreRecommendations = async (genre) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/recommendations/genre/${encodeURIComponent(genre)}`);
      
      if (response.ok) {
        const data = await response.json();
        setGenreRecommendations(data);
        setError(null);
      } else {
        setError('Fehler beim Laden der Genre-Empfehlungen');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Genre-Empfehlungen:', error);
      setError('Fehler beim Laden der Genre-Empfehlungen');
    } finally {
      setLoading(false);
    }
  };

  // Handle genre selection change
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    if (genre) {
      loadGenreRecommendations(genre);
    } else {
      setGenreRecommendations([]);
    }
  };

  const RecommendationCard = ({ recommendation }) => (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card recommendation-card h-100">
        <div className="recommendation-poster-container">
          <img
            src={recommendation.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={recommendation.title}
            className="card-img-top recommendation-poster"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
          <div className="recommendation-score">
            {recommendation.score.toFixed(1)}
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title recommendation-title">{recommendation.title}</h6>
          <p className="card-text recommendation-reason text-muted small">
            {recommendation.reason}
          </p>
          <div className="mt-auto">
            <Link
              to={`/${recommendation.type === 'movie' ? 'movies' : 'series'}/${recommendation.id}`}
              className="btn btn-primary btn-sm w-100"
            >
              Details ansehen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && activeTab === 'personal' && recommendations.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Empfehlungen werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="container py-4">
        <h1 className="mb-4 text-center">🎬 Empfehlungen für dich</h1>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <i className="bi bi-person-heart me-2"></i>
              Persönlich
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              <i className="bi bi-fire me-2"></i>
              Trending
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'genre' ? 'active' : ''}`}
              onClick={() => setActiveTab('genre')}
            >
              <i className="bi bi-tags me-2"></i>
              Nach Genre
            </button>
          </li>
        </ul>

        {error && (
          <div className="alert alert-warning mb-4" role="alert">
            {error}
          </div>
        )}

        {/* personal recommendations */}
        {activeTab === 'personal' && (
          <div className="tab-content">
            {!userId ? (
              <div className="alert alert-info text-center">
                <h5>Melde dich an für personalisierte Empfehlungen!</h5>
                <p>Sobald du Filme und Serien bewertest oder als Favoriten markierst, können wir dir passende Inhalte empfehlen.</p>
                <Link to="/login" className="btn btn-primary">Anmelden</Link>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="alert alert-light text-center">
                <h5>Noch keine Empfehlungen verfügbar</h5>
                <p>Markiere einige Filme oder Serien als Favoriten, um personalisierte Empfehlungen zu erhalten!</p>
                <Link to="/explore" className="btn btn-outline-primary">Inhalte entdecken</Link>
              </div>
            ) : (
              <>
                <h3 className="mb-3">Basierend auf deinen Vorlieben</h3>
                <div className="row">
                  {recommendations.map((recommendation) => (
                    <RecommendationCard
                      key={`${recommendation.type}-${recommendation.id}`}
                      recommendation={recommendation}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* trending recommendations */}
        {activeTab === 'trending' && (
          <div className="tab-content">
            <h3 className="mb-3">Was gerade angesagt ist</h3>
            <div className="row">
              {trending.map((recommendation) => (
                <RecommendationCard
                  key={`${recommendation.type}-${recommendation.id}`}
                  recommendation={recommendation}
                />
              ))}
            </div>
          </div>
        )}

        {/* genre recommendations */}
        {activeTab === 'genre' && (
          <div className="tab-content">
            <div className="mb-4">
              <h3 className="mb-3">Empfehlungen nach Genre</h3>
              <div className="row">
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={selectedGenre}
                    onChange={(e) => handleGenreChange(e.target.value)}
                  >
                    <option value="">Genre auswählen...</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {selectedGenre && (
              <>
                <h4 className="mb-3">Die besten {selectedGenre}-Titel</h4>
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : (
                  <div className="row">
                    {genreRecommendations.map((recommendation) => (
                      <RecommendationCard
                        key={`${recommendation.type}-${recommendation.id}`}
                        recommendation={recommendation}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
