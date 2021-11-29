
module.exports = (app) => {
  const auth = require("../middleware/authJwt");
  const users = require("../controllers/user.controller");
  

  var router = require("express").Router();

  // Récupérer toutes les utilisateurs
  router.get("/", auth.isAdmin, users.findAll);
  
  // Récuperer un utilisateur avec un id
  router.get("/:id", auth.verifyToken, users.findOne);

  // Mettre à jour un utilisateur avec id
 
  router.put("/:id", auth.verifyToken, users.update);

  //Supprimer un utilisateur avec id
  
   router.delete("/:id", auth.verifyHaveRight, users.delete);
 
  
  
   app.use("/api/users", router);
};

