import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/App.css';

import Header from './components/navigation/Header';
import Login from './components/login/Login';
import ExplorePage from './components/explore/ExplorePage';
import MovieDetail from './components/details/MovieDetail';
import SeriesDetail from './components/details/SeriesDetail';
import Watchlist from './components/profile/Watchlist';
import UserProfile from './components/profile/UserProfile';
import Calender from './components/explore/Calender';

const AppContent = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/';

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />

        {/* protected routes */}
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/calendar" element={<Calender />} />

      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
