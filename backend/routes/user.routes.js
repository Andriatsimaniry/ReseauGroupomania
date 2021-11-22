
module.exports = (app) => {
  const auth = require("../middleware/authJwt");
  const users = require("../controllers/user.controller");

  var router = require("express").Router();

  // Récupérer toutes les utilisateurs
  router.get("/", auth.verifyToken, users.findAll);
  router.get("/:id", auth.verifyToken, users.findAll);

  // Mettre à jour un utilisateur avec id
 
  router.put("/:id", auth.verifyAdminToken, users.update);

  //Supprimer un utilisateur avec id
  
   router.delete("/:id", auth.verifyAdminToken, users.delete);
 

  app.use("/api/users", router);
};
