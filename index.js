require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
mongoose.set('strictQuery', false);

// Connexion à MongoDB avec Mongoose
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    console.log("Connecté à MongoDB avec Mongoose");
  } catch (e) {
    console.error('Erreur de connexion à MongoDB avec Mongoose:', e);
    process.exit(1);
  }
}

connectToMongoDB().then(() => {
  app.use(logger); // Middleware de logging
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use((req, res, next) => {
    res.status(404).send("Désolé, cette ressource n'existe pas !");
  });

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  });
});

module.exports = app; // Ajoutez cette ligne
