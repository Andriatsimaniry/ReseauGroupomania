// Modèle Sequelize represente la table des Posts dans la base de données

module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("Post", {
      username: {
        type: Sequelize.STRING
      },
      roles: {
        type: Sequelize.STRING,
      },
      post: {
        type: Sequelize.STRING
      }
    });
  
    return Post;
  };