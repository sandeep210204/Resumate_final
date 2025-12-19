const { Job, Company, Application, SavedJob, User } = require('../models');
const skillExtractor = require('../services/skillExtractor');
const { Op } = require('sequelize');

// Search jobs with intelligent matching
exports.searchJobs = async (req, res, next) => {
  try {
    const { 
      keywords, location, jobType, experienceLevel, 
      salaryMin, salaryMax, page = 1, limit = 20 
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereClause = { status: 'active' };
    
    // Build search filters
    if (keywords) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${keywords}%` } },
        { description: { [Op.iLike]: `%${keywords}%` } }
      ];
    }
    
    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }
    
    if (jobType) {
      whereClause.jobType = jobType;
    }
    
    if (experienceLevel) {
      whereClause.experienceLevel = experienceLevel;
    }
    
    if (salaryMin) {
      whereClause.salaryMin = { [Op.gte]: parseInt(salaryMin) };
    }
    
    if (salaryMax) {
      whereClause.salaryMax = { [Op.lte]: parseInt(salaryMax) };
    }
    
    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [
        { model: Company, attributes: ['name', 'logo', 'location'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    // Add skill matching if user is authenticated
    let jobsWithMatch = jobs.rows;
    if (req.user) {
      const userResume = await req.user.getResume();
      if (userResume) {
        const userSkills = skillExtractor.extractFromResume(userResume);
        
        jobsWithMatch = jobs.rows.map(job => {
          const matchScore = skillExtractor.calculateMatch(
            userSkills, 
            job.requiredSkills, 
            job.preferredSkills
          );
          return { ...job.toJSON(), matchScore };
        });
        
        // Sort by match score if skills exist
        if (userSkills.length > 0) {
          jobsWithMatch.sort((a, b) => b.matchScore - a.matchScore);
        }
      }
    }
    
    res.json({
      success: true,
      jobs: jobsWithMatch,
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

// Get job details
exports.getJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id, {
      include: [
        { model: Company },
        { model: User, as: 'Recruiter', attributes: ['username'] }
      ]
    });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    // Increment view count
    await job.increment('viewCount');
    
    // Check if user has applied or saved this job
    let hasApplied = false;
    let isSaved = false;
    
    if (req.user) {
      hasApplied = await Application.findOne({
        where: { JobId: id, UserId: req.user.id }
      }) !== null;
      
      isSaved = await SavedJob.findOne({
        where: { JobId: id, UserId: req.user.id }
      }) !== null;
    }
    
    res.json({
      success: true,
      job: { ...job.toJSON(), hasApplied, isSaved }
    });
  } catch (err) {
    next(err);
  }
};

// Save/unsave job
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existingSave = await SavedJob.findOne({
      where: { JobId: id, UserId: req.user.id }
    });
    
    if (existingSave) {
      await existingSave.destroy();
      res.json({ success: true, saved: false });
    } else {
      await SavedJob.create({ JobId: id, UserId: req.user.id });
      res.json({ success: true, saved: true });
    }
  } catch (err) {
    next(err);
  }
};

// Get saved jobs
exports.getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Job,
          include: [{ model: Company, attributes: ['name', 'logo'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, jobs: savedJobs });
  } catch (err) {
    next(err);
  }
};

module.exports = exports;