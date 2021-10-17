// imports
const multer = require("multer");

// Filtre pour ne faire passer que l'image
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Télécharger les images.", false);
  }
};
//  stockage sur disque
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pour stocker les fichiers télécharger
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    // le nom de fichier dans le dossier de destination
    cb(null, `${Date.now()}-original-${file.originalname}`); // pour éviter un doublon
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
