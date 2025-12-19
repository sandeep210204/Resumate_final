const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiter.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Job management
router.post('/jobs', recruiterController.postJob);
router.get('/jobs', recruiterController.getMyJobs);
router.get('/jobs/:id/analytics', recruiterController.getJobAnalytics);

// Application management
router.get('/applications', recruiterController.getApplications);
router.put('/applications/:id/status', recruiterController.updateApplicationStatus);

// Candidate search
router.get('/candidates/search', recruiterController.searchCandidates);

module.exports = router;