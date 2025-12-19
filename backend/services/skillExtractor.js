// Skill extraction and matching service
class SkillExtractor {
  constructor() {
    // Common technical skills database
    this.skillsDatabase = {
      programming: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'],
      frontend: ['React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'TypeScript', 'jQuery', 'Bootstrap', 'Tailwind'],
      backend: ['Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails', 'ASP.NET'],
      databases: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server'],
      cloud: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'],
      tools: ['Git', 'Jenkins', 'Jira', 'Postman', 'VS Code', 'IntelliJ'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Project Management']
    };
    
    this.allSkills = Object.values(this.skillsDatabase).flat();
  }

  // Extract skills from resume data
  extractFromResume(resume) {
    const extractedSkills = new Set();
    
    // Extract from skills section
    if (resume.skills) {
      if (Array.isArray(resume.skills)) {
        resume.skills.forEach(skill => extractedSkills.add(skill));
      } else if (typeof resume.skills === 'object') {
        Object.values(resume.skills).forEach(skillList => {
          if (Array.isArray(skillList)) {
            skillList.forEach(skill => extractedSkills.add(skill));
          }
        });
      }
    }
    
    // Extract from experience descriptions
    if (resume.experience) {
      resume.experience.forEach(exp => {
        if (exp.achievements) {
          exp.achievements.forEach(achievement => {
            this.extractFromText(achievement).forEach(skill => extractedSkills.add(skill));
          });
        }
      });
    }
    
    // Extract from projects
    if (resume.projects) {
      resume.projects.forEach(project => {
        if (project.technologies) {
          const techs = Array.isArray(project.technologies) ? project.technologies : [project.technologies];
          techs.forEach(tech => extractedSkills.add(tech));
        }
        if (project.description) {
          this.extractFromText(project.description).forEach(skill => extractedSkills.add(skill));
        }
      });
    }
    
    return Array.from(extractedSkills);
  }
  
  // Extract skills from text using keyword matching
  extractFromText(text) {
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    this.allSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    
    return foundSkills;
  }
  
  // Calculate skill match percentage between candidate and job
  calculateMatch(candidateSkills, jobRequiredSkills, jobPreferredSkills = []) {
    if (!candidateSkills.length || !jobRequiredSkills.length) return 0;
    
    const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));
    
    // Required skills matching (70% weight)
    const requiredMatches = jobRequiredSkills.filter(skill => 
      candidateSet.has(skill.toLowerCase())
    ).length;
    const requiredScore = (requiredMatches / jobRequiredSkills.length) * 70;
    
    // Preferred skills matching (30% weight)
    let preferredScore = 0;
    if (jobPreferredSkills.length > 0) {
      const preferredMatches = jobPreferredSkills.filter(skill => 
        candidateSet.has(skill.toLowerCase())
      ).length;
      preferredScore = (preferredMatches / jobPreferredSkills.length) * 30;
    }
    
    return Math.round(requiredScore + preferredScore);
  }
  
  // Get skill suggestions based on current skills
  getSuggestions(currentSkills) {
    const suggestions = [];
    const currentSet = new Set(currentSkills.map(s => s.toLowerCase()));
    
    // Suggest complementary skills
    Object.entries(this.skillsDatabase).forEach(([category, skills]) => {
      const hasSkillInCategory = skills.some(skill => currentSet.has(skill.toLowerCase()));
      if (hasSkillInCategory) {
        skills.forEach(skill => {
          if (!currentSet.has(skill.toLowerCase())) {
            suggestions.push({ skill, category, reason: `Complements your ${category} skills` });
          }
        });
      }
    });
    
    return suggestions.slice(0, 10); // Return top 10 suggestions
  }
}

module.exports = new SkillExtractor();