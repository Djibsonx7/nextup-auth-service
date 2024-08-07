const { check, validationResult } = require('express-validator');

exports.validateSignup = [
  check('username').not().isEmpty().withMessage('Le nom d\'utilisateur est requis'),
  check('email').isEmail().withMessage('L\'email est invalide'),
  check('password').isLength({ min: 4 }).withMessage('Le mot de passe doit contenir au moins 4 caractères'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateLogin = [
  check('email').isEmail().withMessage('L\'email est invalide'),
  check('password').not().isEmpty().withMessage('Le mot de passe est requis'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
