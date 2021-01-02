const Image = require('../models/image');

exports.getHome = async (req, res, next) => {
  try {
    const images = await Image.find();

    res.render('home', {
      pageTitle: 'Images Lib | Home',
      path: '/',
      images,
      successMessage: req.flash('success'),
      infoMessage: req.flash('info')
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getImage = async (req, res, next) => {
  const imageId = req.params.imageId;
  try {
    renderImageDetail(req, res, imageId);
  } catch (err) {
    console.log(err);
  }
};

exports.getAddImage = (req, res, next) => {
  renderAddImage(req, res);
};

exports.postAddImage = async (req, res, next) => {
  const imageUrl = req.body.imageUrl.trim();
  const tags = req.body.tags.trim().split(' ');
  const user = req.user;
  const image = new Image({
    user: user,
    imageUrl,
    tags
  });

  try {
    const savedImage = await image.save();
    await user.uploadedImages.push(savedImage._id);
    await user.save();
    req.flash('info', 'Image uploaded.');
    res.redirect(`/images/${savedImage._id}`);
  } catch (err) {
    renderAddImage(req, res);
    console.log(err);
  }
};

exports.getEditImage = async (req, res, next) => {
  const imageId = req.params.imageId;

  try {
    renderEditImage(req, res, imageId);
  } catch (err) {
    console.log(err);
  }
};

exports.postEditImage = async (req, res, next) => {
  const imageId = req.body.imageId;
  const imageUrl = req.body.imageUrl.trim();
  const tags = req.body.tags.trim().split(' ');

  try {
    const imageToUpdate = await Image.findById(imageId);
    if (imageToUpdate.user.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }
    imageToUpdate.imageUrl = imageUrl;
    imageToUpdate.tags = tags;
    await imageToUpdate.save();
    req.flash('info', 'Image edited.');
    res.redirect(`/images/${imageId}`);
  } catch (err) {
    renderEditImage(req, res, imageId);
    console.log(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  const imageId = req.params.imageId;
  const user = req.user;
  const imageToDelete = await Image.findById(imageId);

  try {
    if (imageToDelete.user.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }
    const deletedImage = await Image.findByIdAndDelete(imageId);
    removeImageIdFromUserUploadedImages(user, deletedImage);
    await user.save();
    req.flash('info', 'Image deleted.');
    res.redirect('/');
  } catch (err) {
    res.redirect('/');
    console.log(err);
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
  res.render('edit-image', {
    pageTitle: 'Images Lib | Add Image',
    path: '/add-image',
    editing: false
  });
};

const renderEditImage = async (req, res, imageId) => {
  image = await Image.findById(imageId);

  res.render('edit-image', {
    pageTitle: 'Images Lib | Edit Image',
    path: '/',
    editing: true,
    image
  });
};

const removeImageIdFromUserUploadedImages = (user, deletedImage) => {
  user.uploadedImages = user.uploadedImages.filter(imageId => {
    return imageId.toString() !== deletedImage._id.toString()
  });
};

const isUserAllowedToAlterImage = (user, image) => {
  return image.user._id.toString() === user._id.toString();
};