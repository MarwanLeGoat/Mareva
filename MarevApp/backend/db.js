const mysql = require("mysql2");
require("dotenv").config();

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

// Vérifier la connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
  } else {
    console.log("Connecté à la base de données MySQL");
    connection.release();
  }
});

const boueesData = [
  { Longitude: -61.640854, Latitude: 15.782101 },
  { Longitude: -61.382787, Latitude: 15.775566 },
  { Longitude: -61.113402, Latitude: 15.875751 },
  { Longitude: -60.963995, Latitude: 16.041164 },
  { Longitude: -60.905137, Latitude: 16.215137 }
];

// Insérer les données dans la table Bouee
boueesData.forEach((bouee) => {
  const query = 'INSERT INTO Bouee (Longitude, Latitude) VALUES (?, ?)';
  pool.query(query, [bouee.Longitude, bouee.Latitude], (err, results) => {
    if (err) {
      console.error('Erreur d\'insertion:', err);
    } else {
      console.log(`Données insérées avec succès :`, results);
    }
  });
});



module.exports = pool;

