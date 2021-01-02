const { body } = require('express-validator');

const loginValidationRules = () => {
  return [
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty.')
      .isEmail()
      .withMessage('Enter a valid email.'),
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty.')
  ];
};

module.exports = loginValidationRules;