const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all progress routes

router.get('/get', progressController.getProgress);
router.post('/update', progressController.updateProgress);
router.get('/goals', progressController.getGoals);
router.get('/quotes', progressController.getQuotes);

module.exports = router;


