# Utilisez l'image officielle Node.js comme image de base
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copiez les fichiers package.json et package-lock.json
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install

# Copiez tous les fichiers du projet dans le conteneur
COPY . .

# Exposez le port sur lequel votre application va s'exécuter
EXPOSE 3000

# Définissez la commande pour démarrer votre application
CMD ["node", "index.js"]
