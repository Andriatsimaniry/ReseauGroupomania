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

// Verifier si l'utilisateur est admin

verifyAdminToken = (req, res, next) => {
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
    User.findOne({
      where: {
        id: decoded.id,
      },
      include: [
        {
          model: db.role,
        },
      ],
    }).then((user) => {
      let isAdminUser = false;
      if (user !== null) {
        user.roles.forEach((role) => {
          if (role.name === "admin") {
            isAdminUser = true;
          }
        });
        if (isAdminUser) {
          next();
        } else {
          return res.status(403).send({
            message: "Exiger le rôle d'administrateur !",
          });
        }
      }
      return res.status(403).send({
        message: "Aucun utilisateur trouvé avec ce jéton !",
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  verifyAdminToken: verifyAdminToken,
};
module.exports = authJwt;
