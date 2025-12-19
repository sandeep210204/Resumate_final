const Progress = require('../models/Progress');
const User = require('../models/User');
const { mergeGoals } = require('../services/goalsService');
const { getTodayQuote, getRandomQuotes } = require('../services/quotesService');

// Helper to get progress specific to the logged-in user
async function getOrCreateProgress(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  let progress = await Progress.findOne({ where: { UserId: userId } });
  if (!progress) {
    progress = await Progress.create({ UserId: userId });
  }
  return progress;
}

exports.getProgress = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const progress = await getOrCreateProgress(req.user.id);
    res.json({ success: true, progress });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(err);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const { tasksCompleted, tasksTotal, skillsProgress, streak, goals } = req.body;
    const progress = await getOrCreateProgress(req.user.id);

    if (typeof tasksCompleted === 'number') progress.tasksCompleted = tasksCompleted;
    if (typeof tasksTotal === 'number') progress.tasksTotal = tasksTotal;
    if (typeof streak === 'number') progress.streak = streak;
    if (Array.isArray(skillsProgress)) progress.skillsProgress = skillsProgress;
    if (Array.isArray(goals)) progress.goals = goals;

    await progress.save();
    res.json({ success: true, progress });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(err);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const progress = await getOrCreateProgress(req.user.id);
    const merged = mergeGoals(progress.goals || []);
    res.json({ success: true, goals: merged });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(err);
  }
};

exports.getQuotes = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const progress = await getOrCreateProgress(req.user.id);
    const todayQuote = getTodayQuote();
    const randomQuotes = getRandomQuotes(3);
    progress.dailyQuotes = randomQuotes;
    await progress.save();
    res.json({ success: true, today: todayQuote, list: randomQuotes });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(err);
  }
};


