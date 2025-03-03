const cors = require('cors');
const express = require("express");
const dotenv = require("dotenv");
const pool = require("./db");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware JSON
app.use(express.json());
app.use(cors());



app.get("/sargasses", (req, res) => {
  pool.query("SELECT * FROM Sargasse",(err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
    res.json(results);
  });    
});


app.get("/pecheurs", (req, res) => {
  pool.query("SELECT * FROM Pecheur",(err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
    res.json(results);
  });    
});


app.get("/bouees", (req, res) => {
  pool.query("SELECT * FROM Bouee",(err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
    res.json(results);
  });    
});


app.get("/detections", (req, res) => {
  pool.query("SELECT * FROM Detection",(err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
    res.json(results);
  });    
});

app.get("/detections/dernieres/:limit", (req, res) => {
  const { limit } = req.params;

  pool.query(
    `SELECT d.SargasseId, d.BoueeId, d.HoraireDetection, 
            s.TailleEstimee, b.Latitude, b.Longitude, p.Nom 
     FROM Detection d
     LEFT JOIN Sargasse s ON d.SargasseId = s.SargasseId
     LEFT JOIN Bouee b ON d.BoueeId = b.BoueeId
     LEFT JOIN Pecheur p ON s.PecheurId = p.PecheurId
     ORDER BY d.HoraireDetection DESC
     LIMIT ?`,
    [parseInt(limit)], // Sécuriser la valeur
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }
      console.log(results);
      res.json(results);
    }
  );
});

app.get("/detections/seules", (req, res) => {

  pool.query(
    `SELECT d.SargasseId, d.BoueeId, d.HoraireDetection, 
            s.TailleEstimee, b.Latitude, b.Longitude, p.Nom 
     FROM Detection d
     LEFT JOIN Sargasse s ON d.SargasseId = s.SargasseId
     LEFT JOIN Bouee b ON d.BoueeId = b.BoueeId
     LEFT JOIN Pecheur p ON s.PecheurId = p.PecheurId
     WHERE p.PecheurId IS NULL
     ORDER BY d.HoraireDetection DESC`,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }
      console.log(results);
      res.json(results);
    }
  );
});




// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

