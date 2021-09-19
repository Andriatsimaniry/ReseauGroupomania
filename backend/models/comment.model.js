module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define('comments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      postId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        required: true
      },
      commenterUsername: {
        type: Sequelize.STRING,
        required: true
      },
      commenterEmail: {
        type: Sequelize.STRING,
        required: true
      }
    });
  
    return Comments;
  };