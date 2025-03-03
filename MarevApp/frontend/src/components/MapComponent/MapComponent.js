import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapComponent.css"

import sargassicon from "../../img/Map_pin.svg";
import boueeicon from "../../img/Bouee.svg";
// Coordonnées de la Guadeloupe
const centerParis = [16.265, -61.551];

const apiUrl = process.env.REACT_APP_API_URL;

//on va customiser l'icone
const customIcon = L.icon({
  iconUrl: sargassicon, 
  iconSize: [80, 80],
  iconAnchor: [45,60],
  popupAnchor: [0, -70],
});

 const boueeIcon = L.icon({
  iconUrl: boueeicon, 
  iconSize: [50, 50],
  iconAnchor: [25,25],
  popupAnchor: [0, -35],
});


function MapComponent() {
  const [locations, setLocations] = useState([]);
  const [bouees, setBouees] = useState([]);
    
  useEffect(()=>{
    fetch("/api/bouees")
      .then((res)=>res.json())
      .then((data)=>{
        let map = data.map((item) => {
          return ({id:item.id, latitude:item.Latitude, longitude:item.Longitude});
        })
        setBouees(map);
      })

  },[])

    // Fonction pour récupérer les données
    useEffect(() => {
      fetch("/api/detections/dernieres/5") // Remplace par ton API
        .then((res) => res.json())
        .then((data) => {
          let map = data.map((item) => {
            const date = new Date(item.HoraireDetection);

            const formattedDate = date.toLocaleString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC"
            });

            return ({dateDetection:formattedDate, taille:item.TailleEstimee ,id:item.SargasseId,latitude:item.Latitude+0.01,longitude:item.Longitude})
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

         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      


      {bouees.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} zoom={1} interactive={false} icon={boueeIcon}>
        </Marker>
      ))}

      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} zoom={1} icon={customIcon}>
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
