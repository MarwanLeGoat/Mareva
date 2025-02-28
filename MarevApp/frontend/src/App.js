import React,{useState} from 'react';
import logo_home from './img/Logo_home.svg';
import './App.css';
import MapComponent from "./MapComponent.js";

function App() {
  return (
    <div className="App">
      <div className="home-container">
        <img src={logo_home} className="logo-home" alt="Mareva Logo" />
        </div>
      <div className="map-container">
        <h1>Carte </h1>
        <MapComponent />
      </div>
    </div>
    );
    }

    export default App;
