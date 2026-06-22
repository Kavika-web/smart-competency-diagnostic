const pdfParse = require('pdf-parse');

const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    // Parse PDF from memory buffer
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // Extract profile fields from text
    const extracted = extractProfileData(text);

    res.status(200).json({
      message: 'Resume parsed successfully',
      extracted,
      rawText: text.substring(0, 500) // send first 500 chars for debugging
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to parse PDF', error: error.message });
  }
};

// ---- Extraction Logic ----

const extractProfileData = (text) => {
  return {
    phone: extractPhone(text),
    location: extractLocation(text),
    targetRole: extractTargetRole(text),
    skills: extractSkills(text),
    education: extractEducation(text)
  };
};

const extractPhone = (text) => {
  const match = text.match(/(\+91[\-\s]?)?[6-9]\d{9}/);
  return match ? match[0].trim() : '';
};

const extractLocation = (text) => {
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Chennai',
    'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur',
    'Lucknow', 'Coimbatore', 'Surat', 'Indore', 'Bhopal',
    'Nagpur', 'Patna', 'Vadodara', 'Visakhapatnam', 'Kochi'
  ];
  for (const city of cities) {
    if (text.toLowerCase().includes(city.toLowerCase())) {
      return city + ', India';
    }
  }
  return '';
};

const extractTargetRole = (text) => {
  const roles = [
    'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'Software Engineer', 'Web Developer', 'Data Scientist',
    'Machine Learning Engineer', 'DevOps Engineer', 'Android Developer',
    'React Developer', 'Node.js Developer', 'Python Developer',
    'Java Developer', 'UI/UX Designer', 'Cloud Engineer'
  ];
  for (const role of roles) {
    if (text.toLowerCase().includes(role.toLowerCase())) {
      return role;
    }
  }
  return '';
};

const extractSkills = (text) => {
  const knownSkills = [
    'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express',
    'Python', 'Java', 'C++', 'SQL', 'HTML', 'CSS',
    'TypeScript', 'Git', 'Docker', 'AWS', 'Machine Learning',
    'TailwindCSS', 'Bootstrap', 'Redux', 'GraphQL', 'Firebase',
    'MySQL', 'PostgreSQL', 'REST API', 'Spring Boot', 'Django'
  ];

  const found = [];
  for (const skill of knownSkills) {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      found.push(skill);
    }
  }
  return found;
};

const extractEducation = (text) => {
  const education = {
    degree: '',
    branch: '',
    college: '',
    graduationYear: ''
  };

  // Degree
  if (text.match(/b\.?tech|bachelor of technology/i)) education.degree = 'B.Tech';
  else if (text.match(/b\.?e\.?|bachelor of engineering/i)) education.degree = 'B.E';
  else if (text.match(/m\.?tech|master of technology/i)) education.degree = 'M.Tech';
  else if (text.match(/bca/i)) education.degree = 'BCA';
  else if (text.match(/mca/i)) education.degree = 'MCA';
  else if (text.match(/b\.?sc/i)) education.degree = 'B.Sc';

  // Branch
  if (text.match(/computer science|cse/i)) education.branch = 'Computer Science';
  else if (text.match(/information technology|it\b/i)) education.branch = 'Information Technology';
  else if (text.match(/electronics|ece/i)) education.branch = 'Electronics';
  else if (text.match(/mechanical/i)) education.branch = 'Mechanical';
  else if (text.match(/electrical/i)) education.branch = 'Electrical';

  // Graduation Year
  const yearMatch = text.match(/20(2[3-9]|3[0-5])/);
  if (yearMatch) education.graduationYear = yearMatch[0];

  return education;
};

module.exports = { parseResume };