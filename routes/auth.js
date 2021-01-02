const express = require('express');

const authController = require('../controllers/auth');
const signupValidationRules = require('../validations/signup-validation');
const loginValidationRules = require('../validations/login-validation');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', signupValidationRules(), authController.postSignup);

module.exports = router;