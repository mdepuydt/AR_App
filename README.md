# AR_App

## 1. Mettre en route le serveur

Le serveur se trouve dans le répertoire Server sous le nom server.js

Tapez dans un terminal dans le bon répertoire node server.js 

La première fois, il faut installer les dépendances node.js nécessaires.
	sudo npm install express
	sudo npm install cors
	sudo npm install body-parser


## 2. Builder l'application Android

Ouvrir l'application dans Android Studio
 File -> Open et ouvrir le build.gradle 

Aller dans assets/AREL/ et ouvrir le fichier logic.js 
changer la var addr avec l'adresse ip du serveur

Build et run l'application sur le téléphone.

Vous avez à présent une application disponible sur le téléphone fonctionnant jusqu'à ce que vous changez l'adresse IP du serveur à nouveau.
