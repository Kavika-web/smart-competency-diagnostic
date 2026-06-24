const express = require('express');
const router = express.Router();
const {
  submitAssessment,
  getScore,
  getHistory
} = require('../controllers/assessmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/submit', protect, authorizeRoles('candidate'), submitAssessment);
router.get('/score', protect, authorizeRoles('candidate'), getScore);
router.get('/history', protect, authorizeRoles('candidate'), getHistory);

module.exports = router;