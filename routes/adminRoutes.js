const express = require('express');

const router = express.Router();

const {
  adminLogin
} = require('../controllers/adminController');
const authMiddleware =
require('../middleware/authMiddleware');
const {
  getInstallers
} = require('../controllers/adminInstallerController');
router.get(
  '/installers',
  authMiddleware,
  getInstallers
);
router.post('/login', adminLogin);

module.exports = router;