// Initialiser Sequelize

const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.posts = require("./posts.model.js")(sequelize, Sequelize);
db.images = require("./image.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);

// les rôles est une relation plusieurs-à-plusieurs

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  //Le modèle utilisateur peut appartenir à plusieurs Rôles et vice versa
  through: "user_roles", //Une nouvelle table  user_roles, connexion entre les utilisateurs et la table des rôles
  foreignKey: "userId", //clé primaire en tant que clé étrangère
  otherKey: "roleId",
});
db.user.hasOne(db.posts); // Un post n'appartient qu'un utilisateur
db.posts.belongsTo(db.user);
db.posts.hasMany(db.comments); // Un post a plusieurs commentaires
db.comments.belongsTo(db.posts);
db.user.hasOne(db.comments); //un commentaire n'appartient qu'un utilisateur
db.comments.belongsTo(db.user);
db.user.hasOne(db.images);
db.images.belongsTo(db.user);
db.posts.hasOne(db.images); // Un post a une seul image
db.images.belongsTo(db.posts);





db.ROLES = ["user", "admin"];

module.exports = db;
