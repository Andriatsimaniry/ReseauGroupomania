//Appel des modules
const express = require("express"); //Importer express
const { Sequelize } = require("sequelize"); //Base de donnée Mysql
const userRoutes = require("./routes/user");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require("dotenv").config();

// Connection à la base de donnée

const sequelize = new Sequelize("groupomania", "Niry", "1994", {
  dialect: "mysql",
  host: "localhost",
});
try {
  sequelize.authenticate();
  console.log("Connecté à la base de données MySQL!");
} catch (error) {
  console.error("Impossible de se connecter, erreur suivante :", error);
}

const app = express(); //Pour créer une application express

//Résolution des Cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//  Pour proteger l'application contre les attaques
// content-Security-Policy,x-powered-by,Strict-Transport-Security,
// X-Download-Option,Cache-Control,Content-Type-Options,X-frame-Option,X-Xss-Protection
app.use(helmet());


// Pour éviter les attaques de force brute
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes
});

//  S'applique à toutes les demandes
app.use("/api/", apiLimiter);

// place holder for the data
const users = [];

// utiliser reponse json
app.use(express.json()); //Transformer le corps de la requette en objet javascript utilisable
app.use(express.urlencoded({ extended: true }));

//Appel de l'API

// Active le middleware de logging
app.use("/api/auth", userRoutes);

app.get('/api/users', (req, res) => {
    console.log('api/users')
    res.json(users);
  });

  app.post('/api/user', (req, res) => {
    const user = req.body.user;
    user.id = randomId(10);
    console.log('Adding user:::::', user);
    users.push(user);
    res.json("user addedd");
});



module.exports = app; //Pour pouvoir acceder depuis des autres fichiers notament serveur Node
