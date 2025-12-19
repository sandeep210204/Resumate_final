const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./db');
const { User, Resume, Progress, Task } = require('./models'); // Loads relations

const authRoutes = require('./routes/auth.routes');
const resumeRoutes = require('./routes/resume.routes');
const progressRoutes = require('./routes/progress.routes');
const taskRoutes = require('./routes/task.routes');
const recRoutes = require('./routes/recommendation.routes');
const contentRoutes = require('./routes/content.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const recruiterRoutes = require('./routes/recruiter.routes');
const errorHandler = require('./utils/errorHandler');

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend as static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/recommendations', recRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/recruiter', recruiterRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'ResuMate' });
});

// Centralized error handler
app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    // Add certifications column if it doesn't exist
    try {
      await sequelize.getQueryInterface().addColumn('Resumes', 'certifications', {
        type: require('sequelize').DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      });
    } catch (err) {
      // Column already exists, ignore error
    }
    
    await sequelize.sync(); // Create tables if they don't exist
    console.log('Database synced.');
    
    // Seed sample data for testing
    const { seedDatabase } = require('./seedData');
    await seedDatabase();
    
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();


