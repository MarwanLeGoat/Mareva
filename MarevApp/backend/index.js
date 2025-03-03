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


app.post('/sargasse', (req, res) => {
  const { PecheurId, BoueeId, TailleEstimee } = req.body;

  // Vérifier que BoueeId et TailleEstimee sont présents
  if (!BoueeId || !TailleEstimee) {
    return res.status(400).json({ error: 'BoueeId et TailleEstimee sont nécessaires.' });
  }

  // Requête pour insérer une entrée dans la table Sargasse
  const sargasseQuery = 'INSERT INTO Sargasse (PecheurId, BoueeId, TailleEstimee) VALUES (?, ?, ?)';
  pool.query(sargasseQuery, [PecheurId || null, BoueeId, TailleEstimee], (err, results) => {
    if (err) {
      console.error('Erreur d\'insertion dans Sargasse:', err);
      return res.status(500).json({ error: 'Erreur d\'insertion dans Sargasse.' });
    }

    const sargasseId = results.insertId; // Récupérer l'ID de la Sargasse insérée

    // Requête pour ajouter une entrée dans la table Detection
    const detectionQuery = 'INSERT INTO Detection (SargasseId, BoueeId) VALUES (?, ?)';
    pool.query(detectionQuery, [sargasseId, BoueeId], (err, detectionResults) => {
      if (err) {
        console.error('Erreur d\'insertion dans Detection:', err);
        return res.status(500).json({ error: 'Erreur d\'insertion dans Detection.' });
      }

      // Tout a bien fonctionné, renvoyer la réponse avec les IDs des entrées insérées
      res.status(201).json({
        message: 'Sargasse et Detection ajoutées avec succès.',
        sargasseId,
        detectionId: detectionResults.insertId
      });
    });
  });
});

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

app.get('/detections', (req, res) => {
  const query = `
    SELECT 
      Detection.HoraireDetection,
      Sargasse.SargasseId,
      Sargasse.TailleEstimee,
      Bouee.BoueeId,
      Bouee.Latitude,
      Bouee.Longitude,
      Pecheur.Nom AS PecheurNom
    FROM Detection
    INNER JOIN Sargasse ON Detection.SargasseId = Sargasse.SargasseId
    INNER JOIN Bouee ON Detection.BoueeId = Bouee.BoueeId
    LEFT JOIN Pecheur ON Sargasse.PecheurId = Pecheur.PecheurId
    ORDER BY Detection.HoraireDetection DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des détections:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des détections.' });
    }

    // Renvoyer les résultats avec les informations jointes
    res.status(200).json({
      message: 'Détections récupérées avec succès.',
      detections: results
    });
  });
});


app.get('/detection/:id', (req, res) => {
  const detectionId = req.params.id;

  const query = `
    SELECT 
      Detection.HoraireDetection,
      Sargasse.SargasseId,
      Sargasse.TailleEstimee,
      Bouee.BoueeId,
      Bouee.Latitude,
      Bouee.Longitude,
      Pecheur.Nom AS PecheurNom
    FROM Detection
    INNER JOIN Sargasse ON Detection.SargasseId = Sargasse.SargasseId
    INNER JOIN Bouee ON Detection.BoueeId = Bouee.BoueeId
    LEFT JOIN Pecheur ON Sargasse.PecheurId = Pecheur.PecheurId
    WHERE Detection.SargasseId = ?
    ORDER BY Detection.HoraireDetection DESC
  `;

  pool.query(query, [detectionId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de la détection:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération de la détection.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Aucune détection trouvée avec cet ID.' });
    }

    // Renvoyer les résultats avec les informations jointes
    res.status(200).json({
      message: 'Détection récupérée avec succès.',
      detection: results[0]  // On renvoie uniquement le premier résultat, car l'ID est unique
    });
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

