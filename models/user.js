const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    uploadedImages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        default: []
      }
    ]
  }, { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);