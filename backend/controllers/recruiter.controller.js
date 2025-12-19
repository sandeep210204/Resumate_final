const { Job, Company, Application, User } = require('../models');
const skillExtractor = require('../services/skillExtractor');
const notificationService = require('../services/notificationService');
const { Op } = require('sequelize');

// Post new job
exports.postJob = async (req, res, next) => {
  try {
    const {
      companyId, title, description, requirements, location,
      jobType, experienceLevel, salaryMin, salaryMax, currency,
      requiredSkills, preferredSkills, benefits, applicationDeadline
    } = req.body;
    
    // Verify company exists and user has access
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    const job = await Job.create({
      CompanyId: companyId,
      PostedBy: req.user.id,
      title, description, requirements, location,
      jobType, experienceLevel, salaryMin, salaryMax, currency,
      requiredSkills: requiredSkills || [],
      preferredSkills: preferredSkills || [],
      benefits: benefits || [],
      applicationDeadline,
      status: 'active'
    });
    
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// Get recruiter's jobs
exports.getMyJobs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = { PostedBy: req.user.id };
    if (status) {
      whereClause.status = status;
    }
    
    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [{ model: Company, attributes: ['name', 'logo'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    res.json({
      success: true,
      jobs: jobs.rows,
      pagination: {
        total: jobs.count,
        page: parseInt(page),
        pages: Math.ceil(jobs.count / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get applications for recruiter's jobs
exports.getApplications = async (req, res, next) => {
  try {
    const { jobId, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    if (jobId) whereClause.JobId = jobId;
    if (status) whereClause.status = status;
    
    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          where: { PostedBy: req.user.id },
          include: [{ model: Company, attributes: ['name'] }]
        },
        {
          model: User,
          attributes: ['username', 'email']
        }
      ],
      order: [['skillMatchScore', 'DESC'], ['appliedAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    res.json({
      success: true,
      applications: applications.rows,
      pagination: {
        total: applications.count,
        page: parseInt(page),
        pages: Math.ceil(applications.count / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, recruiterNotes, rejectionReason, interviewDate } = req.body;
    
    const application = await Application.findOne({
      where: { id },
      include: [
        {
          model: Job,
          where: { PostedBy: req.user.id }
        },
        { model: User }
      ]
    });
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    const updateData = {
      status,
      lastStatusUpdate: new Date(),
      statusUpdatedBy: req.user.id
    };
    
    if (recruiterNotes) updateData.recruiterNotes = recruiterNotes;
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    if (interviewDate) updateData.interviewDate = interviewDate;
    
    await application.update(updateData);
    
    // Send notification to job seeker
    await notificationService.sendStatusUpdateNotification(
      application.User,
      application.Job,
      status,
      recruiterNotes
    );
    
    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

// Search candidates
exports.searchCandidates = async (req, res, next) => {
  try {
    const { skills, experience, location, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get all users with resumes
    const users = await User.findAndCountAll({
      include: [
        {
          model: require('../models').Resume,
          required: true
        }
      ],
      limit: parseInt(limit),
      offset
    });
    
    let candidates = users.rows.map(user => {
      const userSkills = skillExtractor.extractFromResume(user.Resume);
      let matchScore = 0;
      
      if (skills) {
        const searchSkills = skills.split(',').map(s => s.trim());
        matchScore = skillExtractor.calculateMatch(userSkills, searchSkills);
      }
      
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        skills: userSkills,
        experience: user.Resume.experience || [],
        matchScore
      };
    });
    
    // Filter and sort by match score if skills provided
    if (skills) {
      candidates = candidates
        .filter(c => c.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
    }
    
    res.json({
      success: true,
      candidates,
      pagination: {
        total: users.count,
        page: parseInt(page),
        pages: Math.ceil(users.count / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get job analytics
exports.getJobAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findOne({
      where: { id, PostedBy: req.user.id }
    });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    const analytics = await Application.findAll({
      where: { JobId: id },
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', '*'), 'count']
      ],
      group: ['status']
    });
    
    const statusCounts = {};
    analytics.forEach(item => {
      statusCounts[item.status] = parseInt(item.get('count'));
    });
    
    res.json({
      success: true,
      analytics: {
        totalApplications: job.applicationCount,
        totalViews: job.viewCount,
        statusBreakdown: statusCounts
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = exports;