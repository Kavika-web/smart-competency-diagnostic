const express = require('express');
const router = express.Router();
const { parseResume } = require('../controllers/resumeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/parse', protect, authorizeRoles('candidate'), upload.single('resume'), parseResume);

module.exports = router;