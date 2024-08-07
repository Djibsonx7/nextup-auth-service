const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Créer un flux de sortie en écriture dans un fichier log
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const logger = morgan('combined', { stream: accessLogStream });

module.exports = logger;
