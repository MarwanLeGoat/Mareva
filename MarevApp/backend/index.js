const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware JSON
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.json({ message: "Hello from Express!" });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

