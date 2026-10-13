import { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
} from "chart.js";
import { useToast } from "../toasts/ToastContext";
import "./UserStatistics.css";
import { LoadingSpinner } from "../explore/FilterPanel";
import api from "../../utils/api";
import { useTranslation } from "../../i18n/I18nContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

ChartJS.defaults.color = "#b3a197";
ChartJS.defaults.borderColor = "rgba(243, 233, 218, 0.08)";
ChartJS.defaults.font.family = '"Instrument Sans", system-ui, sans-serif';

const PALETTE = [
  "#e3a948",
  "#e0525f",
  "#6cc3a2",
  "#85aee0",
  "#e88a5a",
  "#b9a7c9",
  "#d8c39a",
  "#7a6660",
];

const UserStatistics = ({ userId }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [compareMode, setCompareMode] = useState(false);
  const [friendsStats, setFriendsStats] = useState([]);
  const { error: showError } = useToast();
  const { t, locale, formatDateTime } = useTranslation();

  /**
   * Fetches user statistics from the backend.
   * @returns {Promise<void>} A promise that resolves when the statistics are fetched.
   */
  const fetchUserStatistics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/statistics/users/${userId}?period=${selectedPeriod}`,
      );
      setStatistics(data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError(err.message);
      showError(t("statistics.loadError"));
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
      const { data } = await api.get(
        `/statistics/users/${userId}/friends-comparison`,
      );
      setFriendsStats(data);
    } catch (err) {
      if (err.response?.status === 404) {
        showError(t("statistics.compareUnavailable"));
      } else {
        console.error("Error fetching friends stats:", err);
        showError(t("statistics.compareError"));
      }
      setFriendsStats([]);
    }
  };

  if (loading) {
    return <LoadingSpinner message={t("statistics.loading")} />;
  }

  if (error) {
    return (
      <div className="container cm-page">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">{t("statistics.loadError")}</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={fetchUserStatistics}
          >
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  const formatMonth = (value) => {
    const match = /^(\d{4})-(\d{2})$/.exec(value || "");
    if (!match) return value;
    return new Date(+match[1], +match[2] - 1, 1).toLocaleDateString(locale, {
      month: "short",
      year: "2-digit",
    });
  };

  const formatAction = (action) => {
    const match = /\(([\d.,]+) Sterne\)/.exec(action || "");
    if (match) return t("statistics.ratedAction", { rating: match[1] });
    return action;
  };

  const parseActivityDate = (value) => {
    if (Array.isArray(value)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = value;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    return new Date(value);
  };

  // Chart data configurations
  const watchTimeData = {
    labels:
      statistics?.monthlyActivity?.map((item) => formatMonth(item.month)) || [],
    datasets: [
      {
        label: t("statistics.hoursWatched"),
        data: statistics?.monthlyActivity?.map((item) => item.hours) || [],
        borderColor: PALETTE[0],
        backgroundColor: "rgba(227, 169, 72, 0.15)",
        pointBackgroundColor: PALETTE[0],
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const genreData = {
    labels: statistics?.topGenres?.map((genre) => genre.name) || [],
    datasets: [
      {
        data: statistics?.topGenres?.map((genre) => genre.count) || [],
        backgroundColor: PALETTE,
        borderColor: "#21151a",
        borderWidth: 3,
      },
    ],
  };

  const actorData = {
    labels: statistics?.favoriteActors?.map((actor) => actor.name) || [],
    datasets: [
      {
        label: t("statistics.titleCount"),
        data: statistics?.favoriteActors?.map((actor) => actor.count) || [],
        backgroundColor: PALETTE[2],
        borderRadius: 6,
      },
    ],
  };

  const directorData = {
    labels:
      statistics?.favoriteDirectors?.map((director) => director.name) || [],
    datasets: [
      {
        label: t("statistics.titleCount"),
        data:
          statistics?.favoriteDirectors?.map((director) => director.count) ||
          [],
        backgroundColor: PALETTE[1],
        borderRadius: 6,
      },
    ],
  };

  const gridColor = "rgba(243, 233, 218, 0.08)";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12, padding: 14 } },
    },
    scales: {
      x: { grid: { color: gridColor } },
      y: { grid: { color: gridColor }, beginAtZero: true },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: gridColor },
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
      },
    },
  };

  const summary = [
    {
      label: t("statistics.hoursWatched"),
      value: statistics?.totalHoursWatched || 0,
    },
    {
      label: t("statistics.moviesWatched"),
      value: statistics?.totalMoviesWatched || 0,
    },
    {
      label: t("statistics.seriesWatched"),
      value: statistics?.totalSeriesWatched || 0,
    },
    {
      label: t("statistics.averageRating"),
      value: statistics?.averageRating
        ? statistics.averageRating.toFixed(1)
        : "–",
    },
  ];

  return (
    <div className="container-xxl cm-page">
      <header className="cm-page-head">
        <div>
          <div className="cm-eyebrow">{t("statistics.eyebrow")}</div>
          <h1>{t("statistics.title")}</h1>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            aria-label={t("statistics.period")}
          >
            <option value="month">{t("statistics.lastMonth")}</option>
            <option value="year">{t("statistics.lastYear")}</option>
            <option value="all">{t("statistics.allTime")}</option>
          </select>
          <button
            className={`btn text-nowrap ${compareMode ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => {
              setCompareMode(!compareMode);
              if (!compareMode) fetchFriendsComparison();
            }}
          >
            <i className="bi bi-people me-2"></i>
            {t("statistics.compare")}
          </button>
        </div>
      </header>

      <div className="cm-stat-tiles mb-4">
        {summary.map((item) => (
          <div key={item.label} className="cm-stat-tile">
            <div className="cm-stat-value">{item.value}</div>
            <div className="cm-stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      {compareMode && friendsStats.length > 0 && (
        <section className="cm-panel mb-4">
          <h2 className="cm-panel-title">
            {t("statistics.friendsComparison")}
          </h2>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>{t("statistics.user")}</th>
                  <th className="text-end">{t("statistics.hoursWatched")}</th>
                  <th className="text-end">{t("statistics.moviesWatched")}</th>
                  <th className="text-end">{t("statistics.seriesWatched")}</th>
                  <th className="text-end">{t("statistics.averageRating")}</th>
                </tr>
              </thead>
              <tbody className="cm-mono">
                <tr className="cm-row-self">
                  <td>
                    <strong>{t("common.you")}</strong>
                  </td>
                  <td className="text-end">
                    {statistics?.totalHoursWatched || 0}
                  </td>
                  <td className="text-end">
                    {statistics?.totalMoviesWatched || 0}
                  </td>
                  <td className="text-end">
                    {statistics?.totalSeriesWatched || 0}
                  </td>
                  <td className="text-end">
                    {statistics?.averageRating?.toFixed(1) || "–"}
                  </td>
                </tr>
                {friendsStats.map((friend) => (
                  <tr key={friend.userId}>
                    <td>{friend.username}</td>
                    <td className="text-end">
                      {friend.totalHoursWatched || 0}
                    </td>
                    <td className="text-end">
                      {friend.totalMoviesWatched || 0}
                    </td>
                    <td className="text-end">
                      {friend.totalSeriesWatched || 0}
                    </td>
                    <td className="text-end">
                      {friend.averageRating?.toFixed(1) || "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <section className="cm-panel h-100">
            <h2 className="cm-panel-title">{t("statistics.activity")}</h2>
            <div className="cm-chart">
              <Line data={watchTimeData} options={chartOptions} />
            </div>
          </section>
        </div>
        <div className="col-lg-4">
          <section className="cm-panel h-100">
            <h2 className="cm-panel-title">{t("statistics.topGenres")}</h2>
            <div className="cm-chart">
              <Doughnut data={genreData} options={doughnutOptions} />
            </div>
          </section>
        </div>
        <div className="col-md-6">
          <section className="cm-panel h-100">
            <h2 className="cm-panel-title">{t("statistics.favoriteActors")}</h2>
            <div className="cm-chart">
              <Bar data={actorData} options={barChartOptions} />
            </div>
          </section>
        </div>
        <div className="col-md-6">
          <section className="cm-panel h-100">
            <h2 className="cm-panel-title">
              {t("statistics.favoriteDirectors")}
            </h2>
            <div className="cm-chart">
              <Bar data={directorData} options={barChartOptions} />
            </div>
          </section>
        </div>
      </div>

      <section className="cm-panel">
        <h2 className="cm-panel-title">{t("statistics.recentActivity")}</h2>
        {statistics?.recentActivity?.length > 0 ? (
          <ul className="cm-activity">
            {statistics.recentActivity.map((activity, index) => (
              <li key={index}>
                <span className="cm-tag">
                  {activity.type === "movie"
                    ? t("common.movie")
                    : t("common.series")}
                </span>
                <div className="min-w-0 flex-grow-1">
                  <div className="fw-semibold">{activity.title}</div>
                  <div className="small text-muted">
                    {formatAction(activity.action)}
                  </div>
                </div>
                <time className="cm-mono small text-muted text-nowrap">
                  {formatDateTime(parseActivityDate(activity.date))}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mb-0">{t("statistics.noActivity")}</p>
        )}
      </section>
    </div>
  );
};

export default UserStatistics;
