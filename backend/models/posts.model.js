// Modèle Sequelize represente la table des Posts dans la base de données
const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("Post", {
      username: {
        type: Sequelize.STRING
      },
      roles: {
        type: Sequelize.STRING,
      },
      post: {
        // type: Sequelize.TEXT('long'),
        type:
        DataTypes.TEXT('tiny') ,
      },
    });
  
    return Post;
  };