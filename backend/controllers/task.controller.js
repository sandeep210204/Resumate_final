const Task = require('../models/Task');
const User = require('../models/User');
const {Op} = require('sequelize');

// --- Task Module Functions ---
exports.createTask = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { title, description, deadline, priority } = req.body;
    const task = await Task.create({
      UserId: req.user.id,
      title, description, deadline, priority
    });
    res.json({ success: true, task });
  } catch (err) { next(err); }
};

exports.getTasks = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const tasks = await Task.findAll({ where: { UserId: req.user.id }, order: [['deadline', 'ASC']] });
    res.json({ success: true, tasks });
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const { id } = req.params;
    const updated = await Task.update(req.body, { where: { id, UserId: req.user.id } });
    res.json({ success: true, updated });
  } catch (err) { next(err); }
};

// --- Adaptive Scheduler Functions (Task 5) ---

// 1. Reschedule Pending: Moves overdue tasks to "Tomorrow"
exports.rescheduleOverdue = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await Task.update(
      { deadline: tomorrow },
      { 
        where: { 
          UserId: req.user.id, 
          status: 'pending', 
          deadline: { [Op.lt]: now }
        } 
      }
    );
    res.json({ success: true, message: `Rescheduled ${result[0]} tasks to tomorrow.` });
  } catch (err) { next(err); }
};

// 2. Reminders: Logic to find tasks due within 24 hours
exports.getReminders = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const tasks = await Task.findAll({
      where: {
        UserId: req.user.id,
        status: 'pending',
        deadline: { [Op.between]: [now, next24h] }
      }
    });
    
    const messages = tasks.map(t => `Reminder: "${t.title}" is due soon!`);
    res.json({ success: true, reminders: messages });
  } catch (err) { next(err); }
};