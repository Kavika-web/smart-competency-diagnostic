const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
require('./models/User');
require('./models/CandidateProfile');
require('./models/Assessment');
require('./models/CompetencyScore');
require('./models/JobRecommendation');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Smart Competency API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/skillgap',skillGapRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  tlsInsecure: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log('MongoDB error:', err));