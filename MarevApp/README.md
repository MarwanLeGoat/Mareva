# MarevApp

MarevApp est l'application Web qui simule l'application du projet Mareva dans le cadre de la maquette de médiation. 

## Structure du projet

- **MarevApp/** : L'application principale avec le backend, le frontend, et les configurations Docker.
  - **backend/** : Le serveur Node.js Express pour l'API.
  - **frontend/** : L'application React pour l'UI.
  - **db/** : Le script SQL pour initialiser la base de données.
  - **nginx/** : La configuration Nginx pour le reverse proxy.


## Prérequis

- Docker
- Docker Compose

## Installation

1. Clonez le dépôt :
```sh
git clone https://github.com/MarwanLeGoat/Mareva.git
cd MarevApp
```

2. Lancez les services Docker :
```sh
docker-compose up --build -d
```

# Explication du fonctionnement

![](./db_scheme.png)
<center><i>Fig 1 : Modèle relationnel de la base de donnée</i></center>

