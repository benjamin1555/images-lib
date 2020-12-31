const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    tags: {
      type: Array
    }
  }, { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);