// 2 fonctions principales pour l'authentification
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");


// créer un nouvel utilisateur dans la base de données (le rôle est l'utilisateur si aucun rôle n'est spécifié)
exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
   email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 4),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "L'utilisateur a été enregistré avec succès !" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "L'utilisateur a été enregistré avec succès !" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// recherche username de la requête dans la base de données, si elle existe
exports.signin = (req, res) => {
  User.findOne({
    where: {
      // username: req.body.username,
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé." });
      }

      // comparer password avec password dans la base de données en utilisant bcrypt , s'il est correct
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Mot de passe incorrect!",
        });
      }

      // générer un jeton en utilisant jsonwebtoken
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: '1h' // 1 heure
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

      // retourner les informations de l'utilisateur et accéder au jeton
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
