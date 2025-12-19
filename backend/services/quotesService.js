const quotes = [
  {
    text: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
  },
  {
    text: 'The future depends on what you do today.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'Opportunities don’t happen, you create them.',
    author: 'Chris Grosser',
  },
  {
    text: 'Your resume is a story of where you’ve been and where you’re going.',
    author: 'Unknown',
  },
  {
    text: 'Discipline is the bridge between goals and accomplishment.',
    author: 'Jim Rohn',
  },
];

function getTodayQuote() {
  const index = new Date().getDate() % quotes.length;
  return quotes[index];
}

function getRandomQuotes(limit = 3) {
  const shuffled = [...quotes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

module.exports = {
  getTodayQuote,
  getRandomQuotes,
};


