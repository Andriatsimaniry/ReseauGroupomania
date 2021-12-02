// Renvoi le contenu public et protégé

const db = require("../models");
const User = db.user;
const Post = db.posts;
const Comment = db.comments;
const fs = require("fs");
const bcrypt = require("bcrypt");

// Récuperer un utilisateur
exports.findOne = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: db.role,
      },
    ],
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

// Récuperer toutes les utilisateurs de la base de données
exports.findAll = (req, res) => {
  User.findAll({
    include: [
      {
        model: db.role,
      },
    ],
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

  User.update({
    where: { userId: id },
    
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
        message: " Erreur lors de la mise à jour de l'utilisateur avec id=" + id,
      });
    });
};
// Changement de mot de passe
exports.changePassword = (req, res) => {
  const id = req.params.id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const newPasswordConfirm = req.body.newPasswordConfirm;
  User.findOne({
    where: {
      id: id,
    },
  }).then(user => {
    // comparer password avec password dans la base de données en utilisant bcrypt , s'il est correct
    var passwordIsValid = bcrypt.compareSync(
        oldPassword,
        user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Ancien mot de passe incorrect!",
      });
    }else {
      if(newPasswordConfirm === newPassword){
        User.update({password: bcrypt.hashSync(newPassword, 4)},{
          where: { id: id },
        }).then((num) => {
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
                message: " Erreur lors de la mise à jour de l'utilisateur avec id=" + id,
              });
            });
      }else {
        res.status(500).send({
          message: " Le mot de passe saisi et la confirmation ne sont pas les mêmes",
        });
      }
    }
  })
};
 
// Supprimer un utilisateur avec l'identifiant spécifié dans la demande
exports.delete = (req, res) => {
  Comment.destroy({
    where: {
      userId: req.params.id,
    },
  }).then((num) => {
    console.log(num);
    Post.findAll({
      where: { userId: req.params.id },
    }).then((posts) => {
      console.log(posts);
    for (const post of posts) {
        // supprimer l'image d'une publication
        if (post.img) {
          const filename = post.img.split("/images/")[1];
          console.log(`filename: ` + filename);
          const imgPath = `${__basedir}/resources/static/assets/uploads/${filename}`;
          console.log(`imgPath: ` + imgPath);
          fs.unlink(`${imgPath}`, (err) => {
            if (err) throw err;
            console.log(`${imgPath} est supprimé`);
          });
        }
        
      }

      Post.destroy({
        where: {
          userId: req.params.id,
        },
      }).then((num) => {
        console.log(num);
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
      });
    });
  });
};
