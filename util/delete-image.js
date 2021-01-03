const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteImage = cloudinaryPublicId => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      cloudinaryPublicId, function(err, result) {
        if (err) reject(err);
        console.log(`Cloudinary ${cloudinaryPublicId} destroyed.`);
        resolve(result);
      });
  });
};

module.exports = {
  deleteImage
};