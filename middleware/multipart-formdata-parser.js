const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    req.body.image = 'image present';
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multipartFormdataParser = multer({ storage: fileStorage, fileFilter: fileFilter }).single('image');

module.exports = multipartFormdataParser;