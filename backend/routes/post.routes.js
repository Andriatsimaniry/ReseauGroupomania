module.exports = (app) => {
  const auth = require("../middleware/authJwt");
  const posts = require("../controllers/post.controllers.js");

  var router = require("express").Router();

  // Créer une nouvelle publication
  router.post("/", auth.verifyToken, posts.create);

  // Récupérer toutes les publications
  router.get("/", auth.verifyToken, posts.findAll);
  
  // Récupérer une publication
  router.get("/user/:id", auth.verifyHaveRight, posts.findAllByUser);

  // Mettre à jour une publication avec id
  router.put("/:id", auth.verifyHaveRight, posts.update);

  // Mettre à jour une publication avec id et like
  router.post("/:id/like", auth.verifyHaveRight, posts.like);

  //Supprimer une publication avec id
  router.delete("/:id", auth.verifyHaveRight, posts.delete);

  app.use("/api/posts", router);
};
