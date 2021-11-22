// Renvoi le contenu public et protégé
const { role } = require("../models");
const db = require("../models");
const User = db.user;
const Post = db.posts;
const Comment = db.comments;
const fs = require("fs");
// Récuperer un utilisateur
exports.getById = (req, res, next) => {
  const currentUser = req.user;
  const id = parseInt(req.params.id);

  // autoriser uniquement les administrateurs à accéder à d'autres enregistrements d'utilisateurs
  if (id !== currentUser.sub && currentUser.role !== "admin") {
      return res.status(401).json({ message: 'Non autorisé' });
  }

  userDataService.getById(req.params.id)
      .then(user => user ? res.json(user) : res.sendStatus(404))
      .catch(err => next(err));

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
    },
  }).then((num) => {
    console.log(num);
    Post.findAll({
      where: { userId: req.params.id },
    }).then((posts) => {
      console.log(posts);
    for (const post of posts) {
        // supprimer l'image d'une publication
        const filename = post.img.split("/images/")[1];
        console.log(`filename: ` + filename);
        const imgPath = `${__basedir}/resources/static/assets/uploads/${filename}`;
        console.log(`imgPath: ` + imgPath);
        fs.unlink(`${imgPath}`, (err) => {
          if (err) throw err;
          console.log(`${imgPath} est supprimé`);
        });
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
