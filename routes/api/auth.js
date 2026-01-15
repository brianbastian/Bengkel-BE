const express = require('express');
const authController = require('../../controllers/auth');
const { verifyToken } = require('../../middlewares/auth');
const validation = require('../../middlewares/validator');

const router = express.Router();

router.post('/login', validation.validate('login'), authController.login);
router.get('/profile', verifyToken, authController.profile);

// FOR TESTING ONLY
router.post('/register', authController.register);

module.exports = router;