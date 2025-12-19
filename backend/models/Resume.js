const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Resume = sequelize.define('Resume', {
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  experience: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  education: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  projects: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
});

module.exports = Resume;


