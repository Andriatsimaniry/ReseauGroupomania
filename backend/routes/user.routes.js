module.exports = app => {
  const auth = require ("../middleware/authJwt");
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Récupérer toutes l'utilisateur
    router.get("/", auth.verifyToken, user.findAll);
  
    // Mettre à jour utilisateur avec id
    router.put("/:id", auth.verifyToken, user.update);
  
    //Supprimer utilisateur avec id
    router.delete("/:id", auth.verifyToken, user.delete);

  
    app.use('/api/user', auth.verifyToken, router);
  };