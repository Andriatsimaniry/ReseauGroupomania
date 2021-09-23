// Modèle Sequelize represente la table des Posts dans la base de données
const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      post: {
        type: DataTypes.TEXT('long'),
      },
      like: {  
        type: Sequelize.INTEGER,  
      }      
    });
  
    return Post;
  };