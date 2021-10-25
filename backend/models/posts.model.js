// Modèle Sequelize represente la table des Posts dans la base de données
const { user } = require(".");

module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    post: {
      type: Sequelize.TEXT("long"),
    },
    likes: {
      type: Sequelize.STRING,
      get() {
        return this.getDataValue("likes")
          ? this.getDataValue("likes").split(";")
          : [];
      },
      set(val) {
        this.setDataValue("likes", val.join(";"));
      },
    },
    dislikes: {
      type: Sequelize.STRING,
      get() {
        return this.getDataValue("dislikes")
          ? this.getDataValue("dislikes").split(";")
          : [];
      },
      set(val) {
        this.setDataValue("dislikes", val.join(";"));
      },
    },
    img: {
      type: Sequelize.STRING,
    },
  });

  return Post;
};
