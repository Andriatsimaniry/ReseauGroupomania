const db = require("../models");
const Comment = db.comments;

// Creer et sauver des nouveaux commentaires
exports.create = (req, res) => {
  if (!req.body.content) {
    res.status(400).send({
      message: "Le contenu ne peut pas être vide!",
    });
    return;
  }

  // Créer un nouveau commentaire
  const comment = {
    userId: req.body.userId,
    postId: req.body.postId,
    content: req.body.content,
  };

  // Enregistrer le commentaire dans la base de données
  Comment.create(comment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création du commentaire.",
      });
    });
};

// Récuperer toutes les commentaires de la base de données
exports.findAll = (req, res) => {
  Comment.findAll({
    where: {
      postId: req.params.postId,
    },
    include: [
      {
        model: db.user,
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
          "Une erreur s'est produite lors de la récupération des commentaires.",
      });
    });
};

// Mettre à jour le commentaire avec un identifiant
exports.update = (req, res) => {
  const id = req.params.id;

  Comment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le commentaire a été mis à jour avec succès.",
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour le commentaire avec id=${id}.Le commentaire n'a pas été trouvé !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: " Erreur lors de la mise à jour du commentaire avec id=" + id,
      });
    });
};

// Supprimer un commentaire avec l'identifiant spécifié dans la demande
exports.delete = (req, res) => {
  const id = req.params.id;

  Comment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le commentaire a été supprimé avec succès!",
        });
      } else {
        res.send({
          message: `Impossible de supprimer le commentaire avec id=${id}. le commentaire n'a pas été trouvée`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Impossible de supprimer le commentaire avec l'identifiant id=" + id,
      });
    });
};
