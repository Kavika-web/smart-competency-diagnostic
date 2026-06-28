const JobRecommendation = require('../models/JobRecommendation');
const CompetencyScore = require('../models/CompetencyScore');
const CandidateProfile = require('../models/CandidateProfile');
const jobs = require('../data/jobs');

// Match score calculator
const calculateMatchPercentage = (candidate, job) => {
  let totalPoints = 0;
  let earnedPoints = 0;

  // 1. Overall score check (30 points)
  totalPoints += 30;
  if (candidate.overallScore >= job.minScore) {
    earnedPoints += 30;
  } else {
    // Partial credit
    earnedPoints += Math.round(
      (candidate.overallScore / job.minScore) * 30
    );
  }

  // 2. Domain scores check (40 points — 8 per domain)
  const domains = Object.keys(job.domainRequirements);
  domains.forEach(domain => {
    totalPoints += 8;
    const candidateScore = candidate.domainScores[domain] || 0;
    const required = job.domainRequirements[domain];
    if (candidateScore >= required) {
      earnedPoints += 8;
    } else {
      earnedPoints += Math.round((candidateScore / required) * 8);
    }
  });

  // 3. Skills match (30 points)
  totalPoints += 30;
  const candidateSkills = candidate.skills.map(s => s.toLowerCase());
  const requiredSkills = job.requiredSkills.map(s => s.toLowerCase());
  const matchedSkills = requiredSkills.filter(s => candidateSkills.includes(s));
  earnedPoints += Math.round((matchedSkills.length / requiredSkills.length) * 30);

  return Math.min(100, Math.round((earnedPoints / totalPoints) * 100));
};

// Get missing skills
const getMissingSkills = (candidateSkills, requiredSkills) => {
  const lower = candidateSkills.map(s => s.toLowerCase());
  return requiredSkills.filter(s => !lower.includes(s.toLowerCase()));
};

// GENERATE JOB RECOMMENDATIONS
const getJobRecommendations = async (req, res) => {
  try {
    // Fetch score and profile
    const [scoreData, profile] = await Promise.all([
      CompetencyScore.findOne({ userId: req.user.id }),
      CandidateProfile.findOne({ userId: req.user.id })
    ]);

    if (!scoreData) {
      return res.status(404).json({
        message: 'Please complete the assessment first to get job recommendations.'
      });
    }

    const candidateSkills = profile?.skills || [];

    const candidate = {
      overallScore: scoreData.overallScore,
      domainScores: scoreData.domainScores,
      skills: candidateSkills
    };

    // Score all jobs
    const scored = jobs.map(job => {
      const matchPercentage = calculateMatchPercentage(candidate, job);
      const missingSkills = getMissingSkills(candidateSkills, job.requiredSkills);
      return {
        ...job,
        matchPercentage,
        missingSkills
      };
    });

    // Sort by match percentage descending
    const sorted = scored.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Top 8 matches
    const top8 = sorted.slice(0, 8);

    // Save to DB
    await JobRecommendation.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        recommendations: top8,
        generatedAt: Date.now()
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Job recommendations generated',
      totalMatched: scored.filter(j => j.matchPercentage >= 50).length,
      recommendations: top8
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET SAVED RECOMMENDATIONS
const getSavedRecommendations = async (req, res) => {
  try {
    const saved = await JobRecommendation.findOne({ userId: req.user.id });
    if (!saved) {
      return res.status(404).json({ message: 'No recommendations found.' });
    }
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getJobRecommendations, getSavedRecommendations };