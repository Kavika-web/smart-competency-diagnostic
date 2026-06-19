const mongoose = require('mongoose');

const jobRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recommendations: [
    {
      jobTitle: String,
      company: String,
      matchPercentage: Number,
      requiredSkills: [String],
      missingSkills: [String],
      minScore: Number,
      jobType: String,
      location: String
    }
  ],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobRecommendation', jobRecommendationSchema);