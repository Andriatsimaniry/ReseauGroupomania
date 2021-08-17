module.exports = app => {
    const posts = require("../controllers/post.controllers.js");
  
    var router = require("express").Router();
  
    // Créer une nouvelle publication
    router.post("/", posts.create);
  
    // Récupérer toutes les publications
    router.get("/", posts.findAll);
  
    // Récupérer toutes les publications publiées
    router.get("/published", posts.findAllPublished);
  
    // Récupérer une seule publication avec id
    router.get("/:id", posts.findOne);
  
    // Mettre à jour une publication avec id
    router.put("/:id", posts.update);
  
    //Supprimer une publication avec id
    router.delete("/:id", posts.delete);
  
    // // supprimer toutes les publications
    // router.delete("/", posts.deleteAll);
  
    app.use('/api/posts', router);
  };