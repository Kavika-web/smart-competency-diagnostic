const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/profileController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('candidate'), getProfile);
router.post('/', protect, authorizeRoles('candidate'), upsertProfile);

module.exports = router;