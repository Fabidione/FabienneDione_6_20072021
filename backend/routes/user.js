const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/passwordVerified');


router.post('/signup', passwordVerified, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;