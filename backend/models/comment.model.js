module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define('comments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        required: true
      }
    });
  
    return Comments;
  };