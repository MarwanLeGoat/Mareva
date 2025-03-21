import React, {useState, useEffect, useContext, useRef} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AntPath } from "leaflet-ant-path";
import L from "leaflet";
import "./MapComponent.css"
import { useNotification } from '../NotificationProvider/NotificationProvider';


import sargassicon from "../../img/no_valid.svg";
import boueeicon from "../../img/Bouee.svg";
import sargassValidIcon from "../../img/valid.svg";
// Coordonnées de la Guadeloupe
const centerParis = [16.265, -61.551];
const port = [0,0];

const apiUrl = process.env.REACT_APP_API_URL;

//on va customiser l'icone


 const boueeIcon = L.icon({
  iconUrl: boueeicon, 
  iconSize: [50, 50],
  iconAnchor: [25,25],
  popupAnchor: [0, -35],
});

const validIcon = L.icon({
  iconUrl: sargassValidIcon,
  iconSize: [80,80],
  iconAnchor:[40,80],
  popupAnchor: [0,-70],
})






const AnimatedPaths = ({ locations }) => {
  const map = useMap();
  const pathLayers = useRef([]); // Stocke les chemins pour les supprimer plus tard

  useEffect(() => {
    if (!map) return;

    // Supprimer les anciens chemins avant d'ajouter les nouveaux
    pathLayers.current.forEach((layer) => map.removeLayer(layer));
    pathLayers.current = [];

    locations.forEach((loc) => {
      if (loc.pecheur) {
        const antPath = new L.polyline.antPath([[16.265, -61.551], [loc.latitude, loc.longitude]], {
          delay: 800,
          dashArray: [10, 20],
          weight: 5,
          color: "#0000FF",
          pulseColor: "#FFFFFF",
          paused: false,
          reverse: false,
          hardwareAccelerated: true,
        });

        antPath.addTo(map);
        pathLayers.current.push(antPath); // Sauvegarde la référence pour pouvoir supprimer plus tard
      }
    });

    return () => {
      // Nettoyage : supprimer les lignes quand le composant est démonté ou mis à jour
      pathLayers.current.forEach((layer) => map.removeLayer(layer));
      pathLayers.current = [];
    };
  }, [locations, map]);

  return null;
};



function MapComponent() {
          const { addNotification } = useNotification();
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

  const fetchLocations = () => {
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
            timeZone: "UTC",
          });

          return {
            pecheur: item.PecheurNom,
            dateDetection: formattedDate,
            taille: item.TailleEstimee,
            id: item.SargasseId,
            latitude: item.Latitude + 0.01,
            longitude: item.Longitude,
          };
        });
        setLocations(map); // Mettre à jour les données
      })
      .catch((error) => console.error("Erreur API :", error));
  };

  useEffect(() => {
    fetchLocations(); // Exécute immédiatement au chargement

    const id = setInterval(() => {
      fetchLocations(); // Ensuite, répète toutes les 5s
    }, 5000);

    return () => clearInterval(id); // Nettoie l'intervalle si le composant est démonté
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
        addNotification("Sargasse réservée","success");
        console.log(data);
        fetchLocations();
      })
  
  };


  return (
    <MapContainer
      center={centerParis}
      zoom={9}
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
        <Marker  key={loc.id} position={[loc.latitude, loc.longitude]} zoom={1} icon={loc.pecheur ? validIcon : customIcon}>
          <Popup >
            <div className="map-popup">
              <p><strong>Taille estimée</strong>: {loc.taille}m²</p>
              <p><strong>Horaire de Detection</strong>: {loc.dateDetection}</p>
              <p> {loc.latitude}; {loc.longitude}</p>
              {loc.pecheur ? 
                <p>Cette bouée vous est réservée</p> : 
                <button className="map-popup-button" onClick={()=>{HandleClick(loc.id)}}>Récupérer</button>
              }
            </div>          
          </Popup>
        </Marker>
        

      ))}
        
    <AnimatedPaths locations={locations} />

   </MapContainer>
  );
}

export default MapComponent;
