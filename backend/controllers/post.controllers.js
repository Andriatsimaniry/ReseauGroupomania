const db = require("../models");
const Post = db.posts;
const Op = db.Sequelize.Op;
const fs = require("fs");
const Image = db.images;

// Creer et sauver des nouvelles publications
exports.create = (req, res) => {
    if (!req.body.post) {
      res.status(400).send({
        message: "Le contenu ne peut pas être vide!"
      });
      return;
    }
  
    // Créer une nouvelle publication
    const post = {     
      userId: req.body.userId,
      roles: req.body.roles,
      post: req.body.post,
      img: req.body.img,
      like: 0,
      dislike: 0, 
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
    const post = req.query.post;
    var condition = post ? { post: { [Op.like]: `%${post}%` } } : null;
  
    Post.findAll({ include: [
        {
          model: db.user
        }, 
        {
          model: db.comments,
          include: [
            {
              model: db.user
            }
          ]
        }
      ]})
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
          message: " Erreur lors de la mise à jour de la publication avec id=" + id
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
            message: `Impossible de supprimer la publication avec id=${id}. la publication n'a pas été trouvée`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Impossible de supprimer la publication avec l'identifiant id=" + id
        });
      });
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
  exports.uploadFiles = async (req, res) => {
    try {
      console.log(req.file);
  
      if (req.file == undefined) { //vérifier le téléchargement du fichier
        return res.send(`vous dever choisir un fichier.`);
      }
  
      Image.create({ // modèle sequelize pour pour enregistrer un objet image
        type: req.file.mimetype,
        name: req.file.originalname,
        data: fs.readFileSync( //pour lire les données
          __basedir + "/resources/static/assets/uploads/" + req.file.filename
        ),
      }).then((image) => {
        fs.writeFileSync( //pour écrire des données 
          __basedir + "/resources/static/assets/tmp/" + image.name, //écrire les données images dans le dossier tmp
          image.data
        );
  
        return res.send(`le fichier a bien été télécharger.`);
      });
    } catch (error) {
      console.log(error);
      return res.send(`Erreur pour télécharger les images: ${error}`);
    }
  };
  
};
