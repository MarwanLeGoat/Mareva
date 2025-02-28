import { useEffect, useState } from "react";
import logo_home from '../img/Logo_home.svg';
import './loading.css';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Loading(){

  const navigate = useNavigate();

   const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); 
      setTimeout(() => {
        navigate("/home"); 
      }, 500);
    }, 1500); 

    return () => clearTimeout(timer);
  }, [navigate]);


  return (
    <div className="home-container">
      <img src={logo_home} className="logo-home" alt="Mareva Logo" />
    </div>
   )
}

export default Loading;
