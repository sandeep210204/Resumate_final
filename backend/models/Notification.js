const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Notification = sequelize.define('Notification', {
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  type: { 
    type: DataTypes.ENUM('application_submitted', 'status_update', 'new_job_match', 'interview_scheduled', 'message'),
    allowNull: false
  },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  data: { type: DataTypes.JSON }, // Additional data (job ID, application ID, etc.)
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  isEmailSent: { type: DataTypes.BOOLEAN, defaultValue: false },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' }
});

module.exports = Notification;