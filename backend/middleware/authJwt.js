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
    User.findByPk(req.userId).then((user) =>{
      if (user =!null) {
        next();
      }else{
        return res.status(403).send({
          message: "Aucun utilisateur trouvé avec ce jéton !",
        });
      }   
    });
    
  });
}

  

 // todo verifie si l'userId existe dans la base
  
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
  isAdmin: isAdmin,
};
module.exports = authJwt;
