import { FaUsers, FaFilm, FaTv, FaComments, FaUserTie } from "react-icons/fa";
import { useTranslation } from "../../i18n/I18nContext";

const Dashboard = ({ data }) => {
  const { t } = useTranslation();

  const tiles = [
    {
      title: t("admin.dashboard.users"),
      count: data.users.length,
      icon: FaUsers,
    },
    {
      title: t("admin.dashboard.movies"),
      count: data.movies.length,
      icon: FaFilm,
    },
    {
      title: t("admin.dashboard.series"),
      count: data.series.length,
      icon: FaTv,
    },
    {
      title: t("admin.dashboard.reviews"),
      count: data.reviews.length,
      icon: FaComments,
    },
    {
      title: t("admin.dashboard.actors"),
      count: data.actors.length,
      icon: FaUserTie,
    },
    {
      title: t("admin.dashboard.directors"),
      count: data.directors.length,
      icon: FaUserTie,
    },
  ];

  return (
    <div className="cm-stat-tiles">
      {tiles.map(({ title, count, icon: Icon }) => (
        <div key={title} className="cm-stat-tile">
          <div className="d-flex justify-content-between align-items-start">
            <div className="cm-stat-value">{count}</div>
            <Icon size={20} className="text-muted" />
          </div>
          <div className="cm-stat-label">{title}</div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
