import React,{useState} from 'react';
//import logo_home from '../img/Logo_home.svg';
//import './loading.css';
import MapComponent from "../components/MapComponent/MapComponent.js"
import Navbar from "../components/footer_menu/footer_menu.tsx" 
function Main(){


  return (
    <>
      <MapComponent/>
     <Navbar/> 
    </>   
   )
}

export default Main;
