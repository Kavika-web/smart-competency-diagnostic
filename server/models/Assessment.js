const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  questionId: String,
  domain: String,
  selectedOption: String,
  isCorrect: Boolean,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  }
});

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [responseSchema],
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  timeTaken: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', assessmentSchema);