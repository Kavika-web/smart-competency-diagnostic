const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAIAnalysis = async (candidateData) => {
  const {
    profile,
    domainScores,
    overallScore,
    responses
  } = candidateData;

  // Build domain performance summary
  const domainSummary = Object.entries(domainScores)
    .map(([domain, score]) => `${domain}: ${score}/100`)
    .join(', ');

  // Count correct answers per domain
  const domainCorrect = {};
  responses.forEach(r => {
    if (!domainCorrect[r.domain]) {
      domainCorrect[r.domain] = { correct: 0, total: 0 };
    }
    domainCorrect[r.domain].total++;
    if (r.isCorrect) domainCorrect[r.domain].correct++;
  });

  const correctSummary = Object.entries(domainCorrect)
    .map(([d, v]) => `${d}: ${v.correct}/${v.total} correct`)
    .join(', ');

  const prompt = `
You are an expert HR talent assessment AI. Analyze this candidate's competency assessment results and provide a detailed evaluation.

CANDIDATE PROFILE:
- Name: ${profile?.name || 'Candidate'}
- Target Role: ${profile?.targetRole || 'Not specified'}
- Experience Level: ${profile?.experienceLevel || 'fresher'}
- Skills: ${profile?.skills?.join(', ') || 'Not specified'}
- Education: ${profile?.education?.degree || ''} in ${profile?.education?.branch || ''} from ${profile?.education?.college || ''}

ASSESSMENT RESULTS:
- Overall Score: ${overallScore}/100
- Domain Scores: ${domainSummary}
- Correct Answers: ${correctSummary}

Based on this data, provide a JSON response with EXACTLY this structure and nothing else:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "summary": "A 2-3 sentence professional summary of this candidate's competency profile",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "profileLabel": "one of: Beginner | Developing | Competent | Proficient | Expert"
}

Rules:
- strengths and weaknesses must have exactly 3 items each
- recommendations must have exactly 3 items each
- summary must be 2-3 sentences
- profileLabel must be one of the 5 options above
- Return ONLY the JSON object, no extra text or markdown backticks
`;

  try {
    const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean and parse JSON
    const cleaned = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const analysis = JSON.parse(cleaned);
    return { success: true, analysis };

  } catch (error) {
    console.error('Gemini API error:', error);

    // Fallback analysis if API fails
    const fallback = generateFallbackAnalysis(domainScores, overallScore);
    return { success: false, analysis: fallback };
  }
};

// Rule-based fallback if Gemini API fails
const generateFallbackAnalysis = (domainScores, overallScore) => {
  const sorted = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);
  const topDomains = sorted.slice(0, 2).map(d => d[0]);
  const weakDomains = sorted.slice(-2).map(d => d[0]);

  const labelMap = [
    [80, 'Expert'],
    [65, 'Proficient'],
    [50, 'Competent'],
    [35, 'Developing'],
    [0,  'Beginner']
  ];
  const profileLabel = labelMap.find(([min]) => overallScore >= min)[1];

  return {
    strengths: [
      `Strong performance in ${topDomains[0]}`,
      `Good grasp of ${topDomains[1]} concepts`,
      `Overall score of ${overallScore} shows solid foundational knowledge`
    ],
    weaknesses: [
      `Needs improvement in ${weakDomains[0]}`,
      `${weakDomains[1]} skills require more practice`,
      'Some advanced concepts need deeper understanding'
    ],
    summary: `This candidate scored ${overallScore}/100 overall, demonstrating ${profileLabel.toLowerCase()} level competency. Their strongest areas are ${topDomains.join(' and ')}, while ${weakDomains.join(' and ')} need further development.`,
    recommendations: [
      `Focus on improving ${weakDomains[0]} through hands-on projects`,
      `Take online courses to strengthen ${weakDomains[1]}`,
      'Practice more advanced problem-solving exercises'
    ],
    profileLabel
  };
};

module.exports = { generateAIAnalysis };