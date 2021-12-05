
module.exports = (app) => {
  const auth = require("../middleware/authJwt");
  const users = require("../controllers/user.controller");
  

  var router = require("express").Router();

  // Récupérer toutes les utilisateurs
  router.get("/", auth.isAdmin, users.findAll);
  
  // Récuperer un utilisateur avec un id
  router.get("/:id", auth.verifyToken, users.findOne);


  //Supprimer un utilisateur avec id
  
   router.delete("/:id", auth.verifyHaveRight, users.delete);

  //  Modifier le mot de passe d'un utilisateur
 
  router.put("/:id/changepassword", auth.verifyToken, users.changePassword )
  
  
   app.use("/api/users", router);
};

