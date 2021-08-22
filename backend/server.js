const express = require("express");
const cors = require("cors");
const app = express();


global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

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
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

// routes
require("./routes/auth.routes")(app);
require("./routes/post.routes")(app);
require("./routes/user.routes")(app);

// écouter sur le port 8080 pour les requêtes entrantes.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Le serveur s'exécute sur le port ${PORT}.`);
});
