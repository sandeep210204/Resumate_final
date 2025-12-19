const { Application, Job, Company, User, Notification } = require('../models');
const skillExtractor = require('../services/skillExtractor');
const notificationService = require('../services/notificationService');

// Apply to job
exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;
    
    // Check if job exists and is active
    const job = await Job.findOne({
      where: { id: jobId, status: 'active' },
      include: [{ model: Company }]
    });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or no longer active' });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      where: { JobId: jobId, UserId: req.user.id }
    });
    
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }
    
    // Get user's resume
    const user = await User.findByPk(req.user.id);
    const userResume = await user.getResume();
    if (!userResume) {
      return res.status(400).json({ success: false, message: 'Please create a resume first' });
    }
    
    // Calculate skill match score
    const userSkills = skillExtractor.extractFromResume(userResume);
    const skillMatchScore = skillExtractor.calculateMatch(
      userSkills, 
      job.requiredSkills, 
      job.preferredSkills
    );
    
    // Create application with resume snapshot
    const application = await Application.create({
      JobId: jobId,
      UserId: req.user.id,
      resumeData: userResume.toJSON(), // Snapshot of resume at application time
      coverLetter,
      skillMatchScore
    });
    
    // Update job application count
    await job.increment('applicationCount');
    
    // Send notifications
    await notificationService.sendApplicationNotification(req.user.id, job, 'submitted');
    
    res.json({ success: true, application, skillMatchScore });
  } catch (err) {
    next(err);
  }
};

// Get user's applications
exports.getMyApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = { UserId: req.user.id };
    if (status) {
      whereClause.status = status;
    }
    
    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          include: [{ model: Company, attributes: ['name', 'logo'] }],
          attributes: ['title', 'location', 'jobType', 'status']
        }
      ],
      order: [['appliedAt', 'DESC']],
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

// Get application details
exports.getApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findOne({
      where: { id, UserId: req.user.id },
      include: [
        {
          model: Job,
          include: [
            { model: Company },
            { model: User, as: 'Recruiter', attributes: ['username', 'email'] }
          ]
        }
      ]
    });
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

// Withdraw application
exports.withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findOne({
      where: { id, UserId: req.user.id }
    });
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    if (['hired', 'rejected'].includes(application.status)) {
      return res.status(400).json({ success: false, message: 'Cannot withdraw completed application' });
    }
    
    await application.update({ status: 'withdrawn' });
    
    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = exports;