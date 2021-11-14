const fs = require("fs");
const db = require("../models");
const Image = db.images;

const uploadFiles = async (req, res) => {
  try {
    console.log(req.file);

    if (req.file == undefined) {
      //vérifier le téléchargement du fichier
      return res.send(`vous devez choisir un fichier.`);
    }

    Image.create({
      // modèle sequelize pour enregistrer un objet image
      type: req.file.mimetype,
      name: req.file.filename,
      data: fs.readFileSync(
        //pour lire les données
        __basedir + "/resources/static/assets/uploads/" + req.file.filename
      ),
      postId: req.body.postId
    }).then((image) => {
      return res.send({
        imgUrl: "http://localhost:8080" + "/images/" + image.name,
      });
    });
  } catch (error) {
    console.log(error);
    return res.send(`Erreur pour télécharger les images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};
