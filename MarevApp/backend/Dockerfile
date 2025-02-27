# Utiliser une image Node.js comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du code
COPY . ./

# Exposer le port utilisé par l'API
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"]

