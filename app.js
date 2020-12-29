const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.send('Hello');
});

app.listen(process.env.PORT || 3000);