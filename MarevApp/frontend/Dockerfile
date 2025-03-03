
# Étape 1 : Build du frontend avec Node.js
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Étape 2 : Utiliser Nginx pour servir les fichiers statiques
FROM nginx:latest

# Supprimer la config par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copier la config Nginx personnalisée
COPY default.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers React buildés dans Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]

