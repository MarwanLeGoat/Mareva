// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './pages/loading.js';
import Main from './pages/main.js'
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/home" element={<Main/>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
