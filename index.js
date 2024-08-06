require('dotenv').config();
const express = require('express');
const app = express();

// Middlewares pour parser les corps de requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importez vos routes ici
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

// Route de base pour tester que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).send("Désolé, cette ressource n'existe pas !");
});

// Middleware pour gérer les erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose a mal tourné !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
