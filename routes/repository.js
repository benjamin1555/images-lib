const express = require('express');

const repositoryController = require('../controllers/repository');
const isAuth = require('../middleware/is-auth');
const { addImageValidationRules, editImageValidationRules } = require('../validations/image-validation');

const router = express.Router();

router.get('/', repositoryController.getHome);
router.post('/search-images', repositoryController.postSearchImages);
router.get('/images/:imageId', repositoryController.getImage);
router.get('/add-image', isAuth, repositoryController.getAddImage);
router.post('/add-image', isAuth, addImageValidationRules(), repositoryController.postAddImage);
router.get('/edit-image/:imageId', isAuth, repositoryController.getEditImage)
router.post('/edit-image', isAuth, editImageValidationRules(), repositoryController.postEditImage);
router.post('/delete-image/:imageId', isAuth, repositoryController.deleteImage);

module.exports = router;