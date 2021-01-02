const Image = require('../models/image');

exports.getDashboard = async (req, res, next) => {
  try {
    const userImages = await Image.find({ user: req.user._id })
      .sort({ createdAt: 'desc' });

    res.render('user/dashboard', {
      pageTitle: 'Images Lib | Dashboard',
      path: '/dashboard',
      images: userImages
    });
  } catch (err) {
    console.log(err);
  }
};