const mysql = require("mysql2");
require("dotenv").config();

// Créer une instance de pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fonction pour attendre que la base de données soit prête
const waitForDatabase = (callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Erreur de connexion à la base de données:", err);
      // Attendre 5 secondes avant de réessayer
      setTimeout(() => waitForDatabase(callback), 5000);
    } else {
      console.log("Base de données prête!");
      connection.release();
      callback();
    }
  });
};

// Fonction pour insérer les données dans la table Bouee
const insertData = () => {
  const boueesData = [
    { Longitude: -61.640854, Latitude: 15.782101 },
    { Longitude: -61.382787, Latitude: 15.775566 },
    { Longitude: -61.113402, Latitude: 15.875751 },
    { Longitude: -60.963995, Latitude: 16.041164 },
    { Longitude: -60.905137, Latitude: 16.215137 }
  ];


  boueesData.forEach((bouee) => {
  // Arrondir les coordonnées à 5 décimales pour éviter les problèmes d'arrondi
  const roundedLongitude = Math.round(bouee.Longitude * 100000) / 100000;
  const roundedLatitude = Math.round(bouee.Latitude * 100000) / 100000;

  // Requête pour vérifier si la bouée existe déjà avec les coordonnées arrondies
  const checkBoueeQuery = 'SELECT 1 FROM Bouee WHERE ROUND(Longitude, 5) = ? AND ROUND(Latitude, 5) = ? LIMIT 1';
  
  pool.query(checkBoueeQuery, [roundedLongitude, roundedLatitude], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'existence de la bouée:', err);
      return;
    }

    // Si aucune bouée n'a été trouvée (résultat vide), on peut l'insérer
    if (results.length === 0) {
      const insertBoueeQuery = 'INSERT INTO Bouee (Longitude, Latitude) VALUES (?, ?)';
      pool.query(insertBoueeQuery, [roundedLongitude, roundedLatitude], (err, insertResults) => {
        if (err) {
          console.error('Erreur d\'insertion:', err);
        } else {
          console.log(`Données insérées avec succès pour la bouée :`, insertResults);
        }
      });
    } else {
      console.log(`La bouée avec Longitude: ${roundedLongitude} et Latitude: ${roundedLatitude} existe déjà.`);
    }
  });
});

// Vérification et insertion du pêcheur
const checkPecheurQuery = 'SELECT COUNT(*) AS count FROM Pecheur WHERE Nom = ?';

pool.query(checkPecheurQuery, ['Pecheur'], (err, results) => {
  if (err) {
    console.error('Erreur lors de la vérification de l\'existence du pêcheur:', err);
    return;
  }

  // Si le pêcheur n'existe pas (count = 0), on peut l'insérer
  if (results[0].count === 0) {
    pool.query(`
      INSERT INTO Pecheur (Nom)
      VALUES ('Pecheur')`, (err,res)=>{
        if (err) {
          console.error("Erreur lors de l'insertion du pêcheur:", err);
        } else {
          console.log("Insertion du pêcheur réussie");
        }
    });
  } else {
    console.log("Le pêcheur existe déjà.");
  }
});

}

// Appel initial pour attendre que la base de données soit prête
waitForDatabase(insertData);

module.exports = pool;

