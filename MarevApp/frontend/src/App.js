import React from 'react';
import logo_home from './img/Logo_home.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="home-container">
        <img src={logo_home} className="logo-home" alt="Mareva Logo" />
        <button className="btnD">DEMARRER</button>
      </div>
    </div>
  );
}

export default App;
