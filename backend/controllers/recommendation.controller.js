const Resume = require('../models/Resume');
const Progress = require('../models/Progress');

exports.getRecommendations = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ where: { UserId: req.user.id } });
    const progress = await Progress.findOne({ where: { UserId: req.user.id } });
    
    const recommendations = [];

    // 1. Template Suggestion
    const skills = resume?.skills || [];
    if (skills.some(s => ['React', 'Design', 'CSS', 'Figma'].includes(s.name || s))) {
      recommendations.push({ type: 'Template', text: 'Based on your design skills, try the "Creative" template.' });
    } else if (skills.length > 5) {
      recommendations.push({ type: 'Template', text: 'You have many skills listed. The "Modern" template handles dense data well.' });
    }

    // 2. Skill Improvements
    if (resume?.summary && resume.summary.length < 50) {
      recommendations.push({ type: 'Improvement', text: 'Your summary is quite short. Aim for 3-4 lines describing your core value.' });
    }

    // 3. Keyword/Streak Suggestions
    if (progress && progress.streak < 3) {
      recommendations.push({ type: 'Habit', text: 'Consistency is key! Try to log in 3 days in a row to boost your momentum.' });
    }

    res.json({ success: true, recommendations });
  } catch (err) {
    next(err);
  }
};