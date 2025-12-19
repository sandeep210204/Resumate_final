const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Job = sequelize.define('Job', {
  CompanyId: { type: DataTypes.INTEGER, allowNull: false },
  PostedBy: { type: DataTypes.INTEGER, allowNull: false }, // Recruiter User ID
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  requirements: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING, allowNull: false },
  jobType: { type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship'), defaultValue: 'full-time' },
  experienceLevel: { type: DataTypes.ENUM('entry', 'mid', 'senior', 'executive'), defaultValue: 'mid' },
  salaryMin: { type: DataTypes.INTEGER },
  salaryMax: { type: DataTypes.INTEGER },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  requiredSkills: { type: DataTypes.JSON, defaultValue: [] },
  preferredSkills: { type: DataTypes.JSON, defaultValue: [] },
  benefits: { type: DataTypes.JSON, defaultValue: [] },
  status: { type: DataTypes.ENUM('draft', 'active', 'paused', 'closed'), defaultValue: 'draft' },
  applicationDeadline: { type: DataTypes.DATE },
  applicationCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  viewCount: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Job;