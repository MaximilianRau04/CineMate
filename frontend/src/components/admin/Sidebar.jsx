import { FaChartBar, FaFilm, FaUsers, FaComments, FaUserTie } from 'react-icons/fa';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { key: 'dashboard', icon: FaChartBar, label: 'Dashboard' },
    { key: 'content', icon: FaFilm, label: 'Content Management' },
    { key: 'users', icon: FaUsers, label: 'Benutzerverwaltung' },
    { key: 'moderation', icon: FaComments, label: 'Moderation' },
    { key: 'cast', icon: FaUserTie, label: 'Schauspieler & Regisseure' },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h5>Admin Panel</h5>
      </div>
      <div className="list-group list-group-flush">
        {menuItems.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            className={`list-group-item list-group-item-action ${activeTab === key ? 'active' : ''}`}
            onClick={() => onTabChange(key)}
          >
            <Icon className="me-2" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};