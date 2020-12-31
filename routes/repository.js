const express = require('express');

const repositoryController = require('../controllers/repository');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', repositoryController.getHome);
router.get('/images/:imageId', repositoryController.getImage);
router.get('/add-image', isAuth, repositoryController.getAddImage);
router.post('/add-image', isAuth, repositoryController.postAddImage);
router.get('/edit-image/:imageId', isAuth, repositoryController.getEditImage)
router.post('/edit-image', isAuth, repositoryController.postEditImage);
router.post('/delete-image/:imageId', isAuth, repositoryController.deleteImage);

module.exports = router;