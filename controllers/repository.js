const path = require('path');

const Image = require('../models/image');
const User = require('../models/user');

exports.getHome = async (req, res, next) => {
  try {
    const images = await Image.find();

    res.render('home', {
      pageTitle: 'Images Lib | Home',
      path: '/',
      images
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
  const user = await User.findById(req.session.user);
  const image = new Image({
    user: user,
    imageUrl,
    tags
  });

  try {
    const savedImage = await image.save();
    await user.uploadedImages.push(savedImage._id);
    await user.save();
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
    imageToUpdate.imageUrl = imageUrl;
    imageToUpdate.tags = tags;

    await imageToUpdate.save();
    res.redirect(`/images/${imageId}`);
  } catch (err) {
    renderEditImage(req, res, imageId);
    console.log(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  const imageId = req.params.imageId;
  const user = await User.findById(req.session.user);

  try {
    const deletedImage = await Image.findByIdAndDelete(imageId);
    user.uploadedImages = user.uploadedImages.filter(imageId => {
      return imageId.toString() !== deletedImage._id.toString()
    });
    await user.save();
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
    image
  });
}

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
}