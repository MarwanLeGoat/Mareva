# Étape 1 : Build de l’application React
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Étape 2 : Utiliser Nginx pour servir les fichiers statiques
FROM nginx:latest

# Copier les fichiers React buildés dans Nginx
COPY --from=build /app/build /usr/share/nginx/html


# Exposer le port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

