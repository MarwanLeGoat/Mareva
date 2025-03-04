import React,{useState} from 'react';
import logo_home from './img/Logo_home.svg';
import './App.css';
import AppRoutes from "./Routes.js";
import {NotificationProvider} from "./components/NotificationProvider/NotificationProvider.js"
function App() {
  return (
    <div className="App">
      <NotificationProvider>      
      <AppRoutes/> 
      </NotificationProvider>
    </div>
    );
    }

    export default App;
