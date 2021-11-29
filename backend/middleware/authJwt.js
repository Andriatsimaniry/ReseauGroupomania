// Vérifie le jéton, vérifier les rôles d'utilisateur dans la base des données
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
 const db = require("../models");
 const User = db.user;
 const Post = db.posts;
 const Comment = db.comments;

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

// vérifier le Token de l'utilisateur Propriétaire du compte

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
        message: "Non plus autorisé !",
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

// vérifier le Token de l'utilisateur Propriétaire du Publication

verifyPostRight = (req, res, next) => {
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
    // On regarde d'abord si l'utilisateur est admin on continue
    User.findByPk(decoded.id).then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          console.log(roles[i].name);
          if (roles[i].name === "admin") {
            console.log("current est admin");
            return next();
          }
          // Si l'utilisateur n'est pas admin on verifie si il est le proprietaire du post
          Post.findByPk(req.params.id).then((post) => {
            console.log(req.params.id);
            post.getUser().then(user => {
              if(user.id === decoded.id) {
                console.log("current est proprietaire");
                return next();
              }
              // si il n'est pas le proprietaire du post on n'autorise pas 
              return res.status(401).send({
                message: "Non  autorisé !"
              });
            });
          });
        }
      });
    });
  });
};

// vérifier le Token de l'utilisateur Propriétaire du Commentaire

verifyCommentRight = (req, res, next) => {
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
    // On regarde d'abord si l'utilisateur est admin on continue
    User.findByPk(decoded.id).then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          console.log(roles[i].name);
          if (roles[i].name === "admin") {
            console.log("current est admin");
            return next();
          }
          // Si l'utilisateur n'est pas admin on verifie s'il est le proprietaire du commentaire
          Comment.findByPk(req.params.id).then((comment) => {
            console.log(req.params.id);
            comment.getUser().then(user => {
              if(user.id === decoded.id) {
                console.log("current est proprietaire");
                return next();
              }
              // s'il n'est pas le proprietaire du post on n'autorise pas 
              return res.status(401).send({
                message: "Non  autorisé !"
              });
            });
          });
        }
      });
    });
  });
};

isAdmin = (req, res, next) => {
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
    req.id = decoded.id;
    User.findByPk(req.id).then((user) => {
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
  });
};

const authJwt = {
  verifyToken: verifyToken,
  verifyHaveRight: verifyHaveRight,
  isAdmin: isAdmin,
  verifyPostRight: verifyPostRight,
  verifyCommentRight: verifyCommentRight,
};
module.exports = authJwt;
