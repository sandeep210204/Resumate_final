const { Company, Job, User } = require('./models');

async function seedDatabase() {
  try {
    // Create sample company
    const company = await Company.findOrCreate({
      where: { name: 'TechCorp Solutions' },
      defaults: {
        description: 'Leading technology solutions provider',
        website: 'https://techcorp.com',
        location: 'San Francisco, CA',
        industry: 'Technology',
        size: 'large',
        isVerified: true
      }
    });

    // Create sample recruiter user
    const recruiter = await User.findOrCreate({
      where: { email: 'recruiter@techcorp.com' },
      defaults: {
        username: 'recruiter',
        password: '$2a$10$example', // In real app, this would be properly hashed
        role: 'recruiter'
      }
    });

    // Create sample jobs
    const jobs = [
      {
        CompanyId: company[0].id,
        PostedBy: recruiter[0].id,
        title: 'Senior Software Engineer',
        description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software applications.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in software development.',
        location: 'San Francisco, CA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 120000,
        salaryMax: 180000,
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        preferredSkills: ['AWS', 'Docker', 'Kubernetes'],
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours'],
        status: 'active'
      },
      {
        CompanyId: company[0].id,
        PostedBy: recruiter[0].id,
        title: 'Frontend Developer',
        description: 'Join our frontend team to build amazing user experiences. You will work with modern technologies and collaborate with designers and backend developers.',
        requirements: '3+ years of frontend development experience. Strong knowledge of React and modern JavaScript.',
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 80000,
        salaryMax: 120000,
        requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'],
        preferredSkills: ['Next.js', 'Tailwind CSS', 'GraphQL'],
        benefits: ['Health Insurance', 'Remote Work', 'Learning Budget'],
        status: 'active'
      },
      {
        CompanyId: company[0].id,
        PostedBy: recruiter[0].id,
        title: 'Data Scientist Intern',
        description: 'Great opportunity for students to gain hands-on experience in data science and machine learning projects.',
        requirements: 'Currently pursuing degree in Data Science, Statistics, or related field.',
        location: 'New York, NY',
        jobType: 'internship',
        experienceLevel: 'entry',
        salaryMin: 25,
        salaryMax: 35,
        requiredSkills: ['Python', 'SQL', 'Statistics', 'Machine Learning'],
        preferredSkills: ['TensorFlow', 'Pandas', 'Jupyter'],
        benefits: ['Mentorship', 'Learning Opportunities', 'Networking'],
        status: 'active'
      }
    ];

    for (const jobData of jobs) {
      await Job.findOrCreate({
        where: { 
          title: jobData.title,
          CompanyId: jobData.CompanyId 
        },
        defaults: jobData
      });
    }

    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

module.exports = { seedDatabase };