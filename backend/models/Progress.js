const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Progress = sequelize.define('Progress', {
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  tasksCompleted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  tasksTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  skillsProgress: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  streak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  goals: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  dailyQuotes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
});

module.exports = Progress;


