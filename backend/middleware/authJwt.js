// Vérifie le jéton, vérifier les rôles d'utilisateur dans la base des données
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "Aucun jeton fourni !",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Non autorisé !",
      });
    }
    req.username = decoded.username;
    req.id = decoded.user_id;
    User.findByPk(req.userId).then((user) => {
      if ((user = !null)) {
        next();
      } else {
        return res.status(403).send({
          message: "Aucun utilisateur trouvé avec ce jéton !",
        });
      }
    });
  });
};

// vérifier l'utilisateur

verifyHaveRight = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "Aucun jeton fourni !",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Non autorisé !",
      });
    }
    console.log(decoded);
    req.id = decoded.id;
    console.log(req.id);
    User.findByPk(req.id).then((user) => {
      console.log(user.id);
      console.log(req.params.id);
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          console.log(roles[i].name);
          if (roles[i].name === "admin") {
            console.log("current est admin");
           return next();
          }
        }
        if (req.params.id && req.params.id == user.id) {
          console.log("current est proprietaire");
        return  next();
        }
        console.log("je suis ici");
        return res.status(401).send({
          message: "Non  autorisé !",
        });
      });
    });
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Exiger le rôle d'administrateur !",
      });
      return;
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  verifyHaveRight: verifyHaveRight,
  isAdmin: isAdmin,
};
module.exports = authJwt;
