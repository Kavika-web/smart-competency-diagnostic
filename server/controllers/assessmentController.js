const Assessment = require('../models/Assessment');
const CompetencyScore = require('../models/CompetencyScore');

// Difficulty weights
const WEIGHTS = { easy: 1, medium: 2, hard: 3 };

// Max possible score per domain (5 questions: 1 easy + 2 medium + 2 hard = 1+2+2+3+3 = 11)
const MAX_DOMAIN_SCORE = 11;

const calculateScores = (responses) => {
  const domains = ['technical', 'aptitude', 'communication', 'domainKnowledge', 'softSkills'];
  const domainScores = {};

  domains.forEach(domain => {
    const domainResponses = responses.filter(r => r.domain === domain);

    const earned = domainResponses.reduce((sum, r) => {
      if (r.isCorrect) {
        return sum + (WEIGHTS[r.difficulty] || 1);
      }
      return sum;
    }, 0);

    // Normalize to 100
    domainScores[domain] = Math.round((earned / MAX_DOMAIN_SCORE) * 100);
  });

  // Overall score = average of all domain scores
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

    // Save assessment to DB
    const assessment = await Assessment.create({
      userId: req.user.id,
      responses,
      status: 'completed',
      timeTaken,
      completedAt: Date.now()
    });

    // Calculate scores
    const { domainScores, overallScore } = calculateScores(responses);

    // Save or update competency score
    const competencyScore = await CompetencyScore.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        assessmentId: assessment._id,
        overallScore,
        domainScores,
        generatedAt: Date.now()
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Assessment submitted successfully',
      overallScore,
      domainScores,
      assessmentId: assessment._id
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
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

// GET ASSESSMENT HISTORY
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