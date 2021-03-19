const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const security = require('../middleware/security');

router.post('/signup', security, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;