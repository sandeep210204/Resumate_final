const defaultGoals = [
  {
    id: 1,
    title: 'Complete portfolio website',
    description: 'Design and build a personal portfolio to showcase your projects.',
    priority: 'High',
  },
  {
    id: 2,
    title: 'Practice coding 1 hour/day',
    description: 'Maintain a consistent daily practice streak.',
    priority: 'Medium',
  },
  {
    id: 3,
    title: 'Contribute to open-source',
    description: 'Make at least one meaningful contribution to an open-source project.',
    priority: 'Medium',
  },
];

function mergeGoals(storedGoals) {
  const byTitle = new Map();

  [...defaultGoals, ...(storedGoals || [])].forEach((g) => {
    if (!g || !g.title) return;
    if (!byTitle.has(g.title)) {
      byTitle.set(g.title, g);
    }
  });

  return Array.from(byTitle.values());
}

module.exports = {
  defaultGoals,
  mergeGoals,
};


