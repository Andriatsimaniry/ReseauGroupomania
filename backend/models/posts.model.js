// Modèle Sequelize represente la table des Posts dans la base de données

module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("Post", {
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Post;
  };