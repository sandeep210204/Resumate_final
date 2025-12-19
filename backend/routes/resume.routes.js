const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect these routes

router.post('/save', resumeController.saveResume);
router.get('/get', resumeController.getResume);
router.post('/generate-pdf', resumeController.generatePdf);

module.exports = router;


