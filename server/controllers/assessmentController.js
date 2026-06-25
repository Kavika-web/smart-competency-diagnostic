const Assessment = require('../models/Assessment');
const CompetencyScore = require('../models/CompetencyScore');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const { generateAIAnalysis } = require('../services/aiService');

const WEIGHTS = { easy: 1, medium: 2, hard: 3 };
const MAX_DOMAIN_SCORE = 11;

const calculateScores = (responses) => {
  const domains = ['technical', 'aptitude', 'communication', 'domainKnowledge', 'softSkills'];
  const domainScores = {};

  domains.forEach(domain => {
    const domainResponses = responses.filter(r => r.domain === domain);
    const earned = domainResponses.reduce((sum, r) => {
      return r.isCorrect ? sum + (WEIGHTS[r.difficulty] || 1) : sum;
    }, 0);
    domainScores[domain] = Math.round((earned / MAX_DOMAIN_SCORE) * 100);
  });

  const overallScore = Math.round(
    Object.values(domainScores).reduce((a, b) => a + b, 0) / domains.length
  );

  return { domainScores, overallScore };
};

// SUBMIT ASSESSMENT
const submitAssessment = async (req, res) => {
  try {
    const { responses, timeTaken } = req.body;

    if (!responses || responses.length === 0) {
      return res.status(400).json({ message: 'No responses provided' });
    }

    // Save assessment
    const assessment = await Assessment.create({
      userId: req.user.id,
      responses,
      status: 'completed',
      timeTaken,
      completedAt: Date.now()
    });

    // Calculate scores
    const { domainScores, overallScore } = calculateScores(responses);

    // Fetch candidate profile and user for AI context
    const [profile, user] = await Promise.all([
      CandidateProfile.findOne({ userId: req.user.id }),
      User.findById(req.user.id).select('name')
    ]);

    const profileWithName = {
      ...profile?.toObject(),
      name: user?.name
    };

    // Generate AI analysis
    console.log('Calling Gemini API for analysis...');
    const { success, analysis } = await generateAIAnalysis({
      profile: profileWithName,
      domainScores,
      overallScore,
      responses
    });

    if (success) {
      console.log('Gemini API analysis generated successfully');
    } else {
      console.log('Using fallback analysis');
    }

    // Calculate profile completeness
    const completeness = calculateCompleteness(profile);

    // Save competency score with AI analysis
    await CompetencyScore.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        assessmentId: assessment._id,
        overallScore,
        domainScores,
        aiAnalysis: {
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          summary: analysis.summary,
          recommendations: analysis.recommendations
        },
        profileLabel: analysis.profileLabel,
        profileCompleteness: completeness,
        generatedAt: Date.now()
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Assessment submitted successfully',
      overallScore,
      domainScores,
      aiAnalysis: analysis,
      aiPowered: success
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Profile completeness calculator
const calculateCompleteness = (profile) => {
  if (!profile) return 0;
  let score = 0;
  if (profile.phone) score += 20;
  if (profile.location) score += 20;
  if (profile.targetRole) score += 20;
  if (profile.skills?.length > 0) score += 20;
  if (profile.education?.degree) score += 20;
  return score;
};

// GET SCORE
const getScore = async (req, res) => {
  try {
    const score = await CompetencyScore.findOne({ userId: req.user.id });
    if (!score) {
      return res.status(404).json({ message: 'No score found. Take the assessment first.' });
    }
    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET HISTORY
const getHistory = async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('status timeTaken completedAt createdAt');
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitAssessment, getScore, getHistory };