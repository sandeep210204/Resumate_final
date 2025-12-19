const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/search', jobController.searchJobs);
router.get('/:id', jobController.getJob);

// Protected routes
router.use(authMiddleware);
router.post('/:id/save', jobController.toggleSaveJob);
router.get('/saved/list', jobController.getSavedJobs);

module.exports = router;