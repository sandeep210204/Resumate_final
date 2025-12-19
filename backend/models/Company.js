const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Company = sequelize.define('Company', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  website: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  industry: { type: DataTypes.STRING },
  size: { type: DataTypes.STRING }, // startup, small, medium, large
  logo: { type: DataTypes.STRING },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Company;