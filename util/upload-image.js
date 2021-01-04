const cloudinary = require('cloudinary').v2;
const { nanoid } = require('nanoid');
require('dotenv').config();

const deleteTmpImage = require('./delete-tmp-image');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = file => {
  const filename = `${nanoid()}_${file.originalname}`;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      {
        tags: filename,
        public_id: `shopify-challenge/${filename}`
      },
      function(err, image) {
        if (err) return reject(err);
        // For dev purpose only
        // deleteTmpImage(file.originalname);
        return resolve(image);
      });
  });
};

module.exports = uploadImage;