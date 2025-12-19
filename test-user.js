// Quick test script to create a user and test functionality
const bcrypt = require('bcryptjs');
const { User } = require('./backend/models');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword
    });
    console.log('Test user created:', user.username);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      console.log('Test user already exists');
    } else {
      console.error('Error:', err.message);
    }
  }
  process.exit(0);
}

createTestUser();