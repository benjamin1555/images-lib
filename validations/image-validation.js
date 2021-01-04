const { body } = require('express-validator');

const addImageValidationRules = () => {
  return [
    body('image')
      .not()
      .isEmpty()
      .withMessage('Image must be present and only with file extension .jpeg, .jpg or .png.'),
    body('imageTitle')
      .not()
      .isEmpty()
      .withMessage('Image title must be present.'),
    body('tags')
      .trim()
      .toLowerCase()
  ];
};

const editImageValidationRules = () => {
  return [
    body('imageTitle')
      .not()
      .isEmpty()
      .withMessage('Image title must be present.'),
    body('tags')
      .trim()
      .toLowerCase()
  ]
};

module.exports = {
  addImageValidationRules,
  editImageValidationRules
};