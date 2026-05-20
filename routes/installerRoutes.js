const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const registerInstaller = require('../controllers/installerController');

router.post(
  '/register',
  upload.fields([
    { name: 'edition18', maxCount: 1 },
    { name: 'ozev', maxCount: 1 },
    { name: 'insurance', maxCount: 1 }
  ]),
  registerInstaller
);

module.exports = router;