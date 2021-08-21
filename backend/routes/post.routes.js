module.exports = app => {
    const posts = require("../controllers/post.controllers.js");
  
    var router = require("express").Router();
  
    // Créer une nouvelle publication
    router.post("/", posts.create);
  
    // Récupérer toutes les publications
    router.get("/", posts.findAll);
  
    // Mettre à jour une publication avec id
    router.put("/:id", posts.update);
  
    //Supprimer une publication avec id
    router.delete("/:id", posts.delete);

  
    app.use('/api/posts', router);
  };