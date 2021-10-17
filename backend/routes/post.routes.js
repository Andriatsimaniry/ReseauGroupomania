module.exports = (app) => {
  const auth = require("../middleware/authJwt");
  const posts = require("../controllers/post.controllers.js");

  var router = require("express").Router();

  // Créer une nouvelle publication
  router.post("/", auth.verifyToken, posts.create);

  // Récupérer toutes les publications
  router.get("/", auth.verifyToken, posts.findAll);

  // Mettre à jour une publication avec id
  router.put("/:id", auth.verifyToken, posts.update);

  // Mettre à jour une publication avec id et like
  router.post("/:id/like", auth.verifyToken, posts.like);

  //Supprimer une publication avec id
  router.delete("/:id", auth.verifyToken, posts.delete);

  app.use("/api/posts", router);
};
