// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './pages/loading.js';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loading />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
