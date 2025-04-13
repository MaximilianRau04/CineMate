import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/login'; 
import Dashboard from './login/Dashboard'; 
import PrivateRoute from './login/PrivateRoute'; // private route for protected routes

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* public route: login page */}
          <Route path="/login" element={<Login />} />
          
          {/* protected route: dashboard */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          {/* forward to login page if no route was found */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
