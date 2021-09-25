// Initialiser Sequelize

const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER,dbConfig.PASSWORD, {
  host:dbConfig.HOST,
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
// le modèle utilisateur peut appartenir à plusieurs Rôles et vice versa.
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.comments.belongsTo(db.posts);
db.comments.belongsTo(db.user);
db.posts.hasMany(db.comments);
db.posts.belongsTo(db.user);
db.user.hasMany(db.posts);
db.user.hasMany(db.comments);

module.exports = db;
