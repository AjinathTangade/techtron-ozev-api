const express = require('express');

const router = express.Router();

const { adminLogin } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getInstallers,
  approveInstaller,
  deleteInstaller
} = require('../controllers/adminInstallerController');

router.post('/login', adminLogin);

router.get('/installers', authMiddleware, getInstallers);
router.patch('/installers/:id/approve', authMiddleware, approveInstaller);
router.delete('/installers/:id', authMiddleware, deleteInstaller);

module.exports = router;
