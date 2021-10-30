// Définir le modèle Sequelize de l'utilisateur dans la base de donnée Mysql
// et de permettre Sequelize d'écrire les fonctions CRUD
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    
  });
 

  return User;
};
