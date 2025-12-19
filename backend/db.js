const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for simplicity - creates database file automatically if it doesn't exist
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize;


