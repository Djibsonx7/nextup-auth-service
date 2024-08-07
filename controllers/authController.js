const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  console.log('Début de la fonction signup');
  try {
    const { username, email, password } = req.body;
    console.log('Données reçues pour inscription:', { username, email });
    // Le mot de passe sera haché par le middleware dans le modèle
    const user = await User.create({ username, email, password });
    console.log('Utilisateur créé:', user._id);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    console.log('Token généré:', token);
    res.status(201).json({ token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Erreur de validation lors de signup:', error);
      res.status(400).json({ errors: error.errors });
    } else {
      console.error('Erreur lors de signup:', error);
      res.status(500).json({ message: "Erreur lors de l'inscription: " + error.message });
    }
  }
};

exports.login = async (req, res) => {
  console.log('Début de la fonction login');
  try {
    const { email, password } = req.body;
    console.log('Données reçues pour connexion:', { email });
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Aucun utilisateur trouvé pour:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    console.log('Mot de passe stocké (haché):', user.password);
    const isMatch = await bcrypt.compare(password, user.password); // Comparaison avec bcrypt
    console.log('Résultat de la comparaison:', isMatch);
    if (!isMatch) {
      console.log('Mot de passe incorrect pour:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    console.log('Connexion réussie, token généré:', token);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erreur lors de login:', error);
    res.status(500).json({ message: "Erreur lors de la connexion: " + error.message });
  }
};
