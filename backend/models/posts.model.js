// Modèle Sequelize represente la table des Posts dans la base de données
const { user } = require(".");
module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      post: {
        type: Sequelize.TEXT('long'),
      },
      like: {  
        type: Sequelize.INTEGER,
        default:0,  
      },  
      dislike: {
        type: Sequelize.INTEGER,
        default:0,
      },
      img: {  
        type: Sequelize.STRING
      } 
    });

  
    return Post;
  };