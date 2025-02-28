import React,{useState} from 'react';
import logo_home from '../img/Logo_home.svg';
import './loading.css';


function Loading(){


  return (
    <div className="home-container">
      <img src={logo_home} className="logo-home" alt="Mareva Logo" />
    </div>
   )
}

export default Loading;
