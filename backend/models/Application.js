const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Application = sequelize.define('Application', {
  JobId: { type: DataTypes.INTEGER, allowNull: false },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  resumeData: { type: DataTypes.JSON }, // Snapshot of resume at application time
  coverLetter: { type: DataTypes.TEXT },
  status: { 
    type: DataTypes.ENUM('submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'offered', 'hired', 'rejected'),
    defaultValue: 'submitted'
  },
  skillMatchScore: { type: DataTypes.INTEGER }, // 0-100 percentage
  recruiterNotes: { type: DataTypes.TEXT },
  rejectionReason: { type: DataTypes.TEXT },
  interviewDate: { type: DataTypes.DATE },
  interviewNotes: { type: DataTypes.TEXT },
  appliedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  lastStatusUpdate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  statusUpdatedBy: { type: DataTypes.INTEGER } // Recruiter who updated status
});

module.exports = Application;