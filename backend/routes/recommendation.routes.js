const express = require('express');
const router = express.Router();
const recController = require('../controllers/recommendation.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, recController.getRecommendations);

module.exports = router;