const CompetencyScore = require('../models/CompetencyScore');
const CandidateProfile = require('../models/CandidateProfile');
const JobRecommendation = require('../models/JobRecommendation');
const trainingResources = require('../data/trainingResources');
const jobs = require('../data/jobs');

const getSkillGap = async (req, res) => {
  try {
    const [scoreData, profile, savedJobs] = await Promise.all([
      CompetencyScore.findOne({ userId: req.user.id }),
      CandidateProfile.findOne({ userId: req.user.id }),
      JobRecommendation.findOne({ userId: req.user.id })
    ]);

    if (!scoreData) {
      return res.status(404).json({
        message: 'Please complete the assessment first.'
      });
    }

    const candidateSkills = profile?.skills || [];

    // Collect all missing skills from top job matches
    const allMissingSkills = new Set();

    if (savedJobs?.recommendations) {
      savedJobs.recommendations.forEach(job => {
        job.missingSkills?.forEach(skill => allMissingSkills.add(skill));
      });
    }

    // Also check against all jobs if no saved recommendations
    if (allMissingSkills.size === 0) {
      jobs.forEach(job => {
        job.requiredSkills.forEach(skill => {
          if (!candidateSkills.map(s => s.toLowerCase())
            .includes(skill.toLowerCase())) {
            allMissingSkills.add(skill);
          }
        });
      });
    }

    // Build learning roadmap with resources
    const roadmap = Array.from(allMissingSkills).map(skill => ({
      skill,
      resources: trainingResources[skill] || [
        {
          title: `Search "${skill}" on YouTube`,
          platform: 'YouTube',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`,
          type: 'Video',
          duration: 'Self paced',
          free: true
        }
      ],
      priority: getPriority(skill, savedJobs?.recommendations || [])
    }));

    // Sort by priority
    const sorted = roadmap.sort((a, b) => b.priority - a.priority);

    // Domain weak areas
    const domainScores = scoreData.domainScores || {};
    const weakDomains = Object.entries(domainScores)
      .filter(([, score]) => score < 60)
      .sort((a, b) => a[1] - b[1])
      .map(([domain, score]) => ({ domain, score }));

    res.status(200).json({
      message: 'Skill gap analysis complete',
      candidateSkills,
      missingSkillsCount: sorted.length,
      roadmap: sorted,
      weakDomains,
      domainScores
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Higher priority = more jobs need this skill
const getPriority = (skill, recommendations) => {
  let count = 0;
  recommendations.forEach(job => {
    if (job.missingSkills?.includes(skill)) count++;
  });
  return count;
};

module.exports = { getSkillGap };