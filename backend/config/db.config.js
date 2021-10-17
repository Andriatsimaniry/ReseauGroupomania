// Configuration la ba base de donées Mysql
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "1234",
  DB: "groupomania",
  dialect: "mysql",
  pool: {
    max: 5, // nombre maximum de connexion dans le pool
    min: 0, //nombre minimum de connexion dans le pool
    acquire: 30000, //Durée maximale, en millisecondes,
    //pendant lequel ce pool essaiera d'obtenir avant de lancer une erreur
    idle: 10000, //temps maximale,en millisecondes,pendant laquelle
    //une connection peut être inactive avant d'être libérée
  },
};
