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

verifyHaveRight  = (req, res, next) => {
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
    User.findByPk(req.userId).then((user) =>{
      req.id = decoded.user_id;
      if (user == 'admin' || user == req.body.userId) {
        next();
      }else{
        if (req.body.userId && req.body.userId !== user) {
          throw "id non validé";
        }
        return res.status(401).send({
          message: "Non  autorisé !",
        });
      }
    });
  })
};

const authJwt = {
  verifyToken: verifyToken,
  verifyHaveRight: verifyHaveRight,
  
};
module.exports = authJwt;
