import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useToast } from '../toasts/ToastContext';
import '../../assets/statistics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserStatistics = ({ userId }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('year'); 
  const [compareMode, setCompareMode] = useState(false);
  const [friendsStats, setFriendsStats] = useState([]);
  const { error: showError } = useToast();

  /**
   * Fetches user statistics from the backend.
   * @returns {Promise<void>} A promise that resolves when the statistics are fetched.
   */
  const fetchUserStatistics = async () => {
    setLoading(true);
    try {
      const getHeaders = (extra = {}) => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}`, ...extra } : extra;
      };
      const response = await fetch(`http://localhost:8080/api/statistics/users/${userId}?period=${selectedPeriod}`, {
        headers: getHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      } else {
        throw new Error('Fehler beim Laden der Statistiken');
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.message);
      showError('Fehler beim Laden der Statistiken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserStatistics();
    }
  }, [userId, selectedPeriod]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Fetches friends' statistics for comparison.
   * @returns {Promise<void>} A promise that resolves when the friends' statistics are fetched
   */
  const fetchFriendsComparison = async () => {
    try {
      const getHeaders = (extra = {}) => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}`, ...extra } : extra;
      };

      const response = await fetch(`http://localhost:8080/api/statistics/users/${userId}/friends-comparison`, {
        headers: getHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setFriendsStats(data);
      } else if (response.status === 404) {
        console.warn('Friends comparison endpoint not found');
        showError('Freunde-Vergleich ist momentan nicht verfügbar');
        setFriendsStats([]);
      } else {
        console.error('Error response:', response.status, response.statusText);
        showError('Fehler beim Laden der Freunde-Statistiken');
        setFriendsStats([]);
      }
    } catch (err) {
      console.error('Error fetching friends stats:', err);
      showError('Fehler beim Laden der Freunde-Statistiken');
      setFriendsStats([]);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Statistiken werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchUserStatistics}>
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // Chart data configurations
  const watchTimeData = {
    labels: statistics?.monthlyActivity?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Stunden geschaut',
        data: statistics?.monthlyActivity?.map(item => item.hours) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  // Top genres and actors data
  const genreData = {
    labels: statistics?.topGenres?.map(genre => genre.name) || [],
    datasets: [
      {
        data: statistics?.topGenres?.map(genre => genre.count) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ]
      }
    ]
  };

  // Favorite actors data
  const actorData = {
    labels: statistics?.favoriteActors?.map(actor => actor.name) || [],
    datasets: [
      {
        label: 'Anzahl Filme/Serien',
        data: statistics?.favoriteActors?.map(actor => actor.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  // Favorite directors data
  const directorData = {
    labels: statistics?.favoriteDirectors?.map(director => director.name) || [],
    datasets: [
      {
        label: 'Anzahl Filme/Serien',
        data: statistics?.favoriteDirectors?.map(director => director.count) || [],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Chart options for bar charts with integer steps
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="mb-3">
            <i className="bi bi-graph-up me-2"></i>
            Meine Statistiken
          </h1>
        </div>
        <div className="col-md-4">
          <div className="d-flex gap-2">
            <select 
              className="form-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="month">Letzter Monat</option>
              <option value="year">Letztes Jahr</option>
              <option value="all">Insgesamt</option>
            </select>
            <button 
              className={`btn ${compareMode ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => {
                setCompareMode(!compareMode);
                if (!compareMode) fetchFriendsComparison();
              }}
            >
              <i className="bi bi-people me-1"></i>
              Vergleichen
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="bi bi-clock display-4 mb-2"></i>
              <h3>{statistics?.totalHoursWatched || 0}</h3>
              <p className="mb-0">Stunden geschaut</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="bi bi-film display-4 mb-2"></i>
              <h3>{statistics?.totalMoviesWatched || 0}</h3>
              <p className="mb-0">Filme gesehen</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="bi bi-tv display-4 mb-2"></i>
              <h3>{statistics?.totalSeriesWatched || 0}</h3>
              <p className="mb-0">Serien gesehen</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body text-center">
              <i className="bi bi-star display-4 mb-2"></i>
              <h3>{statistics?.averageRating?.toFixed(1) || 'N/A'}</h3>
              <p className="mb-0">Ø Bewertung</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Aktivität über Zeit
              </h5>
            </div>
            <div className="card-body" style={{ height: '400px' }}>
              <Line data={watchTimeData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                Top Genres
              </h5>
            </div>
            <div className="card-body" style={{ height: '400px' }}>
              <Doughnut data={genreData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-person me-2"></i>
                Lieblings-Schauspieler
              </h5>
            </div>
            <div className="card-body" style={{ height: '400px' }}>
              <Bar data={actorData} options={barChartOptions} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-camera-reels me-2"></i>
                Lieblings-Regisseure
              </h5>
            </div>
            <div className="card-body" style={{ height: '400px' }}>
              <Bar data={directorData} options={barChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Friends Comparison */}
      {compareMode && friendsStats.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  Vergleich mit Freunden
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Benutzer</th>
                        <th>Stunden geschaut</th>
                        <th>Filme gesehen</th>
                        <th>Serien gesehen</th>
                        <th>Ø Bewertung</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="table-primary">
                        <td><strong>Du</strong></td>
                        <td>{statistics?.totalHoursWatched || 0}</td>
                        <td>{statistics?.totalMoviesWatched || 0}</td>
                        <td>{statistics?.totalSeriesWatched || 0}</td>
                        <td>{statistics?.averageRating?.toFixed(1) || 'N/A'}</td>
                      </tr>
                      {friendsStats.map(friend => (
                        <tr key={friend.userId}>
                          <td>{friend.username}</td>
                          <td>{friend.totalHoursWatched || 0}</td>
                          <td>{friend.totalMoviesWatched || 0}</td>
                          <td>{friend.totalSeriesWatched || 0}</td>
                          <td>{friend.averageRating?.toFixed(1) || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Letzte Aktivitäten
              </h5>
            </div>
            <div className="card-body">
              {statistics?.recentActivity?.length > 0 ? (
                <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {statistics.recentActivity.map((activity, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">
                            {activity.type === 'movie' ? '🎬' : '📺'} {activity.title}
                          </h6>
                          <p className="mb-1 text-muted">{activity.action}</p>
                        </div>
                        <small className="text-muted">
                          {(() => {
                            try {
                              let date;
                              
                              // Handle date formats
                              if (Array.isArray(activity.date)) {
                                const [year, month, day, hour, minute, second] = activity.date;
                                date = new Date(year, month - 1, day, hour, minute, second);
                              } else if (typeof activity.date === 'number') {
                                date = new Date(activity.date);
                              } else {
                                date = new Date(activity.date);
                              }
                              
                              if (isNaN(date.getTime())) {
                                console.error('Invalid date:', activity.date);
                                return 'Datum nicht verfügbar';
                              }
                              
                              // Format the date to german locale
                              return date.toLocaleDateString('de-DE', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (error) {
                              console.error('Date parsing error:', error, activity.date);
                              return 'Datum nicht verfügbar';
                            }
                          })()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted">
                  Keine aktuellen Aktivitäten vorhanden.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
