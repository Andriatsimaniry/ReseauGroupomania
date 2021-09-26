const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app=express().use('*', cors());
const initRoutes = require("./routes/web");


global.__basedir = __dirname;

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


// analyser les requêtes de type content - application/json
app.use(express.json());

// analyser les requêtes de type content - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur le site du reseau Groupomania." });
});

const db = require("./models");
const Role = db.role;

// initial() la fonction qui crée 3 lignes dans la base de donnée
db.sequelize.sync().then(() => {
  initial();
});

function initial() {
  Role.findOrCreate({
    where: {
      id: 1
    },
    defaults: { // set the default properties if it doesn't exist
      id: 1,
      name: "user"
    }
  });

  Role.findOrCreate({
    where: {
      id: 3
    },
    defaults: { // set the default properties if it doesn't exist
      id: 3,
      name: "admin"
    }
  });
}

// routes
require("./routes/auth.routes")(app);
require("./routes/post.routes")(app);
require("./routes/user.routes")(app);
require("./routes/comment.routes")(app);
require("./routes/web")(app);

app.use('/images', express.static('resources/static/assets/tmp'));

// écouter sur le port 8080 pour les requêtes entrantes.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Le serveur s'exécute sur le port ${PORT}.`);
});
