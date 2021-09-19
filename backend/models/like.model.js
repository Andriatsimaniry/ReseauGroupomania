const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define(
    "like",
    {
      postsId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    }
  );
  Like.associate = function (models) {
    // association n'est pas définie
  };
  return Like;
};
