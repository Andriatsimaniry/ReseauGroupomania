// Renvoi le contenu public et protégé
const { role } = require("../models");
const db = require("../models");
const User = db.user;
const Post = db.posts;
const Comment = db.comments;
// Récuperer toutes les utilisateurs de la base de données
exports.findAll = (req, res) => {
  User.findAll({
    include: [
      {
        model:db.role
      },
    ]
  })
    .then((data) => {
      res.send(data);
      
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération des utilisateur.",
      });
    });
};

// Mettre à jour utilisateur avec un identifiant
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "L'utilisateur a été mis à jour avec succès.",
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour l' utilisateur avec id=${id}.L'utilisateur n'a pas été trouvé !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: " Erreur lors de la mise à jour de l'utilisateur avecid=" + id,
      });
    });
};
// Supprimer un utilisateur avec l'identifiant spécifié dans la demande
exports.delete = (req, res) => {
  Comment.destroy({
    where: {
      userId: req.params.id,
    }
  }).then((num) =>{
    Post.destroy({
      where: {
        userId: req.params.id,
      },
    }).then((num) => {
      if (num == 1){
        User.destroy({
          where: {
            id: req.params.id,
          },
        })
          .then((num) => {
            console.log(num);
            if (num == 1) {
              res.send({
                message: "L'utilisateur a été supprimé avec succès!",
              });
              //
            } else {
              res.send({
                message: `Impossible de supprimer l'utilisateur avec id=${req.params.id}.L'utilisateur n'a pas été retrouvé `,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message:
                "Impossible de supprimer l'utilisateur avec l'identifiant id=" +
               req.params.id,
            });
          });
        }
    });
  })  
};
