import React from 'react';
import { FaHome, FaSearch, FaUser } from 'react-icons/fa'; // Import des icônes
import "./footer_menu.css"; // Import du fichier CSS
import { HiDotsHorizontal } from "react-icons/hi";
import { IoApps } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { AiOutlineMessage } from "react-icons/ai";
import { PiPathBold } from "react-icons/pi";
import { RiUserLine } from "react-icons/ri";
import { PiCompassRose } from "react-icons/pi";

const icon_size = 30;

const Navbar = ({toggleDrawer}) => {
  // Fonctions de base pour chaque bouton (modifiez selon vos besoins)
  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const handleAppClick = () => {
    window.location.href = "/Apps";
  };


  return (
    <div className="navbar">
      <button onClick={toggleDrawer} className="nav-button">
        <PiCompassRose size={icon_size} />
      </button>
      <button onClick={handleHomeClick} className="nav-button">
        <PiPathBold size={icon_size} />
      </button>
      <button onClick={handleAppClick} className="nav-button">
        <AiOutlineMessage size={icon_size}/>
      </button>

      <button onClick={handleHomeClick} className="nav-button">
        <RiUserLine size={icon_size} />
      </button>
    </div>
  );
};

export default Navbar;
