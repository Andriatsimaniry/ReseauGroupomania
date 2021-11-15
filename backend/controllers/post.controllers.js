const db = require("../models");
const Post = db.posts;
const Op = db.Sequelize.Op;
const fs = require("fs");
const Image = db.images;
const Comment = db.comments;

// Creer et sauver des nouvelles publications
exports.create = (req, res) => {
  if (!req.body.post) {
    res.status(400).send({
      message: "Le contenu ne peut pas être vide!",
    });
    return;
  }

  // Créer une nouvelle publication
  const post = {
    userId: req.body.userId,
    roles: req.body.roles,
    post: req.body.post,
    img: req.body.img,
    likes: [],
    dislikes: [],
  };

  // Enregistrer la publication dans la base de données
  Post.create(post)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création de la publication.",
      });
    });
};

// Récuperer toutes les Publications de la base de données
exports.findAll = (req, res) => {
  Post.findAll({
    include: [
      {
        model: db.user,
      },
      {
        model: db.comments,
        include: [
          {
            model: db.user,
          },
        ],
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
          "Une erreur s'est produite lors de la récupération des publications.",
      });
    });
};

// Récuperer toutes les Publications d'un utilisateur la base de données
exports.findAllByUser = (req, res) => {
  const userId = req.params.id;

  Post.findAll({
    include: [
      {
        model: db.user,
      },
      {
        model: db.comments,
        include: [
          {
            model: db.user,
          },
        ],
      },
    ],
    where: {
      userId: userId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la récupération des publications.",
      });
    });
};

// Mettre à jour une publication avec un identifiant
exports.update = (req, res) => {
  const id = req.params.id;

  Post.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "La publication a été mis à jour avec succès.",
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour la publication avec id=${id}.La publication n'a pas été trouvé !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          " Erreur lors de la mise à jour de la publication avec id=" + id,
      });
    });
};

// DELETE: /:id supprimer une publication
exports.delete = (req, res, next) => {
  Comment.destroy({
    where: {
      postId: req.params.id,
    }
  }).then((num) => {
    console.log(num);
    Post.findOne({
      where: { id: req.params.id },
    })
      .then((post) => {
        // supprimer l'image d'une publication
        const filename = post.img.split("/images/")[1];
        console.log(`filename: ` + filename);
        const imgPath = `${__basedir}/resources/static/assets/uploads/${filename}`;
        console.log(`imgPth: ` + imgPath);
        fs.unlink(`${imgPath}`, (err) => {
          if (err) throw err;
          console.log(`${imgPath} est supprimé`);
        });
        Post.destroy({
          where: { id: req.params.id },
        })
          .then(() => res.status(200).json({ message: "Publication supprimé !" }))
          .catch((error) =>
            res
              .status(400)
              .json({ message: "erreur pour supprimer la publication" })
          );
      })
      .catch((error) => res.status(500).json({ error }));
  })
 
};

//Code j'aime , j'aime pas
exports.like = (req, res, next) => {
  if (req.body.like === 1) {
    // incremente j'aime
    Post.update(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        // rajouter  j'aime
        $push: { usersLiked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "'j'aime' ajouté" }))
      .catch((error) => res.status(400).json({ message: error }));
  } else if (req.body.like === -1) {
    Post.update(
      // enlever j'aime
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then(() => res.status(200).json({ message: "'j'aime pas' Ajouté " }))
      .catch((error) => res.status(400).json({ message: error }));
  } else {
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        if (post.usersLiked.includes(req.body.userId)) {
          Post.update(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then(() =>
              res.status(200).json({
                message: " 'j'aime' enlevé!",
              })
            )
            .catch((error) => res.status(400).json({ message: error }));
        } else if (post.usersDisliked.includes(req.body.userId)) {
          Post.update(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() =>
              res.status(200).json({
                message: "'j'aime pas' enlevé  !",
              })
            )
            .catch((error) => res.status(400).json({ message: error }));
        }
      })
      .catch((error) => res.status(400).json({ message: error }));
  }
};
