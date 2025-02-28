import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Exemple : coordonnées de Paris
const centerParis = [48.8566, 2.3522];

// Icône personnalisée (optionnel)
const customIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function MapComponent() {
  return (
    <MapContainer
      center={centerParis}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Couche de tuiles OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marqueur (facultatif) */}
      <Marker position={centerParis} icon={customIcon}>
        <Popup>Bonjour Paris !</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;
