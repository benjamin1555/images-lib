const { body } = require('express-validator');

const User = require('../models/user');

const signupValidationRules = () => {
  return [
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty.')
      .isEmail()
      .withMessage('Enter a valid email.')
      .custom(value => {
        return User.findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('This email is already taken.');
            }
          });
      }),
    body('username')
      .trim()
      .toLowerCase()
      .not()
      .isEmpty()
      .withMessage('Username cannot be empty.')
      .custom((value, { req }) => {
        return User.findOne({ username: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('This username is already taken.');
            }
          });
      }),
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty.')
      .custom(value => {
        if (!/\d/.test(value) || !/[A-Z]/.test(value) || value.length < 8) {
          throw new Error('Password must be at least 8 characters long, contains at least a number and an uppercase letter.');
        }
        return true;
      })
      .custom((value, { req }) => {
        if (value !== req.body.passwordConfirmation) {
          throw new Error('Password must match password confirmation.');
        }
        return true;
      })
  ];
};

module.exports = signupValidationRules;