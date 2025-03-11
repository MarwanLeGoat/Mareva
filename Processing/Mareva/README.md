# Processing

Pour ce projet, nous avons décidé d'utiliser un affichage graphique sur un écran et avons donc choisis d'utiliser Processing. 

## Prérequis

- Une version à jour de Processing
- Les plugins **Sound** (*The Processing Foundation*) et **HTTP Requests for Processing** installés
- Un Arduino avec le code du projet branché sur un port série ou alors l'émulateur d'Arduino du projet

## Configuration

Pour l'utiliser il faut configurer deux paramètres importants:
1. Le **port série** à utiliser, il faut choisir celui relié au Arduino
2. L'**URL de base du site** sur lequel est hébergé l'application mobile Mareva

## Utilisation

Il suffit de le lancer et de suivre les étapes du scénario. 

## Structure de code

Le code est strucuté sous la forme d'une **machine à états** avec chaque état qui représente un affichage différent.

### State
Chaque état hérite de la classe **State**. Cette classe abstraite propose une methode **update()** à implémenter qui défini le comportement de l'état à chaque Frame. Ainsi c'est dans cette méthode que l'on va effectuer les changement d'état. 
En plus de ça, on a une méthode **onEnter()** qui défini des instructions à l'instanciation de l'état. 

### SerialHandler
Pour faire le lien avec le Arduino, on a besoin de lire le port série en continue est d'en extraire les données importantes mais également d'en envoyer (pour l'allumage des LEDs).

On a donc une méthode pour l'analyse d'une ligne du port série **mettant à jour les états de tout les capteurs**. Avec elle une méthode pour **vérifier l'état d'un capteur** par son identifiant (n°).
Mais aussi une méthode pour simplement **envoyer un message** sur le port série.

### ApiHandler
Et enfin pour controler le lien avec l'application, on a besoin d'effectuer des requêtes HTTP. Pour ça on a une classe qui gère toutes les requêtes necessaires et les traites.