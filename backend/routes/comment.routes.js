module.exports = (app) => {
  const auth = require("../middleware/authJwt");
  const comment = require("../controllers/comment.controller.js");

  var router = require("express").Router();

  // Créer un nouveau commentaire
  router.post("/:postId/comment", auth.verifyToken, comment.create);

  // Récupérer toutes les publications
  router.get("/:postId/comment", auth.verifyToken, comment.findAll);

  // Mettre à jour un commentaire avec id
  router.put("/:postId/comment/:id", auth.verifyToken, comment.update);

  //Supprimer un commentaire avec id
  router.delete("/:postId/comment/:id",auth.verifyHaveRight, comment.delete);

  app.use("/api/posts", router);
};
