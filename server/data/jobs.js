const jobs = [
  {
    id: 'J001',
    jobTitle: 'Junior Full Stack Developer',
    company: 'TechCorp India',
    jobType: 'Full Time',
    location: 'Bangalore, India',
    minScore: 50,
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    domainRequirements: {
      technical: 60,
      aptitude: 40,
      communication: 40,
      domainKnowledge: 50,
      softSkills: 40
    }
  },
  {
    id: 'J002',
    jobTitle: 'Frontend Developer',
    company: 'Webify Solutions',
    jobType: 'Full Time',
    location: 'Pune, India',
    minScore: 45,
    requiredSkills: ['JavaScript', 'React', 'HTML/CSS', 'TypeScript'],
    domainRequirements: {
      technical: 55,
      aptitude: 35,
      communication: 45,
      domainKnowledge: 45,
      softSkills: 40
    }
  },
  {
    id: 'J003',
    jobTitle: 'Backend Developer',
    company: 'DataFlow Systems',
    jobType: 'Full Time',
    location: 'Hyderabad, India',
    minScore: 50,
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'SQL'],
    domainRequirements: {
      technical: 65,
      aptitude: 50,
      communication: 35,
      domainKnowledge: 55,
      softSkills: 35
    }
  },
  {
    id: 'J004',
    jobTitle: 'React Developer',
    company: 'UIX Labs',
    jobType: 'Full Time',
    location: 'Chennai, India',
    minScore: 45,
    requiredSkills: ['React', 'JavaScript', 'HTML/CSS', 'Redux'],
    domainRequirements: {
      technical: 55,
      aptitude: 35,
      communication: 40,
      domainKnowledge: 45,
      softSkills: 40
    }
  },
  {
    id: 'J005',
    jobTitle: 'Python Developer',
    company: 'AI Ventures',
    jobType: 'Full Time',
    location: 'Mumbai, India',
    minScore: 55,
    requiredSkills: ['Python', 'SQL', 'Git', 'Machine Learning'],
    domainRequirements: {
      technical: 65,
      aptitude: 55,
      communication: 35,
      domainKnowledge: 60,
      softSkills: 35
    }
  },
  {
    id: 'J006',
    jobTitle: 'Software Engineer Trainee',
    company: 'Infosys',
    jobType: 'Full Time',
    location: 'Multiple Locations',
    minScore: 40,
    requiredSkills: ['Java', 'SQL', 'Git'],
    domainRequirements: {
      technical: 45,
      aptitude: 50,
      communication: 50,
      domainKnowledge: 40,
      softSkills: 50
    }
  },
  {
    id: 'J007',
    jobTitle: 'Associate Software Developer',
    company: 'Wipro',
    jobType: 'Full Time',
    location: 'Multiple Locations',
    minScore: 40,
    requiredSkills: ['Java', 'C++', 'SQL', 'Git'],
    domainRequirements: {
      technical: 45,
      aptitude: 50,
      communication: 45,
      domainKnowledge: 40,
      softSkills: 50
    }
  },
  {
    id: 'J008',
    jobTitle: 'MERN Stack Developer',
    company: 'Startup Hub',
    jobType: 'Full Time',
    location: 'Remote',
    minScore: 55,
    requiredSkills: ['MongoDB', 'Express', 'React', 'Node.js'],
    domainRequirements: {
      technical: 65,
      aptitude: 45,
      communication: 40,
      domainKnowledge: 60,
      softSkills: 40
    }
  },
  {
    id: 'J009',
    jobTitle: 'DevOps Engineer Junior',
    company: 'CloudNine Tech',
    jobType: 'Full Time',
    location: 'Bangalore, India',
    minScore: 55,
    requiredSkills: ['Docker', 'AWS', 'Git', 'Python'],
    domainRequirements: {
      technical: 65,
      aptitude: 50,
      communication: 40,
      domainKnowledge: 60,
      softSkills: 35
    }
  },
  {
    id: 'J010',
    jobTitle: 'Junior Data Scientist',
    company: 'Analytics Pro',
    jobType: 'Full Time',
    location: 'Hyderabad, India',
    minScore: 60,
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Git'],
    domainRequirements: {
      technical: 70,
      aptitude: 65,
      communication: 40,
      domainKnowledge: 65,
      softSkills: 35
    }
  },
  {
    id: 'J011',
    jobTitle: 'Web Developer Intern',
    company: 'Creative Minds',
    jobType: 'Internship',
    location: 'Remote',
    minScore: 30,
    requiredSkills: ['HTML/CSS', 'JavaScript', 'Git'],
    domainRequirements: {
      technical: 35,
      aptitude: 30,
      communication: 40,
      domainKnowledge: 30,
      softSkills: 40
    }
  },
  {
    id: 'J012',
    jobTitle: 'Full Stack Intern',
    company: 'NextGen Solutions',
    jobType: 'Internship',
    location: 'Pune, India',
    minScore: 35,
    requiredSkills: ['JavaScript', 'React', 'Node.js'],
    domainRequirements: {
      technical: 40,
      aptitude: 35,
      communication: 40,
      domainKnowledge: 35,
      softSkills: 40
    }
  },
  {
    id: 'J013',
    jobTitle: 'Java Developer',
    company: 'Enterprise Solutions',
    jobType: 'Full Time',
    location: 'Chennai, India',
    minScore: 55,
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Git'],
    domainRequirements: {
      technical: 65,
      aptitude: 50,
      communication: 40,
      domainKnowledge: 60,
      softSkills: 40
    }
  },
  {
    id: 'J014',
    jobTitle: 'UI/UX Developer',
    company: 'Design Studio',
    jobType: 'Full Time',
    location: 'Mumbai, India',
    minScore: 45,
    requiredSkills: ['HTML/CSS', 'JavaScript', 'React'],
    domainRequirements: {
      technical: 50,
      aptitude: 35,
      communication: 55,
      domainKnowledge: 45,
      softSkills: 55
    }
  },
  {
    id: 'J015',
    jobTitle: 'Cloud Engineer Junior',
    company: 'AWS Partner Firm',
    jobType: 'Full Time',
    location: 'Bangalore, India',
    minScore: 60,
    requiredSkills: ['AWS', 'Docker', 'Python', 'Git'],
    domainRequirements: {
      technical: 70,
      aptitude: 55,
      communication: 40,
      domainKnowledge: 65,
      softSkills: 35
    }
  },
  {
    id: 'J016',
    jobTitle: 'Node.js Developer',
    company: 'API First',
    jobType: 'Full Time',
    location: 'Remote',
    minScore: 50,
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    domainRequirements: {
      technical: 60,
      aptitude: 45,
      communication: 35,
      domainKnowledge: 55,
      softSkills: 35
    }
  },
  {
    id: 'J017',
    jobTitle: 'Graduate Trainee Engineer',
    company: 'TCS',
    jobType: 'Full Time',
    location: 'Multiple Locations',
    minScore: 35,
    requiredSkills: ['Java', 'SQL', 'Git'],
    domainRequirements: {
      technical: 40,
      aptitude: 55,
      communication: 55,
      domainKnowledge: 35,
      softSkills: 55
    }
  },
  {
    id: 'J018',
    jobTitle: 'TypeScript Developer',
    company: 'FinTech Labs',
    jobType: 'Full Time',
    location: 'Hyderabad, India',
    minScore: 55,
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'SQL'],
    domainRequirements: {
      technical: 65,
      aptitude: 45,
      communication: 40,
      domainKnowledge: 55,
      softSkills: 40
    }
  },
  {
    id: 'J019',
    jobTitle: 'Database Developer',
    company: 'DataCore Systems',
    jobType: 'Full Time',
    location: 'Pune, India',
    minScore: 50,
    requiredSkills: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB'],
    domainRequirements: {
      technical: 60,
      aptitude: 55,
      communication: 35,
      domainKnowledge: 60,
      softSkills: 35
    }
  },
  {
    id: 'J020',
    jobTitle: 'React Native Developer',
    company: 'MobileFirst',
    jobType: 'Full Time',
    location: 'Remote',
    minScore: 55,
    requiredSkills: ['React', 'JavaScript', 'TypeScript'],
    domainRequirements: {
      technical: 65,
      aptitude: 40,
      communication: 40,
      domainKnowledge: 55,
      softSkills: 40
    }
  },
  {
    id: 'J021',
    jobTitle: 'ML Engineer Intern',
    company: 'AI Research Lab',
    jobType: 'Internship',
    location: 'Bangalore, India',
    minScore: 50,
    requiredSkills: ['Python', 'Machine Learning', 'SQL'],
    domainRequirements: {
      technical: 60,
      aptitude: 60,
      communication: 35,
      domainKnowledge: 55,
      softSkills: 35
    }
  },
  {
    id: 'J022',
    jobTitle: 'Software Test Engineer',
    company: 'QualityFirst',
    jobType: 'Full Time',
    location: 'Chennai, India',
    minScore: 40,
    requiredSkills: ['SQL', 'Git', 'Java'],
    domainRequirements: {
      technical: 50,
      aptitude: 55,
      communication: 45,
      domainKnowledge: 45,
      softSkills: 45
    }
  },
  {
    id: 'J023',
    jobTitle: 'GraphQL Developer',
    company: 'API Solutions',
    jobType: 'Full Time',
    location: 'Remote',
    minScore: 60,
    requiredSkills: ['GraphQL', 'Node.js', 'React', 'MongoDB'],
    domainRequirements: {
      technical: 70,
      aptitude: 45,
      communication: 40,
      domainKnowledge: 65,
      softSkills: 35
    }
  },
  {
    id: 'J024',
    jobTitle: 'Django Developer',
    company: 'PythonFirst',
    jobType: 'Full Time',
    location: 'Mumbai, India',
    minScore: 55,
    requiredSkills: ['Python', 'Django', 'SQL', 'REST API'],
    domainRequirements: {
      technical: 65,
      aptitude: 45,
      communication: 35,
      domainKnowledge: 60,
      softSkills: 35
    }
  },
  {
    id: 'J025',
    jobTitle: 'Technical Support Engineer',
    company: 'SupportPro',
    jobType: 'Full Time',
    location: 'Multiple Locations',
    minScore: 35,
    requiredSkills: ['SQL', 'Git', 'JavaScript'],
    domainRequirements: {
      technical: 40,
      aptitude: 45,
      communication: 65,
      domainKnowledge: 40,
      softSkills: 65
    }
  }
];

module.exports = jobs;