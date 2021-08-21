module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Récupérer toutes l'utilisateur
    router.get("/", user.findAll);
  
    // Mettre à jour utilisateur avec id
    router.put("/:id", user.update);
  
    //Supprimer utilisateur avec id
    router.delete("/:id", user.delete);

  
    app.use('/api/user', router);
  };