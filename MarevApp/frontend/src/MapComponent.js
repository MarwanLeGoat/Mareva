import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import d'une icône React
import sargassicon from "./img/Map_pin.svg";

// Coordonnées de la Guadeloupe
const centerGuadeloupe = [16.265, -61.551];

//on va customiser l'icone
const customIcon = L.icon({
  iconUrl: sargassicon, 
  iconSize: [80, 80],
  iconAnchor: [40,80],
  popupAnchor: [0, -35],
});


function MapComponent() {
  return (
    <MapContainer
      center={centerGuadeloupe}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Couche de tuiles OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={centerGuadeloupe} icon={customIcon}>
        <Popup>Je suis le centre de la Guadeloupe</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;
