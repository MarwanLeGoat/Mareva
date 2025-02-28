// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AppsPage from './pages/AppsPage';
import AboutPage from './pages/AboutPage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Apps" element={<AppsPage />} />
        <Route path="/About" element={<AboutPage/>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
