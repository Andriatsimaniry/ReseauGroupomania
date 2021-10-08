// Obtenir des ressources publiques et protégées
// module.exports = app => {
  const { authJwt } = require ("../middleware");
  const controller = require("../controllers/user.controller.js");
  
  module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    
  
    // Récupérer toutes l'utilisateur
    
    app.get("/api/user", [authJwt.verifyToken] ,controller.userBoard
    );
  
    // Mettre à jour utilisateur avec id
    // router.put("/:id", authJwt.verifyToken, user.update);
  
    //Supprimer utilisateur avec id
    // router.delete("/:id", authJwt.verifyToken, user.delete);
    app.get(
      "/api/admin",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.adminBoard
    );
  };