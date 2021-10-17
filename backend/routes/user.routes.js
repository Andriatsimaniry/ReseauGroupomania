module.exports = (app) => {
  const auth = require("../middleware/authJwt");
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Récupérer toutes les utilisateurs
  router.get("/", auth.verifyToken, users.findAll);

  // Mettre à jour un utilisateur avec id
  router.put("/:id", auth.verifyToken, users.update);

  //Supprimer un utilisateur avec id
  router.delete("/:id", auth.verifyToken, users.delete);

  app.use("/api/users", router);
};
