const express = require('express');
const router = express.Router();
const { getSkillGap } = require('../controllers/skillGapController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('candidate'), getSkillGap);

module.exports = router;