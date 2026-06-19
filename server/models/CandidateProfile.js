const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  targetRole: {
    type: String,
    default: ''
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior'],
    default: 'fresher'
  },
  skills: {
    type: [String],
    default: []
  },
  education: {
    degree: { type: String, default: '' },
    branch: { type: String, default: '' },
    college: { type: String, default: '' },
    graduationYear: { type: String, default: '' }
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);