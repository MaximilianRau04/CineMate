import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/App.css';

import Header from './components/navigation/Header';
import Login from './components/login/Login';
import ExplorePage from './components/explore/ExplorePage';
import MovieDetail from './components/explore/MovieDetail';
import SeriesDetail from './components/explore/SeriesDetail';
import Watchlist from './components/explore/Watchlist';

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
