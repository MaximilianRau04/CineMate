import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/navigation/Header';
import Login from './components/login/Login';
import MovieList from './components/movies/MovieList';
import MovieDetail from './components/movies/MovieDetail';
import Watchlist from './components/movies/Watchlist';

const AppContent = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login';

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        {/* Public Route: Login */}
        <Route path="/" element={<Login />} />

        {/* Geschützte Routen */}
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />

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
