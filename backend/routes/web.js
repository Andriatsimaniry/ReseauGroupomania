const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const upload = require("../middleware/upload");

let routes = (app) => {
  router.get("/", homeController.getHome); // Page d'accueil du formulaire de téléchargement.

  router.post("/upload", upload.single("file"), uploadController.uploadFiles); // pour appeler le contrôleur de téléchargement

  return app.use("/", router);
};

module.exports = routes;