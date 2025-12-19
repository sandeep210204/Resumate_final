const User = require('./User');
const Resume = require('./Resume');
const Progress = require('./Progress');
const Task = require('./Task');
const Company = require('./Company');
const Job = require('./Job');
const Application = require('./Application');
const Notification = require('./Notification');
const SavedJob = require('./SavedJob');

// Existing Relationships
User.hasOne(Resume);
Resume.belongsTo(User);

User.hasOne(Progress);
Progress.belongsTo(User);

User.hasMany(Task);
Task.belongsTo(User);

// New Job Portal Relationships
Company.hasMany(Job);
Job.belongsTo(Company);

User.hasMany(Job, { foreignKey: 'PostedBy', as: 'PostedJobs' });
Job.belongsTo(User, { foreignKey: 'PostedBy', as: 'Recruiter' });

User.hasMany(Application);
Application.belongsTo(User);

Job.hasMany(Application);
Application.belongsTo(Job);

User.hasMany(Notification);
Notification.belongsTo(User);

User.hasMany(SavedJob);
SavedJob.belongsTo(User);

Job.hasMany(SavedJob);
SavedJob.belongsTo(Job);

module.exports = { User, Resume, Progress, Task, Company, Job, Application, Notification, SavedJob };