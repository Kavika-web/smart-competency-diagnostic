const mongoose = require('mongoose');

const competencyScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  },
  overallScore: {
    type: Number,
    default: 0
  },
  domainScores: {
    technical: { type: Number, default: 0 },
    aptitude: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    domainKnowledge: { type: Number, default: 0 },
    softSkills: { type: Number, default: 0 }
  },
  aiAnalysis: {
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    summary: { type: String, default: '' },
    recommendations: { type: [String], default: [] }
  },
  profileCompleteness: {
    type: Number,
    default: 0
  },

  profileLabel: {
  type: String,
  enum: ['Beginner', 'Developing', 'Competent', 'Proficient', 'Expert'],
  default: 'Beginner'
 },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CompetencyScore', competencyScoreSchema);