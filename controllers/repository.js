const { validationResult } = require('express-validator');

const Image = require('../models/image');
const uploadImage = require('../util/upload-image');
const cloudinaryStorage = require('../util/delete-image');

const ITEMS_PER_PAGE = 9;

exports.getHome = async (req, res, next) => {
  const page = +req.query.page || 1;

  try {
    const imageCount = await Image.find().countDocuments();
    const images = await Image.find()
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render('home', {
      pageTitle: 'Images Lib | Home',
      path: '/',
      images,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < imageCount,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil((imageCount / ITEMS_PER_PAGE)),
      successMessage: req.flash('success'),
      infoMessage: req.flash('info')
    });
  } catch (err) {
    next(err);
  }
};

exports.postSearchImages = async (req, res, next) => {
  const searchFilter = req.body.searchFilter.trim().toLowerCase();
  const searchQuery = req.body.queryString.trim().toLowerCase();
  const searchRegExp = new RegExp(searchQuery, 'i');
  const page = +req.query.page || 1;
  let findQuery;

  if (searchFilter === 'tags') {
    findQuery = { tags: { $in: [searchRegExp] } };
  } else {
    findQuery = { imageTitle: searchRegExp };
  }

  try {
    const imageCount = await Image.find(findQuery).countDocuments();
    const images = await Image.find(findQuery)
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render('search-results', {
      pageTitle: 'Images Lib | Search Results',
      path: '/search-results',
      images,
      searchQuery,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < imageCount,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil((imageCount / ITEMS_PER_PAGE)),
      successMessage: req.flash('success'),
      infoMessage: req.flash('info')
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getImage = async (req, res, next) => {
  const imageId = req.params.imageId;
  try {
    renderImageDetail(req, res, imageId);
  } catch (err) {
    next(err);
  }
};

exports.getAddImage = (req, res, next) => {
  renderAddImage(req, res);
};

exports.postAddImage = async (req, res, next) => {
  try {
    let imageUrl;
    let cloudinaryPublicId;
    if (req.file) {
      const uploadedImage = await uploadImage(req.file);
      imageUrl = uploadedImage.secure_url;
      cloudinaryPublicId = uploadedImage.public_id;
    }
    const imageTitle = req.body.imageTitle;
    const tags = req.body.tags.split(',')
      .map(tag => tag.trim())
      .sort();
    const user = req.user;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return renderAddImage(req, res);
    }

    const image = new Image({
      user: user,
      imageUrl,
      cloudinaryPublicId,
      tags,
      imageTitle
    });

    const savedImage = await image.save();
    await user.uploadedImages.push(savedImage._id);
    await user.save();
    req.flash('info', 'Image uploaded.');
    res.redirect(`/images/${savedImage._id}`);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getEditImage = async (req, res, next) => {
  const imageId = req.params.imageId;

  try {
    renderEditImage(req, res, imageId);
  } catch (err) {
    next(err);
  }
};

exports.postEditImage = async (req, res, next) => {
  let imageUrl;
  let cloudinaryPublicId;
  try {
    if (req.file) {
      const uploadedImage = await uploadImage(req.file);
      imageUrl = uploadedImage.secure_url;
      cloudinaryPublicId = uploadedImage.public_id;
    }
    const imageTitle = req.body.imageTitle;
    const imageId = req.body.imageId;
    const tags = req.body.tags.split(',')
      .map(tag => tag.trim())
      .sort();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return renderEditImage(req, res, imageId);
  }

    const imageToUpdate = await Image.findById(imageId);
    if (!isUserAllowedToAlterImage(req.user, imageToUpdate)) {
      return res.redirect('/');
    }
    if (imageUrl) {
      await cloudinaryStorage.deleteImage(imageToUpdate.cloudinaryPublicId);
    }
    imageToUpdate.imageUrl = imageUrl || imageToUpdate.imageUrl;
    imageToUpdate.cloudinaryPublicId = cloudinaryPublicId || imageToUpdate.cloudinaryPublicId;
    imageToUpdate.tags = tags;
    imageToUpdate.imageTitle = imageTitle;
    await imageToUpdate.save();
    req.flash('info', 'Image edited.');
    res.redirect(`/images/${imageId}`);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  const imageId = req.params.imageId;
  const user = req.user;

  try {
    const imageToDelete = await Image.findById(imageId);
    if (!isUserAllowedToAlterImage(user, imageToDelete)) {
      return res.redirect('/');
    }
    const deletedImage = await Image.findByIdAndDelete(imageId);
    req.flash('info', 'Image deleted.');
    removeImageIdFromUserUploadedImages(user, deletedImage);
    await cloudinaryStorage.deleteImage(deletedImage.cloudinaryPublicId);
    await user.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

exports.deleteBulkImages = async (req, res, next) => {
  const imagesToDeleteIds = req.body.imagesToDelete;
  const user = req.user;

  try {
    const imagesToDelete = await Image.find({ _id: { $in: imagesToDeleteIds } });

    const deleteCloudinaryImagesPromises = [];
    imagesToDelete.forEach(img => {
      removeImageIdFromUserUploadedImages(user, img);
      deleteCloudinaryImagesPromises.push(cloudinaryStorage.deleteImage(img.cloudinaryPublicId));
    });
    await Promise.all(deleteCloudinaryImagesPromises);
    await Image.deleteMany({ _id: { $in: imagesToDeleteIds } });
    await user.save();
    res.end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Private

const renderImageDetail = async (req, res, imageId) => {
  image = await Image.findById(imageId).populate('user', 'username');

  res.render('image-detail', {
    pageTitle: 'Images Lib | Details',
    path: '/image-detail',
    infoMessage: req.flash('info'),
    userAllowedToAlterImage: isUserAllowedToAlterImage(req.user, image),
    image,
  });
};

const renderAddImage = (req, res) => {
  const statusCode = isValidationResultEmpty(req) ? 200 : 422;

  res.status(statusCode).render('edit-image', {
    pageTitle: 'Images Lib | Add Image',
    path: '/add-image',
    editing: false,
    validationErrors: validationResult(req).array()
  });
};

const renderEditImage = async (req, res, imageId) => {
  image = await Image.findById(imageId);
  const statusCode = isValidationResultEmpty(req) ? 200 : 422;

  res.status(statusCode).render('edit-image', {
    pageTitle: 'Images Lib | Edit Image',
    path: '/',
    editing: true,
    image,
    validationErrors: validationResult(req).array()
  });
};

const removeImageIdFromUserUploadedImages = (user, deletedImage) => {
  user.uploadedImages = user.uploadedImages.filter(imageId => {
    return imageId.toString() !== deletedImage._id.toString()
  });
};

const isUserAllowedToAlterImage = (user, image) => {
  if (!user) return false;

  const imageUserId = (image.user._id || image.user);
  return imageUserId.toString() === user._id.toString();
};

const isValidationResultEmpty = req => {
  return validationResult(req).array().length === 0;
}