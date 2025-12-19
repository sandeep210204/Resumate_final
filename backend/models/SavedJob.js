const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SavedJob = sequelize.define('SavedJob', {
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  JobId: { type: DataTypes.INTEGER, allowNull: false },
  notes: { type: DataTypes.TEXT }
});

module.exports = SavedJob;