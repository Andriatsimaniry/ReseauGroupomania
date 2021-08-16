const express = require("express");
const cors = require("cors");
const app = express();
const initRoutes = require("./routes/web");

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur le site du reseau Groupomania." });
});

const db = require("./models");
const Role = db.role;

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
require("./routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
