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


 const boueeIcon = L.icon({
  iconUrl: boueeicon, 
  iconSize: [50, 50],
  iconAnchor: [25,25],
  popupAnchor: [0, -35],
});


function MapComponent() {
  const [locations, setLocations] = useState([]);
  const [bouees, setBouees] = useState([]);
  
    const [size, setSize] = useState(80); // Taille initiale
  const [growing, setGrowing] = useState(true); // Direction de l'animation
  const speedfactor = 0.1;

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setSize((prevSize) => {
        let newSize = growing ? prevSize + speedfactor : prevSize - speedfactor; // Change progressivement
        if (newSize >= 80) setGrowing(false); // Inverse quand trop grand
        if (newSize <= 70) setGrowing(true); // Inverse quand trop petit
        return newSize;
      });

      animationFrame = requestAnimationFrame(animate); // Continue l'animation
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame); // Nettoyage à la fin
  }, [growing]);

    
  const customIcon = L.icon({
  iconUrl: sargassicon, 
  iconSize: [size, size],
  iconAnchor: [size/2,size],
  popupAnchor: [0, -70],
});

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
      fetch("/api/detections") // Remplace par ton API
        .then((res) => res.json())
        .then((data) => {
          let map = data.detections.map((item) => {
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

  const HandleClick = (id) => {
    const data = {
      "PecheurId" : 1
    }

    fetch(`/api/detection/${id}/pecheur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Indiquer que l'on envoie des données JSON
        },
        body: JSON.stringify(data),  // Convertir l'objet en JSON
      })
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data);
      })
  
  };


  return (
    <MapContainer
      center={centerParis}
      zoom={10}
      maxBounds={[[15.707489,-62.105152],[16.683383,-60.657703]]}
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
        <Marker  key={loc.id} position={[loc.latitude, loc.longitude]} zoom={1} icon={customIcon}>
          <Popup >
            <div className="map-popup">
              <p><strong>Taille estimée</strong>: {loc.taille}m²</p>
              <p><strong>Horaire de Detection</strong>: {loc.dateDetection}</p>
              <button className="map-popup-button" onClick={()=>{HandleClick(loc.id)}}>Récupérer</button>
            </div>          
          </Popup>
        </Marker>
      ))}

   </MapContainer>
  );
}

export default MapComponent;
