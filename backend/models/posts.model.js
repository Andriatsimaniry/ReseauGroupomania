// Modèle Sequelize represente la table des Posts dans la base de données
const { DataTypes } = require("sequelize");
const { user } = require(".");
module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      username: {  
        type: Sequelize.STRING, 
        name: user, 
      },  
      post: {
        type: DataTypes.TEXT('long'),
      },
      like: {  
        type: Sequelize.INTEGER,
        default:0,  
      },  
      dislike: {
        type: Sequelize.INTEGER,
        default:0,
      },
      
      
      
    });

  
    return Post;
  };