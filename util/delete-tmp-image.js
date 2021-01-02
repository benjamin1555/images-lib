const fs = require('fs');

module.exports = filename => {
  fs.unlink(`tmp/images/${filename}`, err => {
    if (err) console.log(err);

    console.log(`Removed ${filename} from tmp/images`);
  });
};