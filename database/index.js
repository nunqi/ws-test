const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  { dialect: process.env.DATABASE_DIALECT,
    dialectOptions: {connectTimeout: 1000} }
);

module.exports = sequelize;
