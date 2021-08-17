const db = require("../models");
const Post = db.posts;
const Op = db.Sequelize.Op;

// Creer et sauver des nouvelles publications
exports.create = (req, res) => {
    if (!req.body.title) {
      res.status(400).send({
        message: "Le contenu ne peut pas être vide!"
      });
      return;
    }
  
    // Créer une nouvelle publication
    const post = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ? req.body.published : false
    };
  
    // Enregistrer la publication dans la base de données
    Post.create(post)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Une erreur s'est produite lors de la création de la publication."
        });
      });
  };

// Récuperer toutes les Publications de la base de données
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    post.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Une erreur s'est produite lors de la récupération des publications."
        });
      });
  };

// Trouver une seule publication avec un identifiant
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Post.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la récupération de la publication avec l'identifiant=" + id
        });
      });
  };
// Mettre à jour une publication avec un identifiant
exports.update = (req, res) => {
    const id = req.params.id;
  
    Post.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "La publication a été mis à jour avec succès."
          });
        } else {
          res.send({
            message: `Impossible de mettre à jour la publication avec id=${id}.La publication n'a pas été trouvé !`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: " Erreur lors de la mise à jour de la publication avecid=" + id
        });
      });
  };
// Supprimer une publication avec l'identifiant spécifié dans la demande
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Post.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "La publication a été supprimé avec succès!"
          });
        } else {
          res.send({
            message: `Impossible de supprimer la publication avec id=${id}. Maybe Tutorial was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Impossible de supprimer la publication avec l'identifiant id=" + id
        });
      });
  };
// Supprimez tous les messages de la base de données.
// exports.findAllPublished = (req, res) => {
//     Post.findAll({ where: { published: true } })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Une erreur s'est produite lors de la récupération des publications."
//         });
//       });
//   };
// Trouver toutes les articles publiés
exports.findAllPublished = (req, res) => {
    Post.findAll({ where: { published: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Une erreur s'est produite lors de la récupération des publications."
        });
      });
  };