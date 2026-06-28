const express = require('express');
const router = express.Router();
const {
  getJobRecommendations,
  getSavedRecommendations
} = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, authorizeRoles('candidate'), getJobRecommendations);
router.get('/saved', protect, authorizeRoles('candidate'), getSavedRecommendations);

module.exports = router;