const { body } = require('express-validator');

const imageValidationRules = () => {
  return [
    body('imageUrl')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Image must be present.'),
    body('tags')
      .trim()
      .toLowerCase()
  ];
};

module.exports = imageValidationRules;