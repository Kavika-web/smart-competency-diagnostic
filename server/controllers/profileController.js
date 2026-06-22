const CandidateProfile = require('../models/CandidateProfile');

// GET profile
const getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE or UPDATE profile
const upsertProfile = async (req, res) => {
  try {
    const { phone, location, targetRole, experienceLevel, skills, education } = req.body;

    const profileData = {
      userId: req.user.id,
      phone,
      location,
      targetRole,
      experienceLevel,
      skills,
      education,
      updatedAt: Date.now()
    };

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: req.user.id },
      profileData,
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, upsertProfile };