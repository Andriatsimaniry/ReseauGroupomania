# Construire un réseau social interne pour les employés de Groupomania.
*** 
***
## Pocédure d'installation
***
### Au préalable il faut installer sur la machine:
***

* nodejs V: 14.17.3


***
#### Pour la base de données:
Mysql V.5.6.17  système de gestion de bases de données
***
### Clonez le Projet: git clone https://github.com/Andriatsimaniry/ReseauGroupomania.git
***
#### Dans ReseauGroupomania/backend/: éxecuter la commande npm install
***
#### Dans ReseauGroupomania/frontend/: éxecuter la commande npm install
***

### Installation de la base de donnée
* Crée un utilisateur de base de donnée root avec mot de passe
* Mettre à jour le fichier ReseauGroupomania/backend/config/db.config.js avec vos identifiant et mot de passe mysql root
* Crée la base de donnée : CREATE DATABASE GROUPOMANIA;
***
### Lancement du serveur backend Nodejs : 
* aller dans ReseauGroupomania/backend/  éxecuter la commande node server.js
***
### Lancement de l'application frontend : 
* aller dans ReseauGroupomania/frontend/   éxecuter la commande npm run serve



