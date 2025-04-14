import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/login'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import MovieList from './movies/MovieList';
import MovieDetail from './movies/MovieDetail';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* public route: login page */}
          <Route path="/login" element={<Login />} />
          
          {/* forward to login page if no route was found */}
          <Route path="*" element={<Login />} />

          <Route path="/movies" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
