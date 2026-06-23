const questions = [
  // ---- TECHNICAL (5 questions) ----
  {
    id: 'T1',
    domain: 'technical',
    difficulty: 'easy',
    question: 'Which of the following is NOT a JavaScript data type?',
    options: ['String', 'Boolean', 'Float', 'Symbol'],
    answer: 'Float'
  },
  {
    id: 'T2',
    domain: 'technical',
    difficulty: 'medium',
    question: 'What does the "useEffect" hook do in React?',
    options: [
      'Manages component state',
      'Performs side effects after render',
      'Creates a new component',
      'Handles form submissions'
    ],
    answer: 'Performs side effects after render'
  },
  {
    id: 'T3',
    domain: 'technical',
    difficulty: 'medium',
    question: 'Which HTTP method is used to update an existing resource?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    answer: 'PUT'
  },
  {
    id: 'T4',
    domain: 'technical',
    difficulty: 'hard',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    answer: 'O(log n)'
  },
  {
    id: 'T5',
    domain: 'technical',
    difficulty: 'hard',
    question: 'In MongoDB, which operator is used to match any of the values in an array?',
    options: ['$in', '$all', '$match', '$eq'],
    answer: '$in'
  },

  // ---- APTITUDE (5 questions) ----
  {
    id: 'A1',
    domain: 'aptitude',
    difficulty: 'easy',
    question: 'If a train travels 120 km in 2 hours, what is its speed?',
    options: ['40 km/h', '60 km/h', '80 km/h', '100 km/h'],
    answer: '60 km/h'
  },
  {
    id: 'A2',
    domain: 'aptitude',
    difficulty: 'easy',
    question: 'What comes next in the series: 2, 4, 8, 16, __?',
    options: ['24', '28', '32', '36'],
    answer: '32'
  },
  {
    id: 'A3',
    domain: 'aptitude',
    difficulty: 'medium',
    question: 'A is 3 years older than B. B is 2 years younger than C. If C is 20, how old is A?',
    options: ['19', '20', '21', '22'],
    answer: '21'
  },
  {
    id: 'A4',
    domain: 'aptitude',
    difficulty: 'medium',
    question: 'If 6 workers complete a task in 8 days, how many days will 4 workers take?',
    options: ['10', '12', '14', '16'],
    answer: '12'
  },
  {
    id: 'A5',
    domain: 'aptitude',
    difficulty: 'hard',
    question: 'A shopkeeper sells at 20% profit. If cost is ₹500, what is selling price?',
    options: ['₹550', '₹580', '₹600', '₹620'],
    answer: '₹600'
  },

  // ---- COMMUNICATION (5 questions) ----
  {
    id: 'C1',
    domain: 'communication',
    difficulty: 'easy',
    question: 'Which of these is the most professional email greeting?',
    options: [
      'Hey!',
      'Dear Sir/Madam,',
      'Yo,',
      'Wassup,'
    ],
    answer: 'Dear Sir/Madam,'
  },
  {
    id: 'C2',
    domain: 'communication',
    difficulty: 'easy',
    question: 'What does "CC" mean in an email?',
    options: ['Carbon Copy', 'Certified Copy', 'Copied Content', 'Confirmed Contact'],
    answer: 'Carbon Copy'
  },
  {
    id: 'C3',
    domain: 'communication',
    difficulty: 'medium',
    question: 'Which tone is most appropriate in a professional workplace?',
    options: ['Casual and informal', 'Assertive and respectful', 'Aggressive', 'Overly emotional'],
    answer: 'Assertive and respectful'
  },
  {
    id: 'C4',
    domain: 'communication',
    difficulty: 'medium',
    question: 'Active listening means:',
    options: [
      'Waiting for your turn to speak',
      'Fully concentrating and responding thoughtfully',
      'Nodding without understanding',
      'Interrupting to show interest'
    ],
    answer: 'Fully concentrating and responding thoughtfully'
  },
  {
    id: 'C5',
    domain: 'communication',
    difficulty: 'hard',
    question: 'Which of these best describes "non-verbal communication"?',
    options: [
      'Written messages',
      'Body language, tone and facial expressions',
      'Phone calls',
      'Email threads'
    ],
    answer: 'Body language, tone and facial expressions'
  },

  // ---- DOMAIN KNOWLEDGE (5 questions) ----
  {
    id: 'D1',
    domain: 'domainKnowledge',
    difficulty: 'easy',
    question: 'What does API stand for?',
    options: [
      'Application Programming Interface',
      'Automated Process Integration',
      'Application Process Input',
      'Advanced Programming Interface'
    ],
    answer: 'Application Programming Interface'
  },
  {
    id: 'D2',
    domain: 'domainKnowledge',
    difficulty: 'easy',
    question: 'What is Git used for?',
    options: [
      'Database management',
      'Version control',
      'UI design',
      'Server deployment'
    ],
    answer: 'Version control'
  },
  {
    id: 'D3',
    domain: 'domainKnowledge',
    difficulty: 'medium',
    question: 'What is the purpose of JWT in web applications?',
    options: [
      'Styling components',
      'Authentication and authorization',
      'Database queries',
      'File uploads'
    ],
    answer: 'Authentication and authorization'
  },
  {
    id: 'D4',
    domain: 'domainKnowledge',
    difficulty: 'medium',
    question: 'Which of these is a NoSQL database?',
    options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
    answer: 'MongoDB'
  },
  {
    id: 'D5',
    domain: 'domainKnowledge',
    difficulty: 'hard',
    question: 'What is the difference between REST and GraphQL?',
    options: [
      'REST uses JSON, GraphQL uses XML',
      'GraphQL allows clients to request specific data, REST returns fixed endpoints',
      'REST is newer than GraphQL',
      'GraphQL only works with SQL databases'
    ],
    answer: 'GraphQL allows clients to request specific data, REST returns fixed endpoints'
  },

  // ---- SOFT SKILLS (5 questions) ----
  {
    id: 'S1',
    domain: 'softSkills',
    difficulty: 'easy',
    question: 'What is the most important quality of a good team player?',
    options: ['Working alone', 'Collaboration and communication', 'Taking all credit', 'Avoiding feedback'],
    answer: 'Collaboration and communication'
  },
  {
    id: 'S2',
    domain: 'softSkills',
    difficulty: 'easy',
    question: 'Time management is important because:',
    options: [
      'It helps meet deadlines and reduce stress',
      'It means working longer hours',
      'It eliminates the need for planning',
      'It replaces teamwork'
    ],
    answer: 'It helps meet deadlines and reduce stress'
  },
  {
    id: 'S3',
    domain: 'softSkills',
    difficulty: 'medium',
    question: 'When you receive critical feedback, you should:',
    options: [
      'Ignore it',
      'Get defensive',
      'Listen, reflect and improve',
      'Argue back immediately'
    ],
    answer: 'Listen, reflect and improve'
  },
  {
    id: 'S4',
    domain: 'softSkills',
    difficulty: 'medium',
    question: 'Which is the best approach when facing a difficult problem at work?',
    options: [
      'Give up immediately',
      'Break it into smaller steps and ask for help if needed',
      'Ignore the problem',
      'Wait for someone else to solve it'
    ],
    answer: 'Break it into smaller steps and ask for help if needed'
  },
  {
    id: 'S5',
    domain: 'softSkills',
    difficulty: 'hard',
    question: 'Emotional intelligence in the workplace means:',
    options: [
      'Hiding your emotions completely',
      'Understanding and managing your emotions and empathising with others',
      'Being emotional during meetings',
      'Avoiding all conflict'
    ],
    answer: 'Understanding and managing your emotions and empathising with others'
  }
];

export default questions;