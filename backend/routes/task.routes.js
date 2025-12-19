const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all routes

router.post('/create', taskController.createTask);
router.get('/list', taskController.getTasks);
router.post('/update/:id', taskController.updateTask);
router.post('/reschedule', taskController.rescheduleOverdue);
router.get('/reminders', taskController.getReminders);

module.exports = router;