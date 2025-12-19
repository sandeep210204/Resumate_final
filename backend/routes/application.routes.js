const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/apply', applicationController.applyToJob);
router.get('/my-applications', applicationController.getMyApplications);
router.get('/:id', applicationController.getApplication);
router.put('/:id/withdraw', applicationController.withdrawApplication);

module.exports = router;