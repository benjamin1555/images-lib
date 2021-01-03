const Image = require('../models/image');

const ITEMS_PER_PAGE = 6;

exports.getDashboard = async (req, res, next) => {
  const page = +req.query.page || 1;

  try {
    const imageCount = await Image.find({ user: req.user._id }).countDocuments();
    const userImages = await Image.find({ user: req.user._id })
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render('user/dashboard', {
      pageTitle: 'Images Lib | Dashboard',
      path: '/dashboard',
      images: userImages,
      imageCount,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < imageCount,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil((imageCount / ITEMS_PER_PAGE)),
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};