import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapComponent.css"

import sargassicon from "../../img/Map_pin.svg";

// Coordonnées de la Guadeloupe
const centerParis = [16.265, -61.551];

//on va customiser l'icone
const customIcon = L.icon({
  iconUrl: sargassicon, 
  iconSize: [80, 80],
  iconAnchor: [40,80],
  popupAnchor: [0, -35],
});


function MapComponent() {
  const [locations, setLocations] = useState([]);

    // Fonction pour récupérer les données
    useEffect(() => {
      fetch("http://localhost/api/detections/dernieres/5") // Remplace par ton API
        .then((res) => res.json())
        .then((data) => {
          let map = data.map((item) => {
            return ({dateDetection:item.HoraireDetection, taille:item.TailleEstimee ,id:item.SargasseId,latitude:item.Latitude,longitude:item.Longitude})
          })
          setLocations(map); // Stocker les données dans l'état
        })
        .catch((error) => console.error("Erreur API :", error));
    }, []);




  return (
    <MapContainer
      center={centerParis}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Couche de tuiles OpenStreetMap */}

    <TileLayer
    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
    attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
    />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={customIcon}>
          <Popup >
            <div className="map-popup">
              <p><strong>Taille estimée</strong>: {loc.taille}m²</p>
              <p><strong>Horaire de Detection</strong>: {loc.dateDetection}</p>
              <button className="map-popup-button">Itinéraire</button>
            </div>          
          </Popup>
        </Marker>
      ))}

   </MapContainer>
  );
}

export default MapComponent;
