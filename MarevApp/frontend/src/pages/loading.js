import React,{useState} from 'react';
import logo_home from '../img/Logo_home.svg';
import './loading.css';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Loading(){

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // Redirige vers la page "/home" après 1 seconde
    }, 2000);

    return () => clearTimeout(timer); // Nettoyage du timer
  }, [navigate]);

  return (
    <div className="home-container">
      <img src={logo_home} className="logo-home" alt="Mareva Logo" />
    </div>
   )
}

export default Loading;
