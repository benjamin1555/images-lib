exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Images Lib | Error 404',
    path: ''
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Images Lib | Error 500',
    path: ''
  });
};